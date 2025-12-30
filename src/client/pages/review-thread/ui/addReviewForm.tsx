import { type ChangeEvent, type FormEvent, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { ReviewRaw } from "../api/endpoints";

const EMPTY_REVIEW: ReviewRaw = { title: "", text: "", rating: undefined };

interface Props {
  onSubmit: (review: ReviewRaw) => void;
  isLoading: boolean;
  onCancel?: () => void;
  initialData?: Partial<ReviewRaw>;
  submitButtonText?: string;
}

export const AddReviewForm = memo(
  ({ onSubmit, isLoading, onCancel, initialData = EMPTY_REVIEW, submitButtonText }: Props) => {
    const { t } = useTranslation();

    const [review, setReview] = useState<ReviewRaw>(() => ({
      title: initialData.title ?? "",
      text: initialData.text ?? "",
      rating: initialData.rating,
    }));

    useEffect(() => {
      setReview({
        title: initialData.title ?? "",
        text: initialData.text ?? "",
        rating: initialData.rating,
      });
    }, [initialData]);

    const handleReviewChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setReview((prev) => ({
        ...prev,
        [name]: name === "rating" ? (value === "" ? undefined : Number(value)) : value,
      }));
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit(review);
    };

    const submitLabel = submitButtonText ?? t("pages.review-thread.reviews.form.submit");

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
        <TextField
          margin="normal"
          fullWidth
          required
          id="title"
          name="title"
          label={t("pages.review-thread.reviews.form.title_label")}
          value={review.title}
          onChange={handleReviewChange}
          disabled={isLoading || !!initialData.title}
        />

        <TextField
          margin="normal"
          fullWidth
          required
          id="text"
          name="text"
          label={t("pages.review-thread.reviews.form.text_label")}
          multiline
          rows={4}
          value={review.text}
          onChange={handleReviewChange}
          disabled={isLoading}
        />

        <TextField
          margin="normal"
          fullWidth
          id="rating"
          name="rating"
          label={t("pages.review-thread.reviews.form.rating_label")}
          type="number"
          value={review.rating ?? ""}
          onChange={handleReviewChange}
          disabled={isLoading}
          slotProps={{ htmlInput: { min: 1, max: 10 } }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 1 }}
          disabled={isLoading}
        >
          {isLoading ? t("pages.review-thread.reviews.form.submitting") : submitLabel}
        </Button>

        {onCancel && (
          <Button fullWidth variant="outlined" onClick={onCancel} disabled={isLoading}>
            {t("pages.review-thread.common.cancel")}
          </Button>
        )}
      </Box>
    );
  },
);

AddReviewForm.displayName = "AddReviewForm";
