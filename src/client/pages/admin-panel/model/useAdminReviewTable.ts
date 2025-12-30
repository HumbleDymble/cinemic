import { type ChangeEvent, useState } from "react";
import { type SelectChangeEvent } from "@mui/material/Select";
import {
  type ReviewParams,
  useAdminGetReviewsQuery,
  useUpdateReviewAsAdminMutation,
} from "../api/endpoints";
import type { Review } from "@/entities/review";

export const useAdminReviewTable = () => {
  const { data: reviews, isLoading, isFetching, refetch } = useAdminGetReviewsQuery("all");
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewAsAdminMutation();

  const [selectedReview, setSelectedReview] = useState<ReviewParams | null>(null);
  const [formData, setFormData] = useState<Partial<Review>>({});

  const handleOpenEditDialog = (reviewItem: ReviewParams) => {
    setSelectedReview(reviewItem);
    setFormData({
      title: reviewItem.review.title,
      text: reviewItem.review.text,
      rating: reviewItem.review.rating,
      status: reviewItem.review.status,
    });
  };

  const handleCloseEditDialog = () => {
    setSelectedReview(null);
    setFormData({});
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async () => {
    if (!selectedReview) return;
    try {
      await updateReview({
        reviewId: selectedReview._id,
        payload: formData,
      }).unwrap();

      handleCloseEditDialog();
    } catch (e) {
      console.error("Failed to update review:", e);
    }
  };

  return {
    reviews,
    selectedReview,
    formData,
    isLoading,
    isFetching,
    isUpdatingReview,
    isEditDialogOpen: !!selectedReview,
    refetch,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleFormChange,
    handleFormSubmit,
  };
};
