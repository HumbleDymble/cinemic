import { memo } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha, keyframes, styled } from "@mui/material/styles";
import { RatingDialog } from "./RatingDialog";
import { useUserRating } from "../model/useUserRating";
import type { MovieDtoV1_4 } from "@/entities/media-detail";

const createBorderGlow = (color: string) => keyframes`
  0%, 100% {
    border-color: ${alpha(color, 0.3)};
    box-shadow: 0 0 0 0 ${alpha(color, 0)};
  }
  50% {
    border-color: ${alpha(color, 0.6)};
    box-shadow: 0 0 8px 0 ${alpha(color, 0.15)};
  }
`;

const AnimatedButton = styled(Button)(({ theme }) => {
  const color = theme.palette.primary.main;
  return {
    borderRadius: 8,
    animation: `${createBorderGlow(color)} 3s ease-in-out infinite`,
    transition: "all 0.3s ease",
    "&:hover": {
      animation: "none",
      borderColor: alpha(color, 0.8),
      boxShadow: `0 0 12px 0 ${alpha(color, 0.2)}`,
    },
  };
});

const RatedButton = styled(Button)(({ theme }) => {
  const color = theme.palette.primary.main;
  return {
    borderRadius: 8,
    backgroundColor: alpha(color, 0.08),
    borderColor: alpha(color, 0.3),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(color, 0.12),
      borderColor: alpha(color, 0.5),
    },
  };
});

interface Props {
  data: MovieDtoV1_4;
}

export const UserRating = memo(({ data }: Props) => {
  const { t } = useTranslation();
  const {
    handleRemoveRating,
    handleSubmitRating,
    handleOpenDialog,
    handleCloseDialog,
    title,
    getTooltipTitle,
    hasRated,
    isDialogOpen,
    isUpdating,
    isButtonDisabled,
    isQueryLoading,
    rating,
  } = useUserRating({ data });

  let content;

  if (isQueryLoading) {
    content = (
      <Button variant="outlined" disabled sx={{ borderRadius: 2, minWidth: 100 }}>
        <CircularProgress size={20} />
      </Button>
    );
  } else if (hasRated) {
    content = (
      <RatedButton
        variant="outlined"
        onClick={handleOpenDialog}
        disabled={isButtonDisabled ?? isUpdating}
        startIcon={<StarIcon color="primary" />}
      >
        <Typography variant="body2" color="primary" fontWeight={700}>
          {rating}
        </Typography>
      </RatedButton>
    );
  } else {
    content = (
      <AnimatedButton
        variant="outlined"
        onClick={handleOpenDialog}
        disabled={isButtonDisabled ?? isUpdating}
        startIcon={<StarOutlineIcon color={isButtonDisabled ? "disabled" : "primary"} />}
      >
        {t("features.user-rating.button_rate")}
      </AnimatedButton>
    );
  }

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Tooltip title={getTooltipTitle()} placement="top" arrow>
          <span>{content}</span>
        </Tooltip>
      </Box>

      <RatingDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        mediaTitle={title}
        initialValue={rating}
        isUpdating={isUpdating}
        hasRated={hasRated}
        onSubmit={handleSubmitRating}
        onRemove={handleRemoveRating}
      />
    </>
  );
});

UserRating.displayName = "UserRating";
