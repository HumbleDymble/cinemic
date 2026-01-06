"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import type { ImdbData, MovieDtoV1_4 } from "@/client/entities/media-detail";
import { useLazyGetImdbTitleQuery } from "@/client/entities/media-detail";

const DetailItem = memo(({ label, value }: { label: string; value: string }) => (
  <Grid sx={{ xs: 6, sm: 4 }}>
    <Typography variant="caption" color="text.secondary" component="div">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Grid>
));

DetailItem.displayName = "DetailItem";

const getPersonNames = (
  t: TFunction,
  persons: MovieDtoV1_4["persons"],
  profession: "actor" | "director",
  lang: "ru" | "en",
  limit?: number,
) => {
  if (!persons?.length) return t("pages.watchlist.common.na");

  const relevantPersons = persons.filter((p) => p.enProfession === profession);
  if (relevantPersons.length === 0) return t("pages.watchlist.common.na");

  const visible = limit ? relevantPersons.slice(0, limit) : relevantPersons;

  const names = visible
    .map((p) => {
      const ruName = p.name;
      const enName = p.enName;
      return (
        (lang === "en" ? enName : ruName) ?? enName ?? ruName ?? t("pages.watchlist.common.unknown")
      );
    })
    .join(", ");

  return limit && relevantPersons.length > limit ? `${names}...` : names;
};

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

const getGenreLabel = (t: TFunction, rawName?: string | null) => {
  const name = rawName?.trim();
  if (!name) return "";

  const key = GENRE_KEY_BY_RU_NAME[normalizeGenre(name)];
  return key ? t(`pages.media-details.genres.${key}`, { defaultValue: name }) : name;
};

const getImdbCountries = (imdbData?: ImdbData | null) => {
  const codes = new Set<string>();
  const names = new Set<string>();

  if (!imdbData) return { codes: [] as string[], names: [] as string[] };

  const add = (v?: string | null) => {
    const s = v?.trim();
    if (!s) return;

    if (/^[A-Za-z]{2}$/.test(s)) {
      codes.add(s.toUpperCase());
    } else {
      names.add(s);
    }
  };

  const release = imdbData?.releaseDeatiled;

  add(release?.releaseLocation?.cca2);

  add(release?.releaseLocation?.country);

  for (const item of (release?.originLocations ?? []) as (string | null | undefined)[]) {
    add(item);
  }

  return { codes: [...codes], names: [...names] };
};

const formatCountriesFromCodes = (codes: string[], locale: string): string => {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return codes.map((c) => dn.of(c) ?? c).join(", ");
  } catch {
    return codes.join(", ");
  }
};

export const MovieDetailDialog = memo(
  ({ selected, onClose }: { selected: MovieDtoV1_4 | null; onClose: () => void }) => {
    const { t, i18n } = useTranslation();

    const lang: "ru" | "en" = ((i18n.resolvedLanguage ?? i18n.language) || "ru")
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "ru";

    const locale = i18n.resolvedLanguage ?? i18n.language ?? "en";

    const [triggerImdbTitle, { isFetching: isImdbFetching }] = useLazyGetImdbTitleQuery();
    const [imdbData, setImdbData] = useState<ImdbData | null>(null);

    useEffect(() => {
      let cancelled = false;

      if (!selected || lang !== "en" || !selected.externalId?.imdb) {
        setImdbData(null);
        return;
      }

      triggerImdbTitle({ id: selected.externalId.imdb }, true)
        .unwrap()
        .then((data) => {
          if (cancelled) return;
          setImdbData(data ?? null);
        })
        .catch(() => {
          if (cancelled) return;
          setImdbData(null);
        });

      return () => {
        cancelled = true;
      };
    }, [selected, lang, triggerImdbTitle]);

    if (!selected) return null;

    const kpTitle = selected.name ?? selected.alternativeName ?? selected.enName ?? "Untitled";
    const kpEnTitle = selected.enName ?? selected.name ?? selected.alternativeName ?? "Untitled";

    const displayTitle = lang === "en" ? (imdbData?.title?.trim() ?? kpEnTitle) : kpTitle;

    const kpPoster = selected.poster?.previewUrl ?? selected.poster?.url ?? "";
    const displayPoster = lang === "en" ? (imdbData?.image ?? kpPoster) : kpPoster;

    const description =
      lang === "en"
        ? (imdbData?.plot?.trim() ??
          (isImdbFetching ? "" : t("pages.watchlist.detail_dialog.no_description")))
        : (selected.description ??
          selected.shortDescription ??
          t("pages.watchlist.detail_dialog.no_description"));

    const genresLabel = useMemo(() => {
      const kpGenres = selected.genres?.map((g) => getGenreLabel(t, g.name)).filter(Boolean) ?? [];
      if (kpGenres.length > 0) return kpGenres.join(", ");

      const imdbGenres = imdbData?.genre as string[] | undefined;
      if (lang === "en" && imdbGenres?.length) return imdbGenres.join(", ");

      return t("pages.watchlist.common.na");
    }, [selected.genres, imdbData, t, lang]);

    const countriesLabel = useMemo(() => {
      const kpCountries =
        selected.countries
          ?.map((c) => c.name)
          .filter(Boolean)
          .join(", ") ?? "";

      const { codes: imdbCodes, names: imdbNames } = getImdbCountries(imdbData);

      if (imdbCodes.length > 0) return formatCountriesFromCodes(imdbCodes, locale);

      if (lang === "en" && imdbNames.length > 0) return imdbNames.join(", ");

      if (kpCountries) return kpCountries;

      if (imdbNames.length > 0) return imdbNames.join(", ");

      return t("pages.watchlist.common.na");
    }, [selected.countries, imdbData, lang, locale, t]);

    return (
      <Dialog fullWidth maxWidth="md" open={!!selected} onClose={onClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {displayTitle} ({selected.year})
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ p: 1 }}>
            <Box sx={{ flexShrink: 0, width: { xs: "100%", md: 200 } }}>
              <Box
                component="img"
                src={displayPoster}
                alt={displayTitle || t("pages.watchlist.detail_dialog.movie_poster_alt")}
                sx={{ width: "100%", height: "auto", borderRadius: 1 }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography variant="body1" gutterBottom>
                {description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.directed_by")}
                  value={getPersonNames(t, selected.persons, "director", lang)}
                />
                <DetailItem label={t("pages.watchlist.detail_dialog.genre")} value={genresLabel} />
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.actors")}
                  value={getPersonNames(t, selected.persons, "actor", lang, 5)}
                />
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.countries")}
                  value={countriesLabel}
                />
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.content_rating")}
                  value={
                    selected.ratingMpaa?.toUpperCase() ??
                    (selected.ageRating
                      ? `${selected.ageRating}+`
                      : t("pages.watchlist.detail_dialog.not_rated"))
                  }
                />
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("pages.watchlist.common.close")}</Button>
        </DialogActions>
      </Dialog>
    );
  },
);

MovieDetailDialog.displayName = "MovieDetailDialog";
