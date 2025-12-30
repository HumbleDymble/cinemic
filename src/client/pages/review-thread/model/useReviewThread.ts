import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  type ReviewRaw,
  useAddReviewMutation,
  useGetExternalReviewsQuery,
  useGetMovieReviewsQuery,
  useUpdateReviewMutation,
  useVoteOnReviewMutation,
} from "../api/endpoints";
import type { KpMovieId } from "@/entities/media-detail";
import type { Review, ReviewId } from "@/entities/review";
import { type NotificationId, useMarkAsReadMutation } from "@/entities/notification";
import { useAppSelector } from "@/shared/config";
import { useToggle } from "@/shared/lib/hooks";

export const useReviewThread = () => {
  const { titleId } = useParams();

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const parsedId = titleId ? Number(titleId) : undefined;
  const [externalPage, setExternalPage] = useState(1);
  const reviewsLimit = 10;

  const currentUserId = useAppSelector((state) => state.auth.user?._id);

  const { data: reviewsData, isLoading: reviewsLoading } = useGetMovieReviewsQuery(
    parsedId as KpMovieId,
    {
      skip: !titleId && !!currentUserId,
    },
  );

  const {
    data: KpReviewsData,
    isLoading: externalReviewsLoading,
    isFetching: isFetchingExternal,
  } = useGetExternalReviewsQuery(
    {
      movieId: parsedId as KpMovieId,
      page: externalPage,
      limit: reviewsLimit,
    },
    {
      skip: !titleId,
    },
  );

  const hasMoreExternalReviews = KpReviewsData ? KpReviewsData.page < KpReviewsData.pages : false;

  const [
    addReview,
    { isLoading: isSubmitting, isSuccess: submissionSuccess, reset: resetAddReviewMutation },
  ] = useAddReviewMutation();

  const [
    updateReview,
    { isLoading: isUpdating, isSuccess: updateSuccess, reset: resetUpdateMutation },
  ] = useUpdateReviewMutation();

  const [markNotificationsSeen] = useMarkAsReadMutation();
  const [voteOnReview] = useVoteOnReviewMutation();

  const [showAddReviewForm, setShowAddReviewForm] = useToggle(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const userOwnReview = useMemo(() => {
    if (!reviewsData?.reviews || !currentUserId) return undefined;
    return reviewsData.reviews.find((r) => r.userId === currentUserId);
  }, [reviewsData?.reviews, currentUserId]);

  const orderedReviews = useMemo(() => {
    if (!reviewsData?.reviews) return [];
    if (!userOwnReview) return reviewsData.reviews;

    return [userOwnReview, ...reviewsData.reviews.filter((r) => r.userId !== userOwnReview.userId)];
  }, [reviewsData?.reviews, userOwnReview]);

  const handleReviewSubmit = useCallback(
    (ReviewRaw: ReviewRaw) => {
      if (!titleId) return;
      addReview({ ...ReviewRaw, titleId: Number(titleId) });
    },
    [titleId, addReview],
  );

  const handleReviewUpdate = useCallback(
    (reviewPayload: ReviewRaw) => {
      if (!editingReview) return;

      updateReview({
        reviewId: editingReview._id,
        payload: {
          text: reviewPayload.text,
          rating: reviewPayload.rating,
        },
      });
    },
    [editingReview, updateReview],
  );

  const handleVote = useCallback(
    (reviewId: ReviewId, vote: 1 | -1) => {
      if (!titleId) return;
      voteOnReview({ reviewId, vote });
    },
    [titleId, voteOnReview],
  );

  const loadMoreExternalReviews = useCallback(() => {
    if (hasMoreExternalReviews) {
      setExternalPage((prevPage) => prevPage + 1);
    }
  }, [hasMoreExternalReviews]);

  const handleCancelAdd = useCallback(() => {
    setShowAddReviewForm(false);
  }, [setShowAddReviewForm]);

  const handleCancelEdit = useCallback(() => {
    setEditingReview(null);
  }, [setEditingReview]);

  const handleShowReview = useCallback(() => {
    setShowAddReviewForm(true);
  }, [setShowAddReviewForm]);

  const editInitialData = useMemo(() => {
    if (!editingReview) return undefined;
    return {
      text: editingReview.text,
      rating: editingReview.rating,
      title: editingReview.title,
    };
  }, [editingReview]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const notificationId = queryParams.get("notify_id");

    if (notificationId) {
      markNotificationsSeen([notificationId as NotificationId])
        .unwrap()
        .then(() => {
          const newParams = new URLSearchParams(location.search);
          newParams.delete("notify_id");
          void navigate(`${location.pathname}?${newParams.toString()}`, {
            replace: true,
            state: location.state,
          });
        })
        .catch((e) => {
          console.error("Failed to mark user-notification as seen:", e);
        });
    }
  }, [location.search, markNotificationsSeen, navigate, location.pathname, location.state]);

  useEffect(() => {
    if (submissionSuccess) setShowAddReviewForm(false);
    if (updateSuccess) setEditingReview(null);
  }, [submissionSuccess, updateSuccess, setShowAddReviewForm]);

  return {
    theme,
    orderedReviews,
    reviewsLoading,
    externalReviews: KpReviewsData?.docs ?? [],
    externalReviewsLoading,
    isFetchingExternal,
    hasMoreExternalReviews,
    loadMoreExternalReviews,
    currentUserId,
    userOwnReview,
    showAddReviewForm,
    handleReviewSubmit,
    isSubmitting,
    submissionSuccess,
    resetAddReviewMutation,
    editingReview,
    setEditingReview,
    handleReviewUpdate,
    isUpdating,
    updateSuccess,
    resetUpdateMutation,
    handleVote,
    editInitialData,
    handleCancelEdit,
    handleCancelAdd,
    handleShowReview,
  };
};
