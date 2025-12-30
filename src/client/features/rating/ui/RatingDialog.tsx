import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

interface Props {
  open: boolean;
  onClose: () => void;
  mediaTitle: string | undefined;
  initialValue: number | null;
  isUpdating: boolean;
  hasRated: boolean;
  onSubmit: (rating: number) => void;
  onRemove: () => void;
}

export const RatingDialog = memo(
  ({
    open,
    onClose,
    mediaTitle,
    initialValue,
    isUpdating,
    hasRated,
    onSubmit,
    onRemove,
  }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [value, setValue] = useState(initialValue ?? 5);

    useEffect(() => {
      if (open) setValue(initialValue ?? 5);
    }, [initialValue, open]);

    const handleSliderChange = useCallback((_event: Event, newValue: number | number[]) => {
      setValue(newValue as number);
    }, []);

    const handleSubmit = useCallback(() => {
      onSubmit(value);
    }, [onSubmit, value]);

    const starTextColor = theme.palette.getContrastText(theme.palette.primary.main);

    const safeTitle = mediaTitle ?? t("features.user-rating.unknown_title");

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="rating-dialog-title"
      >
        <DialogTitle
          id="rating-dialog-title"
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}
        >
          <Typography variant="h6" component="span" noWrap sx={{ maxWidth: "85%" }}>
            {t("features.user-rating.dialog.title", { title: safeTitle })}
          </Typography>

          {hasRated && (
            <IconButton
              onClick={onRemove}
              color="error"
              size="small"
              aria-label={t("features.user-rating.dialog.remove_aria")}
              disabled={isUpdating}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ overflow: "hidden" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <StarIcon sx={{ fontSize: "6rem", color: "primary.main" }} />
              <Typography
                variant="h4"
                sx={{
                  position: "absolute",
                  color: starTextColor,
                  fontWeight: "bold",
                  userSelect: "none",
                  pt: 0.5,
                }}
              >
                {value}
              </Typography>
            </Box>

            <Slider
              value={value}
              onChange={handleSliderChange}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              disabled={isUpdating}
              sx={{ width: "90%" }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isUpdating} color="inherit">
            {t("features.user-rating.dialog.cancel")}
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isUpdating}
            sx={{ minWidth: 100 }}
          >
            {isUpdating ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("features.user-rating.dialog.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

RatingDialog.displayName = "RatingDialog";
