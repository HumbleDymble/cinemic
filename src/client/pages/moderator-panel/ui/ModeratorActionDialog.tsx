import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useModeratorActionDialog } from "../model/useModeratorActionDialog";
import type { ReviewAction, ReviewModeratedParams } from "../model/types";

interface Props {
  open: boolean;
  onClose: () => void;
  review: ReviewModeratedParams | null;
  action: ReviewAction | null;
}

export const ModeratorActionDialog = ({ open, onClose, review, action }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const {
    moderatorComments,
    setModeratorComments,
    isLoading,
    mutationError,
    handleSubmit,
    actionTitle,
    actionPrompt,
    requiresComments,
  } = useModeratorActionDialog({ open, onClose, review, action });

  const commentsError = requiresComments && moderatorComments !== "" && !moderatorComments.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
    >
      <DialogTitle sx={{ pr: 2 }}>{actionTitle}</DialogTitle>

      <DialogContent dividers={isMobile}>
        <DialogContentText sx={{ mb: 2 }}>{actionPrompt}</DialogContentText>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">
            {t("pages.moderator-panel.dialog.reviewTitleLabel")}: {review?.review.title ?? "—"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              mt: 1,
              maxHeight: { xs: 160, sm: 120 },
              overflowY: "auto",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 1,
              whiteSpace: "pre-wrap",
            }}
          >
            {review?.review.text ?? "—"}
          </Typography>
        </Box>

        {requiresComments && (
          <TextField
            autoFocus
            margin="dense"
            id="moderatorComments"
            label={t("pages.moderator-panel.dialog.comments.label")}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={isMobile ? 4 : 3}
            value={moderatorComments}
            onChange={(e) => setModeratorComments(e.target.value)}
            required
            error={commentsError}
            helperText={
              commentsError ? t("pages.moderator-panel.dialog.comments.requiredHelper") : " "
            }
          />
        )}

        {mutationError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            <strong>{t("pages.moderator-panel.dialog.error.prefix")}</strong>{" "}
            {"data" in mutationError
              ? JSON.stringify(mutationError.data)
              : t("pages.moderator-panel.dialog.error.unknown")}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          {t("pages.moderator-panel.dialog.buttons.cancel")}
        </Button>

        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading ?? (requiresComments && !moderatorComments.trim())}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("pages.moderator-panel.dialog.buttons.confirm")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
