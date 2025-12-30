import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { type ReviewAction, type ReviewModeratedParams } from "./types";
import { useModeratorDeleteReviewMutation, useModeratorGetReviewsQuery } from "../api/endpoints";
import type { Review } from "@/entities/review";
import { showSnackbar } from "@/entities/alert";
import { useAppDispatch } from "@/shared/config";
import { useToggle } from "@/shared/lib/hooks";

export const useModeratorReviewTable = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [filterStatus, setFilterStatus] = useState<Review["status"] | "all">("pending");

  const {
    data: reviews,
    error,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useModeratorGetReviewsQuery(filterStatus);

  const [deleteReview, { isLoading: isDeleting }] = useModeratorDeleteReviewMutation();

  const [dialogOpen, setDialogOpen] = useToggle(false);
  const [selectedReview, setSelectedReview] = useState<ReviewModeratedParams | null>(null);
  const [currentAction, setCurrentAction] = useState<ReviewAction | null>(null);

  const [quickDelete, setQuickDelete] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewModeratedParams | null>(null);

  const handleActionClick = useCallback(
    (review: ReviewModeratedParams, action: ReviewAction) => {
      setSelectedReview(review);
      setCurrentAction(action);
      setDialogOpen(true);
    },
    [setDialogOpen],
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedReview(null);
    setCurrentAction(null);
  }, [setDialogOpen]);

  const handleFilterChange = useCallback((event: SelectChangeEvent<Review["status"] | "all">) => {
    setFilterStatus(event.target.value);
  }, []);

  const handleRemove = useCallback(
    async (review: ReviewModeratedParams) => {
      try {
        await deleteReview({ reviewId: review._id }).unwrap();
        dispatch(
          showSnackbar({
            open: true,
            message: t("moderator.reviewsTable.snackbar.removed"),
            severity: "success",
            autoHideDuration: 5000,
          }),
        );
      } catch (e) {
        console.error("Failed to remove:", e);
        dispatch(
          showSnackbar({
            open: true,
            message: t("moderator.reviewsTable.snackbar.removeFailed"),
            severity: "error",
            autoHideDuration: 5000,
          }),
        );
      }
    },
    [deleteReview, dispatch, t],
  );

  useEffect(() => {
    if (!isError || !error) return;

    const errorMessage =
      typeof error === "object" && error && "data" in error && error.data
        ? JSON.stringify(error.data)
        : t("moderator.reviewsTable.errors.unknown");

    dispatch(showSnackbar({ open: true, severity: "error", message: errorMessage }));
  }, [isError, error, dispatch, t]);

  const handleDeleteClick = useCallback(
    async (review: ReviewModeratedParams) => {
      if (quickDelete) {
        await handleRemove(review);
        return;
      }
      setReviewToDelete(review);
      setDeleteDialogOpen(true);
    },
    [quickDelete, handleRemove],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (reviewToDelete) {
      await handleRemove(reviewToDelete);
    }
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  }, [reviewToDelete, handleRemove]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  }, []);

  const quickDeleteChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuickDelete(e.target.checked);
  }, []);

  const refetchReviews = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    reviews,
    isLoading,
    isFetching,
    filterStatus,
    handleFilterChange,
    dialogOpen,
    selectedReview,
    currentAction,
    handleActionClick,
    handleDialogClose,
    isDeleting,
    quickDelete,
    quickDeleteChange,
    handleDeleteClick,
    deleteDialogOpen,
    handleConfirmDelete,
    handleCancelDelete,
    refetchReviews,
  };
};
