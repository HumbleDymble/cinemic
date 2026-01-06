"use client";

import { useCallback, useEffect, useState } from "react";
import { type MovieDtoV1_4, useLazyGetRandomTitleQuery } from "@/client/entities/media-detail";
import { dbService, type MovieHistoryItem } from "./db";

export const useRandomTitle = () => {
  const [filters, setFilters] = useState({
    type: "movie",
    genre: "триллер",
    year: "2012",
    minRating: "7",
  });
  const [currentMovie, setCurrentMovie] = useState<MovieDtoV1_4 | null>(null);
  const [history, setHistory] = useState<MovieHistoryItem[]>([]);

  const [fetchRandomMovie, { isFetching }] = useLazyGetRandomTitleQuery();

  useEffect(() => {
    dbService.getAll().then(setHistory).catch(console.error);
  }, []);

  const handleFilterChange = useCallback((field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleRoll = useCallback(async () => {
    setCurrentMovie(null);
    try {
      const result = await fetchRandomMovie({
        type: filters.type,
        "genres.name": filters.genre !== "Any" ? filters.genre : undefined,
        year: filters.year || undefined,
        "rating.kp": filters.minRating ? `${filters.minRating}-10` : undefined,
      }).unwrap();

      if (result?.id) {
        setCurrentMovie(result);
        await dbService.add(result);
        const newHistory = await dbService.getAll();
        setHistory(newHistory);
      }
    } catch (e) {
      console.error("API Error", e);
    }
  }, [filters, fetchRandomMovie]);

  const handleClearHistory = useCallback(async () => {
    await dbService.clear();
    setHistory([]);
  }, []);

  return {
    filters,
    currentMovie,
    history,
    isFetching,
    onFilterChange: handleFilterChange,
    onRoll: handleRoll,
    onClearHistory: handleClearHistory,
  };
};
