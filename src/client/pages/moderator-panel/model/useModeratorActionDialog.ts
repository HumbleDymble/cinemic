"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ReviewAction, ReviewModeratedParams } from "./types";
import { useModeratorManageReviewMutation } from "../api/endpoints";

interface Props {
  open: boolean;
  onClose: () => void;
  review: ReviewModeratedParams | null;
  action: ReviewAction | null;
}

export const useModeratorActionDialog = ({ open, onClose, review, action }: Props) => {
  const { t } = useTranslation();

  const [moderatorComments, setModeratorComments] = useState("");

  const [moderateReview, { isLoading, isSuccess, error: mutationError, reset }] =
    useModeratorManageReviewMutation();

  useEffect(() => {
    if (!open) {
      setModeratorComments("");
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  const requiresComments = action === "needs_correction" || action === "reject";

  const reviewAuthor = useMemo(() => {
    if (!review) return "";
    return review.authorUsername?.trim()
      ? review.authorUsername
      : t("pages.moderator-panel.dialog.userId", { id: review.authorId });
  }, [review, t]);

  const handleSubmit = useCallback(async () => {
    if (!review || !action) return;

    await moderateReview({
      titleId: review.titleId,
      action,
      moderatorComments:
        requiresComments && moderatorComments.trim() ? moderatorComments : undefined,
    });
  }, [review, action, moderateReview, moderatorComments, requiresComments]);

  const actionTitle = useMemo(() => {
    if (!action) return "";
    switch (action) {
      case "approve":
        return t("pages.moderator-panel.dialog.title.approve");
      case "reject":
        return t("pages.moderator-panel.dialog.title.reject");
      case "needs_correction":
        return t("pages.moderator-panel.dialog.title.needsCorrection");
      default:
        return t("pages.moderator-panel.dialog.title.default");
    }
  }, [action, t]);

  const actionPrompt = useMemo(() => {
    if (!action) return "";
    switch (action) {
      case "approve":
        return t("pages.moderator-panel.dialog.prompt.approve", { author: reviewAuthor });
      case "reject":
        return t("pages.moderator-panel.dialog.prompt.reject", { author: reviewAuthor });
      case "needs_correction":
        return t("pages.moderator-panel.dialog.prompt.needsCorrection", { author: reviewAuthor });
      default:
        return "";
    }
  }, [action, reviewAuthor, t]);

  return {
    moderatorComments,
    setModeratorComments,
    isLoading,
    mutationError,
    handleSubmit,
    actionTitle,
    actionPrompt,
    requiresComments,
  };
};
