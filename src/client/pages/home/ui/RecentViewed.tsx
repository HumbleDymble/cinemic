"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryIcon from "@mui/icons-material/History";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Collapse from "@mui/material/Collapse";
import Skeleton from "@mui/material/Skeleton";
import { alpha, styled } from "@mui/material/styles";
import {
  clearRecentViewedData,
  getRecentViewedData,
  patchRecentViewedLocalization,
  type RecentViewedType,
} from "@/client/features/search-bar";
import {
  useLazyGetImdbTitleQuery,
  useLazyGetMediaDetailsQuery,
} from "@/client/entities/media-detail";
import { useAppDispatch, useAppSelector } from "@/client/shared/config";
import { useToggle } from "@/client/shared/lib/hooks";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 12px 24px rgba(0, 0, 0, 0.12)"
        : "0 12px 24px rgba(0, 0, 0, 0.6)",
  },
}));

const MediaContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  aspectRatio: "2 / 3",
  backgroundColor: theme.palette.action.hover,
  overflow: "hidden",
  position: "relative",
}));

const MediaImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "opacity 0.3s ease",
});

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.spacing(2),
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const ContainerBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
  background:
    theme.palette.mode === "light"
      ? "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)"
      : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(
          theme.palette.background.paper,
          0.9,
        )} 100%)`,
}));

interface RecentItemProps {
  item: RecentViewedType;
  lang: "ru" | "en";
  index: number;
}

const RecentItem = memo(({ item, lang, index }: RecentItemProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const displayTitle = item.title?.[lang] ?? item.title?.ru ?? item.title?.en ?? "Untitled";
  const displayImage = item.image?.[lang] ?? item.image?.ru ?? item.image?.en ?? "";

  return (
    <Grow
      in={true}
      timeout={300}
      style={{ transformOrigin: "0 0 0", transitionDelay: `${index * 50}ms` }}
    >
      <Box sx={{ flex: "0 0 auto", width: { xs: 140, sm: 170, md: 200 } }}>
        <NextLink
          href={`/title/${item.id}`}
          style={{ textDecoration: "none" }}
          draggable={false}
          aria-label={displayTitle}
        >
          <StyledCard elevation={0}>
            <MediaContainer>
              <MediaImage
                src={displayImage}
                alt={displayTitle}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                style={{ opacity: imgLoaded ? 1 : 0 }}
                draggable={false}
              />
              {!imgLoaded && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{ position: "absolute", top: 0, left: 0 }}
                />
              )}
            </MediaContainer>

            <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
              <Tooltip title={displayTitle} placement="top" enterDelay={500}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    color: "text.primary",
                    lineHeight: 1.3,
                    minHeight: "2.6em",
                  }}
                >
                  {displayTitle}
                </Typography>
              </Tooltip>
            </CardContent>
          </StyledCard>
        </NextLink>
      </Box>
    </Grow>
  );
});

RecentItem.displayName = "RecentItem";

export const RecentViewed = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const recentViewed = useAppSelector((state) => state.recentViewed.recentViewed);

  const [isClearing, setIsClearing] = useToggle(false);
  const [showItems, setShowItems] = useToggle(true);

  const attemptedIdsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lang: "ru" | "en" = ((i18n.resolvedLanguage ?? i18n.language) || "ru")
    .toLowerCase()
    .startsWith("en")
    ? "en"
    : "ru";

  const [triggerMediaDetails] = useLazyGetMediaDetailsQuery();
  const [triggerImdbTitle] = useLazyGetImdbTitleQuery();

  useEffect(() => {
    dispatch(getRecentViewedData());
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [dispatch]);

  useEffect(() => {
    if (recentViewed.length === 0) return;

    let cancelled = false;

    const fillMissingLocalization = async () => {
      const itemsToProcess = recentViewed.slice(0, 20);

      for (const item of itemsToProcess) {
        const idStr = String(item.id);

        const missingTitle = !item.title?.[lang]?.trim();
        const missingImage = !item.image?.[lang]?.trim();
        if (!missingTitle && !missingImage) continue;

        const attemptKey = `${lang}:${idStr}`;
        if (attemptedIdsRef.current.has(attemptKey)) continue;
        attemptedIdsRef.current.add(attemptKey);

        if (cancelled) return;

        try {
          const details = await triggerMediaDetails({ id: idStr }, true).unwrap();
          if (cancelled) return;

          if (lang === "ru") {
            const ruTitle = details.name?.trim() ?? details.alternativeName?.trim() ?? undefined;
            const ruImage = details.poster?.previewUrl ?? details.poster?.url ?? undefined;

            if (ruTitle || ruImage) {
              dispatch(
                patchRecentViewedLocalization({
                  id: Number(idStr),
                  lang: "ru",
                  title: ruTitle,
                  image: ruImage,
                }),
              );
            }
          }

          if (lang === "en") {
            const imdbId = details.externalId?.imdb;
            if (!imdbId) continue;

            const imdbData = await triggerImdbTitle({ id: imdbId }, true).unwrap();
            if (cancelled) return;

            const enTitle = imdbData.title?.trim() ?? undefined;
            const enImage = imdbData.image ?? undefined;

            if (enTitle || enImage) {
              dispatch(
                patchRecentViewedLocalization({
                  id: Number(idStr),
                  lang: "en",
                  title: enTitle,
                  image: enImage,
                }),
              );
            }
          }
        } catch (e) {
          console.warn(`Failed to localize recent item ${idStr} for ${lang}`, e);
        }
      }
    };

    void fillMissingLocalization();

    return () => {
      cancelled = true;
    };
  }, [lang, recentViewed, triggerMediaDetails, triggerImdbTitle, dispatch]);

  const handleClear = useCallback(() => {
    setIsClearing(true);
    setShowItems(false);

    timerRef.current = setTimeout(() => {
      dispatch(clearRecentViewedData());
      setIsClearing(false);
      setShowItems(true);
      attemptedIdsRef.current.clear();
    }, 300);
  }, [dispatch, setIsClearing, setShowItems]);

  return (
    <ContainerBox>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            mb: 2,
            minHeight: 32,
          }}
        >
          <Fade in={recentViewed.length > 0}>
            <Button
              onClick={handleClear}
              variant="text"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              size="small"
              sx={{ borderRadius: 2, fontWeight: 500 }}
              disabled={isClearing}
              aria-label={t("pages.home.recentViewed.aria.clearAll")}
            >
              {t("pages.home.recentViewed.clearAll")}
            </Button>
          </Fade>
        </Box>

        <Collapse in={showItems} timeout={300}>
          {recentViewed.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "auto",
                pb: 1,
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                "& > *": { scrollSnapAlign: "start" },
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  borderRadius: 3,
                  backgroundColor: (theme) => alpha(theme.palette.text.secondary, 0.2),
                },
              }}
            >
              {recentViewed.map((item: RecentViewedType, index: number) => (
                <RecentItem key={item.id} item={item} index={index} lang={lang} />
              ))}
            </Box>
          ) : (
            <Fade in={!recentViewed.length} timeout={500}>
              <EmptyState>
                <HistoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t("pages.home.recentViewed.empty.title")}
                </Typography>
                <Typography variant="body2" color="text.disabled" align="center">
                  {t("pages.home.recentViewed.empty.subtitle")}
                </Typography>
              </EmptyState>
            </Fade>
          )}
        </Collapse>
      </Box>
    </ContainerBox>
  );
};
