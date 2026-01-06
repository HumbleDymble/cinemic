"use client";

import React, { memo } from "react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ModeratorActionDialog } from "./ModeratorActionDialog";
import { ReviewItem } from "./ReviewItem";
import { useModeratorReviewTable } from "../model/useModeratorReviewTable";
import { Loader } from "@/client/shared/ui";
import type { ReviewAction, ReviewModeratedParams } from "../model/types";

const getStatusLabel = (t: (k: string) => string, status: string) => {
  const key = `pages.user-profile.review.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
};

const ReviewCardItem = memo(
  ({
    review,
    onAction,
    onDelete,
    isDeleting,
  }: {
    review: ReviewModeratedParams;
    onAction: (review: ReviewModeratedParams, action: ReviewAction) => void;
    onDelete: (review: ReviewModeratedParams) => void | Promise<void>;
    isDeleting: boolean;
  }) => {
    const { t } = useTranslation();

    const author = review.authorUsername?.trim()
      ? review.authorUsername
      : t("pages.moderator-panel.dialog.userId", { id: review.authorId });

    const text = review.review.text ?? "";
    const snippet = text.length > 180 ? `${text.slice(0, 180)}…` : text;

    return (
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ wordBreak: "break-word" }}>
                {review.review.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("pages.moderator-panel.reviewsTable.card.author")}: {author}
              </Typography>
            </Box>

            <Chip size="small" label={getStatusLabel(t, review.review.status)} />
          </Box>

          <Divider />

          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {snippet}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button size="small" variant="contained" onClick={() => onAction(review, "approve")}>
              {t("pages.moderator-panel.reviewsTable.actions.approve")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onAction(review, "needs_correction")}
            >
              {t("pages.moderator-panel.reviewsTable.actions.needsCorrection")}
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => onAction(review, "reject")}
            >
              {t("pages.moderator-panel.reviewsTable.actions.reject")}
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              disabled={isDeleting}
              onClick={() => void onDelete(review)}
            >
              {t("pages.moderator-panel.reviewsTable.actions.delete")}
            </Button>
          </Stack>

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontFamily: "monospace", userSelect: "all" }}
          >
            {t("pages.moderator-panel.reviewsTable.columns.movieId")}: {review.titleId}
          </Typography>
        </Stack>
      </Paper>
    );
  },
);

ReviewCardItem.displayName = "ReviewCardItem";

export const ModeratorReviewTable = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    reviews,
    isLoading,
    filterStatus,
    isFetching,
    dialogOpen,
    selectedReview,
    currentAction,
    handleActionClick,
    handleDialogClose,
    handleFilterChange,
    isDeleting,
    quickDeleteChange,
    handleConfirmDelete,
    handleCancelDelete,
    handleDeleteClick,
    deleteDialogOpen,
    quickDelete,
    refetchReviews,
  } = useModeratorReviewTable();

  if (isLoading) return <Loader open={true} />;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <IconButton
            component={NextLink}
            href="/"
            aria-label={t("pages.moderator-panel.reviewsTable.backHomeAria")}
            sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: 2,
              ml: "auto",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="review-status-filter-label">
                {t("pages.moderator-panel.reviewsTable.filter.label")}
              </InputLabel>
              <Select
                labelId="review-status-filter-label"
                id="review-status-filter"
                value={filterStatus}
                label={t("pages.moderator-panel.reviewsTable.filter.label")}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">
                  {t("pages.moderator-panel.reviewsTable.filter.all")}
                </MenuItem>
                <MenuItem value="pending">{getStatusLabel(t, "pending")}</MenuItem>
                <MenuItem value="approved">{getStatusLabel(t, "approved")}</MenuItem>
                <MenuItem value="rejected">{getStatusLabel(t, "rejected")}</MenuItem>
                <MenuItem value="needs_correction">
                  {getStatusLabel(t, "needs_correction")}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <Checkbox
                  checked={quickDelete}
                  onChange={quickDeleteChange}
                  name="quickDelete"
                  color="primary"
                />
              }
              label={t("pages.moderator-panel.reviewsTable.quickDelete")}
            />

            <Button
              variant="outlined"
              onClick={refetchReviews}
              disabled={isFetching}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {isFetching
                ? t("pages.moderator-panel.reviewsTable.refreshing")
                : t("pages.moderator-panel.reviewsTable.refresh")}
            </Button>
          </Box>
        </Box>
      </Box>

      {!reviews || reviews.length === 0 ? (
        <Typography sx={{ p: 2, textAlign: "center" }}>
          {t("pages.moderator-panel.reviewsTable.empty")}
        </Typography>
      ) : (
        <>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label={t("pages.moderator-panel.reviewsTable.tableAria")}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 100 }}>
                      {t("pages.moderator-panel.reviewsTable.columns.movieId")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      {t("pages.moderator-panel.reviewsTable.columns.author")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      {t("pages.moderator-panel.reviewsTable.columns.title")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 250, maxWidth: 350 }}>
                      {t("pages.moderator-panel.reviewsTable.columns.textSnippet")}
                    </TableCell>
                    <TableCell>{t("pages.moderator-panel.reviewsTable.columns.rating")}</TableCell>
                    <TableCell>{t("pages.moderator-panel.reviewsTable.columns.status")}</TableCell>
                    <TableCell sx={{ minWidth: 110 }}>
                      {t("pages.moderator-panel.reviewsTable.columns.uploaded")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 280 }}>
                      {t("pages.moderator-panel.reviewsTable.columns.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reviews.map((review) => (
                    <ReviewItem
                      key={review._id}
                      review={review}
                      onAction={handleActionClick}
                      onDelete={handleDeleteClick}
                      isDeleting={isDeleting}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ display: { xs: "block", sm: "none" }, px: 1.5, pb: 1.5 }}>
            <Stack spacing={1.25}>
              {reviews.map((review) => (
                <ReviewCardItem
                  key={review._id}
                  review={review}
                  onAction={handleActionClick}
                  onDelete={handleDeleteClick}
                  isDeleting={isDeleting}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}

      <ModeratorActionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        review={selectedReview}
        action={currentAction}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="moderator-delete-dialog-title"
        aria-describedby="moderator-delete-dialog-description"
        fullScreen={isMobile}
      >
        <DialogTitle id="moderator-delete-dialog-title">
          {t("pages.moderator-panel.reviewsTable.deleteDialog.title")}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="moderator-delete-dialog-description">
            {t("pages.moderator-panel.reviewsTable.deleteDialog.description")}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCancelDelete} color="inherit" disabled={isDeleting}>
            {t("pages.moderator-panel.reviewsTable.deleteDialog.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {t("pages.moderator-panel.reviewsTable.deleteDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
