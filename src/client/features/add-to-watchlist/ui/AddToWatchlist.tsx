"use client";

import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { keyframes, styled } from "@mui/material/styles";
import { useAddToWatchlist } from "../model/useAddToWatchlist";
import type { MovieDtoV1_4 } from "@/client/entities/media-detail";

const borderGlow = keyframes`
  0%, 100% {
    border-color: rgba(79, 70, 229, 0.3);
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
  50% {
    border-color: rgba(79, 70, 229, 0.6);
    box-shadow: 0 0 8px 0 rgba(79, 70, 229, 0.15);
  }
`;

const AnimatedButton = styled(Button)({
  borderRadius: 8,
  animation: `${borderGlow} 3s ease-in-out infinite`,
  transition: "all 0.3s ease",
  "&:hover": {
    animation: "none",
    borderColor: "rgba(79, 70, 229, 0.8)",
    boxShadow: "0 0 12px 0 rgba(79, 70, 229, 0.2)",
  },
});

interface Props {
  data?: MovieDtoV1_4 | null | undefined;
}

export const AddToWatchlist = ({ data }: Props) => {
  const { t } = useTranslation();

  const { watchlistData, handleButtonClick, inWatchlist, isLoading } = useAddToWatchlist(data?.id);

  if (inWatchlist) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Tooltip
          title={!watchlistData ? t("features.add-to-watchlist.tooltip_guest") : ""}
          placement="top"
          arrow
        >
          <span>
            <Button
              variant="contained"
              color="success"
              startIcon={<BookmarkAddedIcon />}
              onClick={handleButtonClick}
              loading={isLoading}
              disabled={!watchlistData}
              sx={{ borderRadius: 2 }}
            >
              {t("features.add-to-watchlist.button_action")}
            </Button>
          </span>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Tooltip
        title={
          !watchlistData // ✅
            ? t("features.add-to-watchlist.tooltip_guest")
            : ""
        }
        placement="top"
        arrow
      >
        <span>
          <AnimatedButton
            variant="outlined"
            color="primary"
            startIcon={<BookmarkAddIcon />}
            onClick={handleButtonClick}
            loading={isLoading}
            disabled={!watchlistData}
          >
            {t("features.add-to-watchlist.button_action")}
          </AnimatedButton>
        </span>
      </Tooltip>
    </Box>
  );
};
