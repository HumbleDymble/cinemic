"use client";

import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import type { Review } from "@/client/entities/review";

interface Props {
  open: boolean;
  reviewId?: string;
  formData: Partial<Review>;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
}

export const ReviewEditDialog = ({
  open,
  reviewId,
  formData,
  isLoading,
  onClose,
  onSubmit,
  onChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {t("pages.admin-panel.review_edit.title")}
        {reviewId ? ` (ID: ${reviewId})` : ""}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          margin="dense"
          name="title"
          label={t("pages.admin-panel.review_edit.fields.review_title")}
          fullWidth
          variant="outlined"
          value={formData.title ?? ""}
          onChange={onChange}
          disabled={isLoading}
        />
        <TextField
          margin="dense"
          name="text"
          label={t("pages.admin-panel.review_edit.fields.review_text")}
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          value={formData.text ?? ""}
          onChange={onChange}
          disabled={isLoading}
        />
        <TextField
          margin="dense"
          name="rating"
          label={t("pages.admin-panel.review_edit.fields.rating")}
          type="number"
          fullWidth
          variant="outlined"
          value={formData.rating ?? ""}
          onChange={onChange}
          disabled={isLoading}
          slotProps={{ htmlInput: { min: 1, max: 10 } }}
        />

        <FormControl fullWidth margin="dense" disabled={isLoading}>
          <InputLabel>{t("pages.admin-panel.review_edit.fields.status")}</InputLabel>
          <Select
            name="status"
            label={t("pages.admin-panel.review_edit.fields.status")}
            value={formData.status ?? ""}
            onChange={onChange}
          >
            <MenuItem value="pending">{t("pages.admin-panel.review_status.pending")}</MenuItem>
            <MenuItem value="approved">{t("pages.admin-panel.review_status.approved")}</MenuItem>
            <MenuItem value="rejected">{t("pages.admin-panel.review_status.rejected")}</MenuItem>
            <MenuItem value="needs_correction">
              {t("pages.admin-panel.review_status.needs_correction")}
            </MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {t("pages.admin-panel.common.cancel")}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("pages.admin-panel.review_edit.save_changes")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
