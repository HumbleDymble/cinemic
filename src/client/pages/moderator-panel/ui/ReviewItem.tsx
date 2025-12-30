import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClearIcon from "@mui/icons-material/Clear";
import { type ReviewAction, type ReviewModeratedParams } from "../model/types";

const getStatusLabel = (t: (k: string) => string, status: string) => {
  const key = `pages.user-profile.review.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
};

export const ReviewItem = memo(
  ({
    review,
    onAction,
    onDelete,
    isDeleting,
  }: {
    review: ReviewModeratedParams;
    onAction: (r: ReviewModeratedParams, a: ReviewAction) => void;
    onDelete: (r: ReviewModeratedParams) => void;
    isDeleting: boolean;
  }) => {
    const { t, i18n } = useTranslation();

    const status = review.review.status;
    const isAwaitingUserCorrection = status === "needs_correction";

    const authorLabel = useMemo(() => {
      const tail = review?.authorId ? review.authorId.slice(-6) : "—";
      const name = review?.authorUsername?.trim()
        ? review.authorUsername
        : t("pages.moderator-panel.reviewsTable.authorFallback");
      return `${name} (${tail})`;
    }, [review?.authorId, review?.authorUsername, t]);

    const uploaded = useMemo(() => {
      const d = new Date(review.review.uploadedAt);
      return Number.isNaN(d.getTime()) ? "—" : new Intl.DateTimeFormat(i18n.language).format(d);
    }, [i18n.language, review.review.uploadedAt]);

    return (
      <TableRow hover>
        <TableCell sx={{ fontFamily: "monospace" }}>{review.titleId}</TableCell>

        <TableCell sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
          {authorLabel}
        </TableCell>

        <TableCell sx={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis" }}>
          {review.review.title}
        </TableCell>

        <TableCell
          sx={{
            maxWidth: 350,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={review.review.text}
        >
          {review.review.text}
        </TableCell>

        <TableCell align="center">
          {review.review.rating ?? t("pages.moderator-panel.reviewsTable.na")}
        </TableCell>

        <TableCell>{getStatusLabel(t, status)}</TableCell>

        <TableCell>{uploaded}</TableCell>

        <TableCell>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
            <Tooltip
              title={
                isAwaitingUserCorrection
                  ? t("pages.moderator-panel.reviewsTable.tooltips.awaitingCorrection")
                  : ""
              }
            >
              <span>
                <ButtonGroup
                  variant="outlined"
                  size="small"
                  aria-label={t("pages.moderator-panel.reviewsTable.actions.aria")}
                >
                  <Button
                    color="success"
                    onClick={() => onAction(review, "approve")}
                    disabled={status === "approved" || isAwaitingUserCorrection}
                  >
                    {t("pages.moderator-panel.reviewsTable.actions.approve")}
                  </Button>

                  <Button
                    color="error"
                    onClick={() => onAction(review, "reject")}
                    disabled={status === "rejected" || isAwaitingUserCorrection}
                  >
                    {t("pages.moderator-panel.reviewsTable.actions.reject")}
                  </Button>

                  <Button
                    color="warning"
                    onClick={() => onAction(review, "needs_correction")}
                    disabled={isAwaitingUserCorrection || review.review.hasBeenCorrected}
                  >
                    {t("pages.moderator-panel.reviewsTable.actions.correct")}
                  </Button>
                </ButtonGroup>
              </span>
            </Tooltip>

            <IconButton
              aria-label={t("pages.moderator-panel.reviewsTable.actions.deleteAria")}
              onClick={() => onDelete(review)}
              disabled={isDeleting}
              color="default"
            >
              <ClearIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    );
  },
);

ReviewItem.displayName = "ReviewItem";
