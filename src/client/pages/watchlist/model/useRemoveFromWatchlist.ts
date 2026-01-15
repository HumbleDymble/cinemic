import { useTranslation } from "react-i18next";
import {
  addWatchlistDataItem,
  removeWatchlistDataItem,
  useRemoveFromWatchlistMutation,
} from "@/entities/watchlist";
import type { KpMovieId } from "@/entities/media-detail";
import { useAppDispatch, useAppSelector } from "@/shared/config";
import { showSnackbar } from "@/entities/alert";

export const useRemoveFromWatchlist = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [removeFromWatchlist, { isLoading }] = useRemoveFromWatchlistMutation();
  const watchlistItems = useAppSelector((state) => state.watchlist.watchlistData);

  const handleRemove = async (id: KpMovieId | null) => {
    if (!id) return;

    const backupItem = watchlistItems.find((i) => i.id === id);

    try {
      dispatch(removeWatchlistDataItem(id));
      dispatch(
        showSnackbar({
          open: true,
          message: t("pages.watchlist.snackbar.removed"),
          severity: "success",
          autoHideDuration: 3000,
        }),
      );

      await removeFromWatchlist({ id }).unwrap();
    } catch (e) {
      console.error("Failed to remove:", e);

      if (backupItem) dispatch(addWatchlistDataItem(backupItem));

      dispatch(
        showSnackbar({
          open: true,
          message: t("pages.watchlist.snackbar.sync_failed_restored"),
          severity: "error",
        }),
      );
    }
  };

  return { handleRemove, isLoading };
};
