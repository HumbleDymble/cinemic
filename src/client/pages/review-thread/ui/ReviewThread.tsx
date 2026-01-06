"use client";

import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import StarIcon from "@mui/icons-material/Star";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { AddReviewForm } from "./addReviewForm";
import { useReviewThread } from "../model/useReviewThread";
import { Navbar } from "@/client/widgets/navbar";
import { Footer } from "@/client/widgets/footer";
import { Loader } from "@/client/shared/ui";

const getReviewTypeChipProps = (t: TFunction, type: string | undefined) => {
  if (!type) return null;

  const normalized =
    type === "Позитивный" || type.toLowerCase() === "positive"
      ? "positive"
      : type === "Нейтральный" || type.toLowerCase() === "neutral"
        ? "neutral"
        : type === "Негативный" || type.toLowerCase() === "negative"
          ? "negative"
          : null;

  if (!normalized) return null;

  if (normalized === "positive")
    return {
      label: t("pages.review-thread.reviews.external.type.positive"),
      color: "success" as const,
    };
  if (normalized === "neutral")
    return {
      label: t("pages.review-thread.reviews.external.type.neutral"),
      color: "info" as const,
    };
  return {
    label: t("pages.review-thread.reviews.external.type.negative"),
    color: "warning" as const,
  };
};

export const ReviewThread = () => {
  const { t } = useTranslation();

  const {
    theme,
    orderedReviews,
    reviewsLoading,
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
    externalReviews,
    externalReviewsLoading,
    loadMoreExternalReviews,
    hasMoreExternalReviews,
    isFetchingExternal,
    editInitialData,
    handleCancelEdit,
    handleCancelAdd,
    handleShowReview,
  } = useReviewThread();

  if (reviewsLoading) return <Loader open={true} />;

  const isFormOpen = showAddReviewForm ?? !!editingReview;

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t("pages.review-thread.reviews.page_title")}
        </Typography>

        {submissionSuccess && (
          <Alert severity="success" sx={{ my: 2 }} onClose={resetAddReviewMutation}>
            {t("pages.review-thread.reviews.alert.submitted")}
          </Alert>
        )}

        {updateSuccess && (
          <Alert severity="success" sx={{ my: 2 }} onClose={resetUpdateMutation}>
            {t("pages.review-thread.reviews.alert.updated")}
          </Alert>
        )}

        <Box sx={{ my: 3, textAlign: "center" }}>
          {!isFormOpen && !userOwnReview && (
            <Button variant="contained" onClick={handleShowReview}>
              {t("pages.review-thread.reviews.actions.add")}
            </Button>
          )}

          {showAddReviewForm && (
            <AddReviewForm
              onSubmit={handleReviewSubmit}
              isLoading={isSubmitting}
              onCancel={handleCancelAdd}
            />
          )}

          {editingReview && (
            <AddReviewForm
              key={editingReview._id}
              initialData={editInitialData}
              onSubmit={handleReviewUpdate}
              isLoading={isUpdating}
              onCancel={handleCancelEdit}
              submitButtonText={t("pages.review-thread.reviews.form.update")}
            />
          )}
        </Box>

        <Typography variant="h5" gutterBottom>
          {t("pages.review-thread.reviews.section.internal")}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {orderedReviews.length ? (
            orderedReviews.map((r) => {
              const userVote = r.votes?.[currentUserId ?? ""];
              const isOwnReview = r.userId === currentUserId;

              return (
                <Box
                  key={r._id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: isOwnReview
                      ? `2px solid ${theme.palette.primary.main}`
                      : "1px solid #ddd",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StarIcon fontSize="medium" sx={{ color: "gold" }} />
                      <Typography variant="body1" ml={0.25}>
                        {r.rating}/10
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {r.status === "pending" && (
                        <Tooltip title={t("pages.review-thread.reviews.tooltips.pending")}>
                          <ScheduleIcon />
                        </Tooltip>
                      )}

                      {isOwnReview && r.status === "needs_correction" && !r.hasBeenCorrected && (
                        <Tooltip title={t("pages.review-thread.reviews.tooltips.edit")}>
                          <span>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => setEditingReview(r)}
                              disabled={isFormOpen}
                            >
                              {t("pages.review-thread.reviews.buttons.edit")}
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {r.title}
                  </Typography>

                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {r.text}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleVote(r._id, 1)}
                      disabled={!currentUserId || isOwnReview}
                      color={userVote === 1 ? "primary" : "default"}
                      aria-label={t("pages.review-thread.reviews.votes.like")}
                    >
                      <ThumbUpIcon />
                    </IconButton>

                    <Typography variant="body2" sx={{ minWidth: "2ch" }}>
                      {r.likeCount}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => handleVote(r._id, -1)}
                      disabled={!currentUserId || isOwnReview}
                      color={userVote === -1 ? "error" : "default"}
                      aria-label={t("pages.review-thread.reviews.votes.dislike")}
                    >
                      <ThumbDownIcon />
                    </IconButton>

                    <Typography variant="body2">{r.dislikeCount}</Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("pages.review-thread.reviews.empty.internal")}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            {t("pages.review-thread.reviews.section.external")}
          </Typography>

          {externalReviewsLoading ? (
            <Typography variant="body2" color="text.secondary">
              {t("pages.review-thread.reviews.external.loading")}
            </Typography>
          ) : externalReviews.length > 0 ? (
            externalReviews.map((review) => {
              const chipProps = getReviewTypeChipProps(t, review.type);

              return (
                <Box
                  key={review.id}
                  sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1, opacity: 0.9 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" component="span">
                      {review.title ?? t("pages.review-thread.reviews.external.default_title")}
                    </Typography>
                    {chipProps && (
                      <Chip label={chipProps.label} color={chipProps.color} size="small" />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t("pages.review-thread.reviews.external.author")}: {review.author}
                  </Typography>

                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {review.review}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("pages.review-thread.reviews.external.empty")}
            </Typography>
          )}
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          {hasMoreExternalReviews && (
            <Button
              variant="outlined"
              onClick={loadMoreExternalReviews}
              disabled={isFetchingExternal}
              startIcon={isFetchingExternal ? <CircularProgress size={20} /> : null}
            >
              {isFetchingExternal
                ? t("pages.review-thread.common.loading")
                : t("pages.review-thread.reviews.buttons.load_more")}
            </Button>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};
