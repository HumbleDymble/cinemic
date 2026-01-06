"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import { alpha, styled } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { MediaDetailsGallery } from "./MediaDetailsGallery";
import { Navbar } from "@/client/widgets/navbar";
import { Footer } from "@/client/widgets/footer";
import { UserRating } from "@/client/features/rating";
import { AddToWatchlist } from "@/client/features/add-to-watchlist";
import type { Image, ImdbData, PersonInMovie, YearRange } from "@/client/entities/media-detail";
import {
  useGetImagesForTitleQuery,
  useGetImdbTitleQuery,
  useGetMediaDetailsQuery,
} from "@/client/entities/media-detail";
import { Loader } from "@/client/shared/ui";

const PosterCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === "light" ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "none",
}));

const PersonAvatarSmall = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  border: `2px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
}));

const PersonAvatarLarge = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  border: `2px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
}));

const MovieCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === "light" ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 12px 24px rgba(0, 0, 0, 0.1)"
        : "0 12px 24px rgba(0, 0, 0, 0.5)",
    "& .MuiCardMedia-root": {
      transform: "scale(1.05)",
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: 24,
  color: theme.palette.text.primary,
  position: "relative",
  display: "inline-block",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    borderRadius: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}));

export const MediaDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const lang = (i18n.resolvedLanguage ?? i18n.language ?? "").toLowerCase();
  const isRu = lang.startsWith("ru");

  const pickRuEn = (ru?: string | null, en?: string | null) => {
    const v = isRu ? ru : en;
    return v && v.trim().length > 0 ? v : null;
  };

  const getPersonDisplayName = (p: { name?: string | null; enName?: string | null }) =>
    pickRuEn(p.name, p.enName);

  const getMediaTitle = (m: { name?: string | null; alternativeName?: string | null }) =>
    pickRuEn(m.name, m.alternativeName) ?? t("pages.media-details.no_title");

  const { data, isLoading, isError } = useGetMediaDetailsQuery({ id }, { skip: !id });
  const { data: imagesData } = useGetImagesForTitleQuery(
    {
      movieId: Number(id),
      limit: 30,
    },
    { skip: !id },
  );

  const imdbId = data?.externalId?.imdb ?? null;

  const { data: imdbData, isFetching: isImdbFetching } = useGetImdbTitleQuery(
    { id: imdbId! },
    { skip: !imdbId || isRu },
  );

  const FACTS_STEP = 10;

  const stripHtml = (html: string) =>
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

  const facts = useMemo(() => {
    const raw = data?.facts ?? [];
    return raw
      .map((f) => ({
        ...f,
        value: stripHtml(f.value ?? "").trim(),
        spoiler: Boolean(f.spoiler),
      }))
      .filter((f) => f.value.length > 0);
  }, [data?.facts]);

  const [factsVisible, setFactsVisible] = useState(FACTS_STEP);
  const [showFactsRu, setShowFactsRu] = useState(false);

  useEffect(() => {
    setFactsVisible(FACTS_STEP);
    setShowFactsRu(false);
  }, [id, isRu]);

  if (isLoading) return <Loader open={true} />;

  if (!id || isError || !data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h4" sx={{ color: "text.secondary" }}>
          {t("pages.media-details.load_error")}
        </Typography>
      </Box>
    );
  }

  type GenreKey =
    | "action"
    | "adventure"
    | "animation"
    | "anime"
    | "biography"
    | "comedy"
    | "crime"
    | "detective"
    | "documentary"
    | "drama"
    | "family"
    | "fantasy"
    | "history"
    | "horror"
    | "music"
    | "musical"
    | "mystery"
    | "romance"
    | "sci_fi"
    | "short"
    | "sport"
    | "thriller"
    | "war"
    | "western"
    | "kids"
    | "reality"
    | "talk_show"
    | "game_show"
    | "news";

  const normalizeGenre = (s: string) => s.trim().toLowerCase().replaceAll("ё", "е");

  const GENRE_KEY_BY_RU_NAME: Record<string, GenreKey> = {
    [normalizeGenre("Боевик")]: "action",
    [normalizeGenre("Приключения")]: "adventure",
    [normalizeGenre("Мультфильм")]: "animation",
    [normalizeGenre("Аниме")]: "anime",
    [normalizeGenre("Биография")]: "biography",
    [normalizeGenre("Комедия")]: "comedy",
    [normalizeGenre("Криминал")]: "crime",
    [normalizeGenre("Детектив")]: "detective",
    [normalizeGenre("Документальный")]: "documentary",
    [normalizeGenre("Документалистика")]: "documentary",
    [normalizeGenre("Драма")]: "drama",
    [normalizeGenre("Семейный")]: "family",
    [normalizeGenre("Фэнтези")]: "fantasy",
    [normalizeGenre("История")]: "history",
    [normalizeGenre("Исторический")]: "history",
    [normalizeGenre("Ужасы")]: "horror",
    [normalizeGenre("Музыка")]: "music",
    [normalizeGenre("Мюзикл")]: "musical",
    [normalizeGenre("Мистика")]: "mystery",
    [normalizeGenre("Мелодрама")]: "romance",
    [normalizeGenre("Фантастика")]: "sci_fi",
    [normalizeGenre("Короткометражка")]: "short",
    [normalizeGenre("Спорт")]: "sport",
    [normalizeGenre("Триллер")]: "thriller",
    [normalizeGenre("Военный")]: "war",
    [normalizeGenre("Вестерн")]: "western",
    [normalizeGenre("Детский")]: "kids",
    [normalizeGenre("Реальное ТВ")]: "reality",
    [normalizeGenre("Ток-шоу")]: "talk_show",
    [normalizeGenre("Игра")]: "game_show",
    [normalizeGenre("Новости")]: "news",
  };

  const getGenreLabel = (ruName?: string | null) => {
    const name = ruName?.trim();
    if (!name) return "";

    const key = GENRE_KEY_BY_RU_NAME[normalizeGenre(name)];
    return key ? t(`pages.media-details.genres.${key}`, { defaultValue: name }) : name;
  };

  const formatYearLabel = (year?: number | null, releaseYears?: YearRange[] | null) => {
    const ranges = (releaseYears ?? []).filter((r) => r?.start != null);
    if (ranges.length > 0) {
      const start = Math.min(...ranges.map((r) => r.start as number));
      const ends = ranges.map((r) => r.end).filter((e): e is number => e != null);
      const end = ends.length ? Math.max(...ends) : null;

      return end ? `${start}–${end}` : `${start}–`;
    }

    return year ? String(year) : null;
  };

  const getProfessionLabel = (profession: string) => {
    switch (profession) {
      case "режиссеры":
        return t("pages.media-details.professions.director");
      case "сценаристы":
        return t("pages.media-details.professions.writer");
      case "продюсеры":
        return t("pages.media-details.professions.producer");
      default:
        return profession;
    }
  };

  const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return null;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0
      ? t("pages.media-details.runtime_hm", { hours: hrs, minutes: mins })
      : t("pages.media-details.runtime_m", { minutes: mins });
  };

  const formatUSD = (num?: number | null) => {
    if (num == null) return null;
    return new Intl.NumberFormat(i18n.resolvedLanguage, {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const formatCompactNumber = (num?: number | null) => {
    if (num == null) return null;
    return new Intl.NumberFormat(i18n.resolvedLanguage, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  interface CrewMember {
    id: number | undefined;
    name: string | null | undefined;
    enName: string | null | undefined;
    photo: string | null | undefined;
    roles: string[];
  }

  const getUniqueCrew = (persons: PersonInMovie[] | undefined): CrewMember[] => {
    if (!persons) return [];

    const crewProfessions = ["режиссеры", "сценаристы", "продюсеры"];
    const crewPersons = persons.filter((p) => crewProfessions.includes(p.profession ?? ""));

    const crewMap = new Map<number, CrewMember>();

    crewPersons.forEach((person) => {
      if (!person.id) return;

      if (crewMap.has(person.id)) {
        const existing = crewMap.get(person.id)!;
        const roleLabel = getProfessionLabel(person.profession ?? "");
        if (!existing.roles.includes(roleLabel)) {
          existing.roles.push(roleLabel);
        }
      } else {
        crewMap.set(person.id, {
          id: person.id,
          name: person.name,
          enName: person.enName,
          photo: person.photo,
          roles: [getProfessionLabel(person.profession ?? "")],
        });
      }
    });

    return Array.from(crewMap.values()).slice(0, 8);
  };

  const getImdbCountryCodes = (imdbData?: ImdbData | null): string[] => {
    if (!imdbData) return [];

    const codes = new Set<string>();

    const relCode = imdbData.releaseDeatiled?.releaseLocation?.cca2;
    if (relCode) codes.add(relCode.toUpperCase());

    const origins = imdbData.releaseDeatiled?.originLocations ?? [];
    for (const item of origins) {
      const s = item?.trim();
      if (!s) continue;

      if (/^[A-Za-z]{2}$/.test(s)) {
        codes.add(s.toUpperCase());
      }
    }

    return [...codes];
  };

  const formatCountriesFromCodes = (codes: string[], locale: string): string => {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return codes.map((c) => dn.of(c) ?? c).join(", ");
  };

  const imdbCountryCodes = getImdbCountryCodes(imdbData);

  const countriesLabel =
    imdbCountryCodes.length > 0
      ? formatCountriesFromCodes(imdbCountryCodes, i18n.resolvedLanguage ?? i18n.language ?? "en")
      : (data.countries?.map((c) => c.name).join(", ") ?? "");

  const title = isRu
    ? getMediaTitle(data)
    : (data.alternativeName ?? imdbData?.title ?? getMediaTitle(data));

  const secondaryTitle = isRu ? data.alternativeName : data.name;

  const description = isRu
    ? (data.description ?? data.shortDescription ?? t("pages.media-details.no_description"))
    : (imdbData?.plot ?? (isImdbFetching ? null : t("pages.media-details.no_description")));

  const posterUrl = isRu
    ? (data.poster?.url ?? data.poster?.previewUrl)
    : (imdbData?.image ?? data.poster?.url ?? data.poster?.previewUrl);
  const galleryImages: Image[] = [...(imagesData?.docs ?? [])];

  const crew = getUniqueCrew(data.persons);

  const actors = data.persons?.filter((p) => p.profession === "актеры").slice(0, 10) ?? [];

  const isSeries =
    data.type === "tv-series" || data.type === "animated-series" || data.type === "tv-show";

  const similarMovies = data.similarMovies ?? [];
  const seasons = data.seasonsInfo?.length;
  const episodes = data.seasonsInfo?.reduce((acc, s) => acc + (s.episodesCount ?? 0), 0);

  const factsOpened = isRu || showFactsRu;
  const visibleFacts = facts.slice(0, factsVisible);
  const canLoadMoreFacts = factsVisible < facts.length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <InfoCard elevation={0} sx={{ mb: 4 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <PosterCard elevation={0}>
                  {posterUrl ? (
                    <Box
                      component="img"
                      src={posterUrl}
                      alt={title}
                      sx={{ width: "100%", height: "auto", display: "block" }}
                    />
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      sx={{ aspectRatio: "2/3", width: "100%", bgcolor: "action.hover" }}
                    />
                  )}
                </PosterCard>
              </Grid>

              <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                        fontWeight: 900,
                        lineHeight: 1.2,
                        color: "text.primary",
                      }}
                    >
                      {title}
                    </Typography>

                    {secondaryTitle && secondaryTitle !== title && (
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 0.5,
                          color: "text.secondary",
                          fontWeight: 400,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        {secondaryTitle}
                      </Typography>
                    )}
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {data.year && (
                      <Chip
                        label={formatYearLabel(data.year, data.releaseYears)}
                        size="small"
                        sx={{
                          bgcolor: "action.hover",
                          color: "text.primary",
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {data.movieLength && (
                      <Chip
                        icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
                        label={formatRuntime(data.movieLength)}
                        size="small"
                        sx={{
                          bgcolor: "action.hover",
                          color: "text.primary",
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {data.ageRating && (
                      <Chip
                        label={`${data.ageRating}+`}
                        size="small"
                        sx={{
                          bgcolor: "action.hover",
                          color: "text.primary",
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Stack>

                  {data.genres && data.genres.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {data.genres.slice(0, 5).map((genre, idx) => (
                        <Chip
                          key={idx}
                          label={getGenreLabel(genre.name)}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "text.secondary",
                            borderColor: "divider",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  {isRu
                    ? data.slogan && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: "italic",
                            color: "text.secondary",
                          }}
                        >
                          {data.slogan.startsWith("«") ? data.slogan : `«${data.slogan}»`}
                        </Typography>
                      )
                    : null}

                  {description ? (
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                      {description}
                    </Typography>
                  ) : (
                    <Skeleton variant="text" height={96} sx={{ transform: "none" }} />
                  )}

                  <Stack spacing={1}>
                    {data.countries && data.countries.length > 0 && (
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 100 }}>
                          {t("pages.media-details.labels.countries")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                          {countriesLabel}
                        </Typography>
                      </Stack>
                    )}
                    {data.budget?.value && (
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 100 }}>
                          {t("pages.media-details.labels.budget")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                          {formatUSD(data.budget.value)}
                        </Typography>
                      </Stack>
                    )}
                    {isSeries && data.seasonsInfo && data.seasonsInfo.length > 0 && (
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 100 }}>
                          {t("pages.media-details.labels.seasons")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                          {t("pages.media-details.seasons_episodes.season", { count: seasons })} (
                          {t("pages.media-details.seasons_episodes.episode", { count: episodes })})
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    useFlexGap
                    alignItems="center"
                    sx={{
                      pt: 2,
                      mt: 1,
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    {data.rating?.kp && (
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        {data.votes?.kp && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 500,
                            }}
                          >
                            {t("pages.media-details.kp_votes", {
                              formatted: formatCompactNumber(Number(data.votes.kp)),
                            })}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            bgcolor: "#d97706",
                            color: "#fff",
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <StarRoundedIcon sx={{ fontSize: 18 }} />
                          <Typography variant="h6" fontWeight={900}>
                            {data.rating.kp.toFixed(1)}
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    <UserRating data={data} />
                    <AddToWatchlist data={data} />

                    {data.videos?.trailers?.[0] && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowRoundedIcon />}
                        href={data.videos.trailers[0].url ?? ""}
                        target="_blank"
                        sx={{
                          borderRadius: 3,
                          px: 2.5,
                          py: 1,
                          fontWeight: 700,
                          textTransform: "none",
                          bgcolor: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        }}
                      >
                        {t("pages.media-details.actions.trailer")}
                      </Button>
                    )}

                    {data.top250 && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          bgcolor: alpha("#d97706", 0.15),
                          color: "#d97706",
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 2,
                        }}
                      >
                        <EmojiEventsRoundedIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={700}>
                          #{data.top250}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </InfoCard>

        {(crew.length > 0 || actors.length > 0) && (
          <InfoCard elevation={0} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <SectionTitle variant="h5">{t("pages.media-details.sections.crew")}</SectionTitle>

              {crew.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    {crew.map((person) => (
                      <Stack
                        key={person.id}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                          p: 1,
                          pr: 2,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "action.selected",
                            "& .MuiAvatar-root": {
                              borderColor: "primary.main",
                            },
                          },
                        }}
                      >
                        <PersonAvatarSmall
                          src={person.photo ?? undefined}
                          alt={getPersonDisplayName(person) ?? ""}
                        >
                          {getPersonDisplayName(person)}
                        </PersonAvatarSmall>

                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: "text.primary" }}
                          >
                            {getPersonDisplayName(person)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {person.roles.join(", ")}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}

              {crew.length > 0 && actors.length > 0 && <Divider sx={{ my: 3 }} />}

              {actors.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2, color: "text.primary" }}
                  >
                    {t("pages.media-details.sections.cast")}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    {actors.map((person) => (
                      <Stack
                        key={person.id}
                        alignItems="center"
                        sx={{
                          width: 110,
                          p: 1.5,
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "action.hover",
                            "& .MuiAvatar-root": {
                              transform: "scale(1.1)",
                              borderColor: "primary.main",
                            },
                          },
                        }}
                      >
                        <PersonAvatarLarge
                          src={person.photo ?? undefined}
                          alt={getPersonDisplayName(person) ?? ""}
                        >
                          {getPersonDisplayName(person)}
                        </PersonAvatarLarge>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          textAlign="center"
                          sx={{
                            mt: 1,
                            color: "text.primary",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                            width: "100%",
                          }}
                        >
                          {getPersonDisplayName(person)}
                        </Typography>
                        {person.description && (
                          <Typography
                            variant="caption"
                            textAlign="center"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.7rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: 1.3,
                              mt: 0.5,
                              width: "100%",
                            }}
                          >
                            {person.description}
                          </Typography>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </InfoCard>
        )}

        {similarMovies.length > 0 && (
          <InfoCard elevation={0} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <SectionTitle variant="h5">{t("pages.media-details.sections.similar")}</SectionTitle>
              <Grid container spacing={3} sx={{ mt: 4 }}>
                {similarMovies.slice(0, 12).map((movie) => (
                  <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                    <MovieCard elevation={0}>
                      <CardMedia
                        component="div"
                        sx={{
                          aspectRatio: "2/3",
                          background: movie.poster?.url
                            ? `url(${movie.poster.previewUrl ?? movie.poster.url}) center/cover`
                            : "action.hover",
                          transition: "transform 0.4s ease",
                        }}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{
                            color: "text.primary",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 40,
                            lineHeight: 1.3,
                          }}
                        >
                          {getMediaTitle(movie)}
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 1 }}
                        >
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {movie.year}
                          </Typography>
                          {movie.rating?.kp && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <StarRoundedIcon sx={{ fontSize: 14, color: "#d97706" }} />
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{ color: "text.primary" }}
                              >
                                {movie.rating.kp.toFixed(1)}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </CardContent>
                    </MovieCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </InfoCard>
        )}

        {galleryImages.length > 0 && (
          <InfoCard elevation={0} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <SectionTitle variant="h5">{t("pages.media-details.sections.gallery")}</SectionTitle>
              <Box sx={{ mt: 4 }}>
                <MediaDetailsGallery images={galleryImages} title={title} />
              </Box>
            </CardContent>
          </InfoCard>
        )}

        {facts.length > 0 && (
          <InfoCard elevation={0} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <SectionTitle variant="h5">{t("pages.media-details.sections.facts")}</SectionTitle>

              {!isRu && !factsOpened && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {t("pages.media-details.facts.ru_only_note")}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowFactsRu(true)}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    {t("pages.media-details.facts.show_ru_only")}
                  </Button>
                </Stack>
              )}

              <Collapse in={factsOpened} unmountOnExit>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {visibleFacts.map((fact, idx) => (
                    <Box
                      key={`${idx}-${fact.value.slice(0, 24)}`}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        {fact.spoiler && (
                          <Chip
                            label={t("pages.media-details.facts.spoiler")}
                            size="small"
                            variant="outlined"
                            color="warning"
                            sx={{ mt: "2px" }}
                          />
                        )}

                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-line", color: "text.secondary", lineHeight: 1.6 }}
                        >
                          {fact.value}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {canLoadMoreFacts && (
                      <Button
                        variant="outlined"
                        onClick={() => setFactsVisible((v) => v + FACTS_STEP)}
                        sx={{ textTransform: "none" }}
                      >
                        {t("pages.media-details.facts.show_more")}
                      </Button>
                    )}

                    {!isRu && (
                      <Button
                        variant="text"
                        onClick={() => setShowFactsRu(false)}
                        sx={{ textTransform: "none" }}
                      >
                        {t("pages.media-details.facts.hide")}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Collapse>
            </CardContent>
          </InfoCard>
        )}

        <Box
          sx={{
            mt: 4,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            boxShadow: 1,
          }}
        >
          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1, color: "text.primary" }}>
            {t("pages.media-details.discussion.title")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            {t("pages.media-details.discussion.subtitle")}
          </Typography>
          <Button
            component={NextLink}
            href="review-thread"
            variant="contained"
            size="large"
            sx={{
              borderRadius: 6,
              px: 5,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {t("pages.media-details.discussion.button")}
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};
