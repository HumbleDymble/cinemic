"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import { alpha, styled, useTheme } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useGetCollectionQuery } from "../api/endpoints";
import { useLazyGetImdbTitleQuery, useLazyGetMediaDetailsQuery, } from "@/client/entities/media-detail";

const HeroSection = styled(Box)(({ theme }) => ({
  height: "85vh",
  maxHeight: "900px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundImage: `linear-gradient(to top, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.4)} 20%, transparent 50%),
    linear-gradient(to right, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.8)} 30%, transparent 100%)`,
  backgroundPosition: "center top",
  backgroundRepeat: "no-repeat",
  color: theme.palette.text.primary,
  paddingTop: "2rem",
  paddingBottom: "3rem",
  transition: "background-image 0.8s ease-in-out, color 0.3s ease",
}));

const PosterCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 340,
  maxHeight: "60vh",
  aspectRatio: "2/3",
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === "light" ? "0 20px 40px rgba(0,0,0,0.2)" : "0 20px 40px rgba(0,0,0,0.6)",
  transform: "rotate(2deg)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "rotate(0deg) scale(1.02)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 30px 60px rgba(0,0,0,0.3)"
        : "0 30px 60px rgba(0,0,0,0.8)",
  },
}));

const formatDuration = (minutes?: number | null, lang: "ru" | "en" = "en") => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (lang === "ru") return h > 0 ? `${h}ч ${m}м` : `${m}м`;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const PopularNow = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const lang: "ru" | "en" = ((i18n.resolvedLanguage ?? i18n.language) || "ru")
    .toLowerCase()
    .startsWith("en")
    ? "en"
    : "ru";

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);

  const { data: heroData, isLoading: isHeroLoading } = useGetCollectionQuery({
    slug: "popular-films",
    limit: 10,
  });

  const heroMovies = useMemo(() => heroData?.movies?.docs ?? [], [heroData]);

  const [imdbCache, setImdbCache] = useState<Record<string, { title: string; image: string }>>({});

  const [triggerMediaDetails] = useLazyGetMediaDetailsQuery();
  const [triggerImdbTitle] = useLazyGetImdbTitleQuery();

  const kpIds = useMemo(() => {
    return heroMovies
      .map((d) => d?.movie?.id)
      .filter((id) => id !== null && id !== undefined)
      .map(String);
  }, [heroMovies]);

  const attemptedKpIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (lang !== "en" || kpIds.length === 0) return;

    let cancelled = false;

    const fetchImdbData = async () => {
      for (const kpId of kpIds) {
        if (attemptedKpIdsRef.current.has(kpId) || imdbCache[kpId]) continue;

        attemptedKpIdsRef.current.add(kpId);

        try {
          const details = await triggerMediaDetails({ id: kpId }, true).unwrap();
          const imdbId = details.externalId?.imdb;

          if (!imdbId) continue;
          if (cancelled) return;

          const imdbData = await triggerImdbTitle({ id: imdbId }, true).unwrap();

          if (cancelled) return;

          const title = imdbData.title?.trim();
          const image = imdbData.image;

          if (title || image) {
            setImdbCache((prev) => ({
              ...prev,
              [kpId]: {
                title: title ?? "",
                image: image ?? "",
              },
            }));
          }
        } catch (e) {
          console.warn(`Failed to fetch IMDb data for KP ID ${kpId}`, e);
        }
      }
    };

    void fetchImdbData();

    return () => {
      cancelled = true;
    };
  }, [lang, kpIds, triggerMediaDetails, triggerImdbTitle, imdbCache]);

  useEffect(() => {
    if (heroMovies.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroMovies.length, isHovered]);

  const featuredContent = useMemo(() => {
    const item = heroMovies[currentHeroIndex];
    if (!item) return null;

    const raw = item.movie;
    const kpId = String(raw.id);
    const imdbInfo = imdbCache[kpId];

    const ruTitle = raw.name ?? raw.alternativeName ?? raw.enName ?? "Untitled";

    const enTitle =
      (imdbInfo?.title || raw.enName) ?? raw.alternativeName ?? raw.name ?? "Untitled";

    const kpPoster = raw.poster?.url ?? raw.poster?.previewUrl ?? "";
    const displayPoster = lang === "en" && imdbInfo?.image ? imdbInfo.image : kpPoster;

    return {
      id: kpId,
      title: lang === "en" ? enTitle : ruTitle,
      rating: raw.rating?.kp ?? raw.rating?.imdb ?? null,
      year: raw.year ?? new Date().getFullYear(),
      duration: formatDuration(raw.movieLength, lang),
      bgImage: kpPoster,
      posterImage: displayPoster,
    };
  }, [heroMovies, currentHeroIndex, imdbCache, lang]);

  useEffect(() => {
    setIsPosterLoaded(false);
    setIsBgLoaded(false);
  }, [currentHeroIndex]);

  useEffect(() => {
    if (!featuredContent?.bgImage) return;
    const img = new Image();
    img.src = featuredContent.bgImage;
    img.onload = () => setIsBgLoaded(true);
  }, [featuredContent?.bgImage]);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const nextIndex = (currentHeroIndex + 1) % heroMovies.length;
    const nextMovie = heroMovies[nextIndex]?.movie;
    const nextUrl = nextMovie?.poster?.url;
    if (nextUrl) {
      const img = new Image();
      img.src = nextUrl;
    }
  }, [currentHeroIndex, heroMovies]);

  return (
    <HeroSection>
      {!isBgLoaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: theme.palette.action.hover,
            zIndex: 0,
          }}
        />
      )}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {isHeroLoading || !featuredContent ? (
          <Grid container spacing={4} alignItems="center">
            <Grid sx={{ xs: 12, md: 6 }}>
              <Skeleton width="60%" height={80} sx={{ bgcolor: "grey.800" }} />
              <Skeleton width="40%" height={40} sx={{ mt: 2, bgcolor: "grey.800" }} />
              <Skeleton width="100%" height={120} sx={{ mt: 4, bgcolor: "grey.800" }} />
            </Grid>
          </Grid>
        ) : (
          <Fade in key={currentHeroIndex} timeout={1000}>
            <Grid
              container
              spacing={10}
              alignItems="center"
              justifyContent="center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Grid sx={{ xs: 12, md: 7, lg: 6 }}>
                <Box sx={{ maxHeight: "calc(85vh - 12rem)", overflow: "hidden" }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    {featuredContent.duration && (
                      <Chip
                        label={featuredContent.duration}
                        size="small"
                        icon={<AccessTimeIcon style={{ color: "inherit", fontSize: 16 }} />}
                        sx={{
                          backgroundColor: "rgba(125,125,125, 0.3)",
                          color: "inherit",
                          border: `1px solid ${theme.palette.divider}`,
                          backdropFilter: "blur(4px)",
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                    lineHeight: 1.1,
                    mb: 2,
                    color:
                      theme.palette.mode === "light"
                        ? theme.palette.common.black
                        : theme.palette.common.white,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {featuredContent.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  {typeof featuredContent.rating === "number" && featuredContent.rating > 0 && (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <StarIcon sx={{ color: "#fbbf24", fontSize: 28 }} />
                        <Typography variant="h5" fontWeight={700}>
                          {featuredContent.rating.toFixed(1)}
                        </Typography>
                      </Box>

                      <Typography variant="h6" sx={{ opacity: 0.6 }}>
                        |
                      </Typography>
                    </>
                  )}

                  <Typography variant="h6">{featuredContent.year}</Typography>

                  <Chip
                    label="HD"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.text.primary,
                      color: theme.palette.background.default,
                      fontWeight: 900,
                      borderRadius: 1,
                      height: 20,
                    }}
                  />
                </Box>

                <Button
                  component={NextLink}
                  href={`/title/${featuredContent.id}`}
                  variant="outlined"
                  startIcon={<InfoOutlinedIcon />}
                  sx={{
                    borderColor: theme.palette.divider,
                    color: "inherit",
                    backdropFilter: "blur(4px)",
                    borderRadius: 50,
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                      backgroundColor: alpha(theme.palette.text.primary, 0.05),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {t("pages.home.popularNow.moreInfo")}
                </Button>
              </Grid>

              <Grid sx={{ xs: 12, md: 5, lg: 6, display: "flex", justifyContent: "center" }}>
                <PosterCard elevation={24}>
                  {!isPosterLoaded && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      sx={{ bgcolor: theme.palette.action.hover }}
                      animation="wave"
                    />
                  )}
                  <Box
                    component="img"
                    src={featuredContent.posterImage}
                    alt={featuredContent.title}
                    onLoad={() => setIsPosterLoaded(true)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: isPosterLoaded ? "block" : "none",
                    }}
                  />
                </PosterCard>
              </Grid>
            </Grid>
          </Fade>
        )}
      </Container>
    </HeroSection>
  );
};
