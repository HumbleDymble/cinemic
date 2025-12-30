import { memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import CasinoIcon from "@mui/icons-material/Casino";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { type MovieHistoryItem } from "../model/db";
import { AddToWatchlist } from "@/features/add-to-watchlist";
import { UserRating } from "@/features/rating";
import { type MovieDtoV1_4 } from "@/entities/media-detail";

const GENRES = [
  { value: "триллер", key: "thriller" },
  { value: "драма", key: "drama" },
  { value: "криминал", key: "crime" },
  { value: "мелодрама", key: "romance" },
  { value: "детектив", key: "detective" },
  { value: "фантастика", key: "sci_fi" },
  { value: "комедия", key: "comedy" },
  { value: "боевик", key: "action" },
  { value: "вестерн", key: "western" },
  { value: "фэнтези", key: "fantasy" },
  { value: "музыка", key: "music" },
] as const;

const CONTENT_TYPES = [
  { value: "movie" },
  { value: "tv-series" },
  { value: "cartoon" },
  { value: "anime" },
] as const;

const getTypeLabel = (
  t: TFunction,
  type?: "movie" | "tv-series" | "cartoon" | "anime" | "animated-series" | "tv-show" | null,
) => (type ? t(`pages.random-title.content_types.${type}`, { defaultValue: type }) : "");

const getMovieLink = (id: number | null) => `/title/${id}`;

interface FilterFormProps {
  filters: { type: string; genre: string; year: string; minRating: string };
  onChange: (field: "type" | "genre" | "year" | "minRating", value: string) => void;
  onRoll: () => void;
  isFetching: boolean;
}

export const FilterForm = memo(({ filters, onChange, onRoll, isFetching }: FilterFormProps) => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Grid container spacing={2}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            select
            fullWidth
            label={t("pages.random-title.filters.content_type")}
            size="small"
            value={filters.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            {CONTENT_TYPES.map((ct) => (
              <MenuItem key={ct.value} value={ct.value}>
                {t(`pages.random-title.content_types.${ct.value}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            select
            fullWidth
            label={t("pages.random-title.filters.genre")}
            size="small"
            value={filters.genre}
            onChange={(e) => onChange("genre", e.target.value)}
          >
            <MenuItem value="Any">{t("pages.random-title.filters.any_genre")}</MenuItem>
            {GENRES.map((g) => (
              <MenuItem key={g.value} value={g.value}>
                {t(`pages.random-title.genres.${g.key}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid sx={{ xs: 6, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            label={t("pages.random-title.filters.year")}
            size="small"
            value={filters.year}
            onChange={(e) => onChange("year", e.target.value)}
            placeholder={t("pages.random-title.common.any")}
          />
        </Grid>

        <Grid sx={{ xs: 6, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            label={t("pages.random-title.filters.min_rating")}
            size="small"
            value={filters.minRating}
            onChange={(e) => onChange("minRating", e.target.value)}
            slotProps={{ htmlInput: { min: 0, max: 10, step: 1 } }}
          />
        </Grid>

        <Grid sx={{ xs: 12, md: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onRoll}
            disabled={isFetching}
            startIcon={!isFetching && <CasinoIcon />}
            sx={{ height: 40, fontWeight: "bold", borderRadius: 2 }}
          >
            {isFetching ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("pages.random-title.actions.roll")
            )}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
});

FilterForm.displayName = "FilterForm";

interface MovieResultProps {
  movie: MovieDtoV1_4;
}

export const MovieResult = memo(({ movie }: MovieResultProps) => {
  const { t } = useTranslation();

  const posterUrl = movie.poster?.url ?? movie.poster?.previewUrl;

  const title =
    movie.name ?? movie.alternativeName ?? movie.enName ?? t("pages.random-title.movie.no_title");

  const kpValue =
    movie.rating?.kp != null ? movie.rating.kp.toFixed(1) : t("pages.random-title.common.na");
  const imdbValue =
    movie.rating?.imdb != null ? movie.rating.imdb.toFixed(1) : t("pages.random-title.common.na");

  return (
    <Paper elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {posterUrl && (
          <Box
            component={RouterLink}
            to={getMovieLink(movie.id)}
            sx={{
              width: { xs: "100%", md: 280 },
              minHeight: { xs: 300, md: "auto" },
              position: "relative",
              display: "block",
              "&:hover": { opacity: 0.9 },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: { md: "absolute" },
              }}
              image={posterUrl}
              alt={t("pages.random-title.movie.poster_alt")}
            />
          </Box>
        )}

        <CardContent sx={{ flex: 1, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Link
                component={RouterLink}
                to={getMovieLink(movie.id)}
                underline="hover"
                color="inherit"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": { color: "primary.main" },
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {title}
                </Typography>
                <OpenInNewIcon fontSize="small" sx={{ opacity: 0.6 }} />
              </Link>

              <Stack
                direction="row"
                spacing={2}
                sx={{ color: "text.secondary", flexWrap: "wrap", gap: 1, mt: 1 }}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">{movie.year}</Typography>
                </Stack>

                <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                  {getTypeLabel(t, movie.type)}
                </Typography>

                {movie.movieLength && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                      {t("pages.random-title.common.minutes_short", { count: movie.movieLength })}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            <AddToWatchlist data={movie} />
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              icon={<StarIcon />}
              label={t("pages.random-title.ratings.kp", { value: kpValue })}
              color="primary"
              size="small"
            />
            <Chip
              label={t("pages.random-title.ratings.imdb", { value: imdbValue })}
              variant="outlined"
              size="small"
            />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.description ??
              movie.shortDescription ??
              t("pages.random-title.movie.no_description")}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight="medium">
                {t("pages.random-title.labels.your_rating")}
              </Typography>
              <UserRating data={movie} />
            </Stack>

            <Button
              component={RouterLink}
              to={getMovieLink(movie.id)}
              variant="outlined"
              size="small"
              endIcon={<OpenInNewIcon />}
              sx={{ borderRadius: 2 }}
            >
              {t("pages.random-title.actions.view_details")}
            </Button>
          </Stack>
        </CardContent>
      </Box>
    </Paper>
  );
});

MovieResult.displayName = "MovieResult";

interface HistoryListProps {
  history: MovieHistoryItem[];
  onClear: () => void;
}

export const HistoryList = memo(({ history, onClear }: HistoryListProps) => {
  const { t } = useTranslation();

  if (history.length === 0) return null;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <HistoryIcon color="action" />
          <Typography variant="h6" fontWeight="bold">
            {t("pages.random-title.history.title")}
          </Typography>
          <Chip label={history.length} size="small" variant="outlined" />
        </Stack>

        <Button
          startIcon={<DeleteOutlineIcon />}
          color="error"
          size="small"
          onClick={onClear}
          sx={{ borderRadius: 2 }}
        >
          {t("pages.random-title.actions.clear_all")}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {history.map((item) => (
          <Grid sx={{ xs: 6, sm: 4, md: 3 }} key={item.timestamp}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={getMovieLink(item.id)}
                sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={item.poster?.previewUrl ?? item.poster?.url ?? ""}
                  alt={item.name ?? item.alternativeName ?? ""}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent
                  sx={{
                    p: 1.5,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {item.name ?? item.alternativeName ?? t("pages.random-title.movie.no_title")}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      {item.year}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.25}>
                      <StarIcon sx={{ fontSize: 12, color: "primary.main" }} />
                      <Typography variant="caption" color="primary" fontWeight="bold">
                        {item.rating?.kp?.toFixed(1) ?? t("pages.random-title.common.na")}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

HistoryList.displayName = "HistoryList";

interface EmptyStateProps {
  isFetching: boolean;
}

export const EmptyState = memo(({ isFetching }: EmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        mb: 4,
        borderRadius: 3,
        textAlign: "center",
        bgcolor: "grey.50",
        border: isFetching ? "none" : "2px dashed",
        borderColor: isFetching ? "transparent" : "grey.300",
      }}
    >
      {isFetching ? (
        <>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t("pages.random-title.empty.loading")}
          </Typography>
        </>
      ) : (
        <>
          <CasinoIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("pages.random-title.empty.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("pages.random-title.empty.subtitle")}
          </Typography>
        </>
      )}
    </Paper>
  );
});

EmptyState.displayName = "EmptyState";
