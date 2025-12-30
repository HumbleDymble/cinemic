import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { alpha, type Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import MovieIcon from "@mui/icons-material/Movie";
import ReviewIcon from "@mui/icons-material/RateReview";
import StarIcon from "@mui/icons-material/Star";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LockIcon from "@mui/icons-material/Lock";
import type { MyProfileResponse } from "../api/endpoints";
import type { Review } from "@/entities/review";
import type { KpMovieId } from "@/entities/media-detail";

const getStatusChipStyles = (theme: Theme, status: string) => {
  const map: Record<string, "success" | "warning" | "error" | "info"> = {
    approved: "success",
    pending: "warning",
    rejected: "error",
    needs_correction: "info",
  };
  const colorKey = map[status] || "info";
  const color = theme.palette[colorKey].main;
  return {
    backgroundColor: alpha(color, 0.15),
    color,
    fontWeight: 600,
    border: `1px solid ${alpha(color, 0.3)}`,
  };
};

const getStatusLabel = (t: (k: string) => string, status: string) => {
  const key = `pages.user-profile.review.status.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
};

export const EmptyState = memo(
  ({
    message,
    icon,
    isPrivate = false,
  }: {
    message?: string;
    icon?: React.ReactNode;
    isPrivate?: boolean;
  }) => {
    const { t } = useTranslation();

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 5, md: 8 },
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontSize: { xs: 52, md: 64 },
            opacity: isPrivate ? 0.5 : 0.3,
            mb: 2,
            color: isPrivate ? "text.disabled" : "primary.main",
          }}
        >
          {isPrivate ? <LockIcon fontSize="inherit" /> : icon}
        </Box>
        <Typography variant="h6" color="text.secondary" fontWeight={isPrivate ? 600 : 400}>
          {isPrivate ? t("pages.user-profile.publicProfile.private.contentHiddenTitle") : message}
        </Typography>
        {isPrivate && (
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            {t("pages.user-profile.publicProfile.private.contentHiddenDescription")}
          </Typography>
        )}
      </Box>
    );
  },
);

EmptyState.displayName = "EmptyState";

export const ProfileSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Box sx={{ bgcolor: "background.paper", p: { xs: 2, md: 4 }, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Skeleton variant="circular" width={isMobile ? 64 : 80} height={isMobile ? 64 : 80} />
          <Box flex={1}>
            <Skeleton variant="text" width={isMobile ? "60%" : "40%"} height={40} />
            <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }} useFlexGap>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={isMobile ? 54 : 60}
                  height={40}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 3, borderRadius: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export const ProfileHeader = memo(({ data }: { data: MyProfileResponse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const stats = [
    { label: t("pages.user-profile.profile.header.stats.friends"), val: data.friends?.length ?? 0 },
    { label: t("pages.user-profile.profile.header.stats.ratings"), val: data.ratings?.length ?? 0 },
    {
      label: t("pages.user-profile.profile.header.stats.watchlist"),
      val: data.watchlist?.watchlist?.length ?? 0,
    },
    { label: t("pages.user-profile.profile.header.stats.reviews"), val: data.reviews?.length ?? 0 },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.primary.contrastText,
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        mb: { xs: 2, md: 3 },
        position: "relative",
        overflow: "hidden",
        boxShadow: theme.shadows[4],
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.20) 0%, transparent 60%)",
          pointerEvents: "none",
        },
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 2 : 3}
        alignItems={isMobile ? "flex-start" : "center"}
        position="relative"
        zIndex={1}
      >
        <Avatar
          sx={{
            width: { xs: 64, sm: 72, md: 80 },
            height: { xs: 64, sm: 72, md: 80 },
            bgcolor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            color: "#FFFFFF",
          }}
        >
          <MovieIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
        </Avatar>

        <Box flex={1} minWidth={0}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            gutterBottom
            color="inherit"
            sx={{ wordBreak: "break-word" }}
          >
            {t("pages.user-profile.profile.header.title")}
          </Typography>

          <Stack direction="row" spacing={isMobile ? 2 : 4} flexWrap="wrap" useFlexGap>
            {stats.map((stat) => (
              <Box key={stat.label}>
                <Typography variant="body2" sx={{ opacity: 0.85, color: "inherit" }}>
                  {stat.label}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="inherit">
                  {stat.val}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
});

ProfileHeader.displayName = "ProfileHeader";

export const RatingsTab = memo(
  ({ ratings }: { ratings: MyProfileResponse["ratings"] | null | undefined }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    if (ratings === null) return <EmptyState isPrivate />;

    if (!ratings || ratings.length === 0) {
      return (
        <EmptyState message={t("pages.user-profile.profile.empty.ratings")} icon={<StarIcon />} />
      );
    }

    return (
      <Grid container spacing={2}>
        {ratings.map((item) => (
          <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={item.titleId}>
            <Link to={`/title/${item.titleId}/review-thread`} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: theme.transitions.create(["box-shadow", "transform"], {
                    duration: 150,
                  }),
                  "&:hover": {
                    boxShadow: theme.shadows[3],
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {t("pages.user-profile.profile.id")} {item.titleId}
                  </Typography>

                  {item.rating != null && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                      <Rating
                        value={item.rating}
                        max={10}
                        readOnly
                        size="small"
                        sx={{ "& .MuiRating-iconFilled": { color: "warning.main" } }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        {item.rating} / 10
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  },
);

RatingsTab.displayName = "RatingsTab";

export const WatchlistTab = memo(({ items }: { items: KpMovieId[] | undefined | null }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (items === null) return <EmptyState isPrivate />;

  if (!items || items.length === 0) {
    return (
      <EmptyState
        message={t("pages.user-profile.profile.empty.watchlist")}
        icon={<BookmarkBorder />}
      />
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map((itemId) => (
        <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={itemId}>
          <Link to={`/title/${itemId}`} style={{ textDecoration: "none" }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${theme.palette.divider}`,
                transition: theme.transitions.create(["box-shadow", "transform"], {
                  duration: 150,
                }),
                "&:hover": {
                  boxShadow: theme.shadows[3],
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {t("pages.user-profile.profile.id")} {itemId}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
});

WatchlistTab.displayName = "WatchlistTab";

export const ReviewsTab = memo(({ reviews }: { reviews: Review[] | undefined | null }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  if (reviews === null) return <EmptyState isPrivate />;

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState message={t("pages.user-profile.profile.empty.reviews")} icon={<ReviewIcon />} />
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {reviews.map((review) => (
        <Card
          key={review._id}
          sx={{
            mb: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: "background.paper",
            transition: theme.transitions.create(["box-shadow"], { duration: 300 }),
            "&:hover": { boxShadow: theme.shadows[2] },
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                  gutterBottom
                  sx={{ wordBreak: "break-word" }}
                >
                  {review.title}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                  {review.status && (
                    <Chip
                      label={getStatusLabel(t, review.status)}
                      size="small"
                      sx={getStatusChipStyles(theme, review.status)}
                    />
                  )}

                  {review.hasBeenCorrected && (
                    <Chip
                      label={t("pages.user-profile.review.edited")}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}

                  <Typography variant="caption" color="text.secondary">
                    {new Intl.DateTimeFormat(i18n.language).format(new Date(review.createdAt))}
                  </Typography>
                </Stack>
              </Box>

              <Typography variant="body1" sx={{ lineHeight: 1.7, color: "text.primary" }}>
                {review.text}
              </Typography>

              {review?.rating && (
                <>
                  <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 18, color: "warning.main" }} />
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {review.rating}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton size="small" color="inherit" aria-label={t("review.like")}>
                      <ThumbUpIcon fontSize="small" color="action" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {review.likeCount}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton size="small" color="inherit" aria-label={t("review.dislike")}>
                      <ThumbDownIcon fontSize="small" color="action" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {review.dislikeCount}
                    </Typography>
                  </Box>
                </Stack>

                <Link
                  to={`/title/${review.titleId}/review-thread`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      userSelect: "all",
                      cursor: "pointer",
                    }}
                  >
                    {t("pages.user-profile.profile.id")} {review.titleId}
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
});

ReviewsTab.displayName = "ReviewsTab";
