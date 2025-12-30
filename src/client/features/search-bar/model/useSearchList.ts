import { type KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { operateRecentViewedData, type RecentViewedType } from "./slice";
import type { SearchMovieDtoV1_4, SearchMovieResponseDtoV1_4 } from "@/entities/media-detail";
import { useAppDispatch } from "@/shared/config";

interface Props {
  search: string;
  clearSearch: () => void;
  data: SearchMovieResponseDtoV1_4 | undefined;
}

export const useSearchList = ({ search, clearSearch, data }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const results = useMemo(() => data?.docs ?? [], [data]);

  const recordRecentViewed = useCallback(
    (item: SearchMovieDtoV1_4) => {
      if (item.id == null) return;

      const ruTitle = item.name ?? item.alternativeName ?? item.enName ?? "Untitled";
      const enTitle = item.enName ?? item.alternativeName ?? item.name ?? "Untitled";

      const img = item.poster?.previewUrl ?? item.poster?.url ?? "";

      const mappedItem: RecentViewedType = {
        id: item.id,
        title: { ru: ruTitle, en: enTitle },
        image: { ru: img, en: img },
        year: item.year ?? undefined,
        type: item.type ?? undefined,
      };

      dispatch(operateRecentViewedData(mappedItem));
    },
    [dispatch],
  );

  useEffect(() => {
    setSelectedIndex(-1);
  }, [search, results.length]);

  const activateIndex = useCallback(
    (index: number) => {
      if (!search || results.length === 0) return;
      if (index < 0 || index >= results.length) return;

      const item = results[index];
      if (item?.id == null) return;

      recordRecentViewed(item);
      void navigate(`/title/${item.id}`);
      clearSearch();
    },
    [clearSearch, navigate, recordRecentViewed, results, search],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!search) return;

      switch (e.key) {
        case "ArrowDown": {
          if (results.length === 0) return;
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        }
        case "ArrowUp": {
          if (results.length === 0) return;
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        }
        case "Enter": {
          if (results.length === 0) return;
          e.preventDefault();
          const indexToOpen = selectedIndex >= 0 ? selectedIndex : 0;
          activateIndex(indexToOpen);
          break;
        }
        case "Escape": {
          e.preventDefault();
          clearSearch();
          setSelectedIndex(-1);
          break;
        }
        default:
          break;
      }
    },
    [activateIndex, clearSearch, results.length, search, selectedIndex],
  );

  const handleItemClick = useCallback(
    (item: SearchMovieDtoV1_4) => {
      recordRecentViewed(item);
      clearSearch();
      setSelectedIndex(-1);
    },
    [clearSearch, recordRecentViewed],
  );

  const handleItemHover = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return {
    results,
    selectedIndex,
    handleKeyDown,
    handleItemClick,
    handleItemHover,
    setSelectedIndex,
  };
};
