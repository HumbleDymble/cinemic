import { memo, type MouseEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import StarIcon from "@mui/icons-material/Star";
import type { MovieDtoV1_4 } from "@/entities/media-detail";
import { type KpMovieId, useGetMediaDetailsQuery } from "@/entities/media-detail";
import { useRemoveFromWatchlistMutation } from "@/entities/watchlist";
import { useAppDispatch } from "@/shared/config";
import { showSnackbar } from "@/entities/alert";

interface Props {
  id: KpMovieId;
  onOpen: (item: MovieDtoV1_4) => void;
}

export const WatchlistItem = memo(({ id, onOpen }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { data: item, isLoading } = useGetMediaDetailsQuery({ id: String(id) });
  const [removeFromWatchlist, { isLoading: isRemoving }] = useRemoveFromWatchlistMutation();

  const handleRemoveClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      removeFromWatchlist({ id })
        .unwrap()
        .then(() => {
          dispatch(
            showSnackbar({
              open: true,
              message: t("pages.watchlist.snackbar.removed_from_watchlist"),
              severity: "success",
              autoHideDuration: 4000,
            }),
          );
        })
        .catch((e) => {
          console.error("Failed to remove item:", e);
          dispatch(
            showSnackbar({
              open: true,
              message: t("pages.watchlist.snackbar.remove_failed_try_again"),
              severity: "error",
              autoHideDuration: 5000,
            }),
          );
        });
    },
    [id, removeFromWatchlist, dispatch, t],
  );

  const handleItemClick = useCallback(() => {
    if (item) onOpen(item);
  }, [item, onOpen]);

  if (isLoading)
    return <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 1, mb: 2 }} />;
  if (!item) return null;

  const imageUrl = item.poster?.previewUrl ?? item.poster?.url ?? "";
  const votes = item.votes?.kp ?? 0;
  const votesCount = typeof votes === "number" ? votes : Number(votes);

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1 }}>
      <CardMedia
        component="img"
        image={imageUrl}
        alt={item.name ?? item.enName ?? t("pages.watchlist.detail_dialog.movie_poster_alt")}
        sx={{
          width: 160,
          height: 240,
          borderRadius: 1,
          cursor: "pointer",
          objectFit: "cover",
          bgcolor: "grey.300",
        }}
        onClick={handleItemClick}
      />

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          onClick={handleItemClick}
        >
          {item.name ?? item.enName ?? item.alternativeName}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          color="text.secondary"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Typography variant="body2">{item.year}</Typography>

          {item.movieLength && (
            <Typography variant="body2">
              {t("pages.watchlist.common.minutes_short", { count: item.movieLength })}
            </Typography>
          )}

          <Typography variant="body2">
            {item.ratingMpaa?.toUpperCase() ??
              (item.ageRating
                ? `${item.ageRating}+`
                : t("pages.watchlist.detail_dialog.not_rated"))}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
          <StarIcon sx={{ color: "warning.main" }} fontSize="small" />
          <Typography variant="body2" fontWeight="bold">
            {item.rating?.kp?.toFixed(1) ?? t("pages.watchlist.common.na")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({t("pages.watchlist.common.votes", { count: votesCount })})
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Tooltip disableFocusListener title={t("pages.watchlist.tooltip_more_info")}>
          <IconButton
            color="primary"
            onClick={handleItemClick}
            aria-label={t("pages.watchlist.tooltip_more_info")}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip disableFocusListener title={t("pages.watchlist.tooltip_remove")}>
          <IconButton
            aria-label={t("pages.watchlist.aria_remove")}
            onClick={handleRemoveClick}
            disabled={isRemoving}
            color="default"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
});

WatchlistItem.displayName = "WatchlistItem";
