"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReviewEditDialog } from "./ReviewEditDialog";
import { useAdminReviewTable } from "../model/useAdminReviewTable";
import { Loader } from "@/client/shared/ui";

export const AdminReviewTable = () => {
  const { t, i18n } = useTranslation();

  const {
    reviews,
    isLoading,
    isFetching,
    refetch,
    isUpdatingReview,
    selectedReview,
    formData,
    isEditDialogOpen,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleFormChange,
    handleFormSubmit,
  } = useAdminReviewTable();

  if (isLoading) return <Loader open={true} />;

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <IconButton
            component={NextLink}
            href="/"
            aria-label={t("pages.admin-panel.common.aria_go_home")}
            sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Button variant="outlined" onClick={() => refetch()} disabled={isFetching}>
            {isFetching
              ? t("pages.admin-panel.common.refreshing")
              : t("pages.admin-panel.reviews.refresh_list")}
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label={t("pages.admin-panel.reviews.table_aria")}>
            <TableHead>
              <TableRow>
                <TableCell>{t("pages.admin-panel.reviews.columns.author")}</TableCell>
                <TableCell>{t("pages.admin-panel.reviews.columns.title")}</TableCell>
                <TableCell>{t("pages.admin-panel.reviews.columns.text_snippet")}</TableCell>
                <TableCell align="center">
                  {t("pages.admin-panel.reviews.columns.rating")}
                </TableCell>
                <TableCell>{t("pages.admin-panel.reviews.columns.status")}</TableCell>
                <TableCell>{t("pages.admin-panel.reviews.columns.uploaded")}</TableCell>
                <TableCell align="center">
                  {t("pages.admin-panel.reviews.columns.actions")}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reviews?.map((reviewItem) => (
                <TableRow hover key={reviewItem._id}>
                  <TableCell>{reviewItem.authorUsername}</TableCell>
                  <TableCell>{reviewItem.review.title}</TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {reviewItem.review.text}
                  </TableCell>

                  <TableCell align="center">{reviewItem.review.rating ?? "-"}</TableCell>

                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {t(`pages.admin-panel.review_status.${reviewItem.review.status}`, {
                      defaultValue: reviewItem.review.status,
                    })}
                  </TableCell>

                  <TableCell>
                    {new Date(reviewItem.review.uploadedAt).toLocaleDateString(
                      i18n.resolvedLanguage,
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEditDialog(reviewItem)}
                    >
                      {t("pages.admin-panel.common.edit")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!reviews?.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t("pages.admin-panel.reviews.no_reviews")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ReviewEditDialog
        open={isEditDialogOpen}
        reviewId={selectedReview?._id}
        formData={formData}
        isLoading={isUpdatingReview}
        onClose={handleCloseEditDialog}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
