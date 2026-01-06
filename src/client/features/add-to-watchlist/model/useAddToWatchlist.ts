"use client";

import { useMemo } from "react";
import {
  removeWatchlistDataItem,
  useAddToWatchlistMutation,
  useGetWatchlistQuery,
  useRemoveFromWatchlistMutation,
} from "@/client/entities/watchlist";
import type { KpMovieId } from "@/client/entities/media-detail";
import { showSnackbar } from "@/client/entities/alert";
import { useAppDispatch } from "@/client/shared/config";

export const useAddToWatchlist = (id?: KpMovieId | null) => {
  const dispatch = useAppDispatch();

  const [addToWatchlist, { isLoading: isAdding }] = useAddToWatchlistMutation();
  const [removeFromWatchlist, { isLoading: isRemoving }] = useRemoveFromWatchlistMutation();
  const { data: watchlistData, isSuccess } = useGetWatchlistQuery();

  const inWatchlist = useMemo(() => {
    if (!id || !isSuccess || !watchlistData?.watchlist) return false;
    return watchlistData.watchlist.some((item) => String(item) === String(id));
  }, [watchlistData, id, isSuccess]);

  const handleButtonClick = async () => {
    if (!id) return;

    try {
      if (inWatchlist) {
        dispatch(removeWatchlistDataItem(id));

        await removeFromWatchlist({ id }).unwrap();

        dispatch(
          showSnackbar({
            open: true,
            severity: "info",
            message: "Removed from watchlist",
            autoHideDuration: 5000,
          }),
        );
      } else {
        await addToWatchlist({ id }).unwrap();

        dispatch(
          showSnackbar({
            open: true,
            severity: "success",
            message: "Added to watchlist",
            autoHideDuration: 5000,
          }),
        );
      }
    } catch (e) {
      console.error("Failed to update watchlist:", e);

      dispatch(
        showSnackbar({
          open: true,
          severity: "error",
          message: "Failed to update watchlist",
          autoHideDuration: 5000,
        }),
      );
    }
  };

  const isLoading = isAdding ?? isRemoving;
  return {
    watchlistData,
    handleButtonClick,
    inWatchlist,
    isLoading,
    isDisabled: !id || !watchlistData,
  };
};
