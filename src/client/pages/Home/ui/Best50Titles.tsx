import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useGetCollectionQuery } from "../api/endpoints";
import { useLazyGetImdbTitleQuery, useLazyGetMediaDetailsQuery } from "@/entities/media-detail";
import { operateRecentViewedData } from "@/features/search-bar";
import { useAppDispatch } from "@/shared/config";

const CARD_WIDTH = 220;
const CARD_HEIGHT = 360;
const POSTER_HEIGHT = 240;
const GAP = 16;
const SCROLL_STEP = 3;
const ITEM_FULL_WIDTH = CARD_WIDTH + GAP;
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;
const AUTO_PLAY_INTERVAL = 5000;
const FETCH_BUFFER = 3;

interface SimpleMovie {
  id: number;
  kpId: string;
  title: string;
  image: string;
  rating: number;
}

interface MovieCardProps {
  movie: SimpleMovie;
  onClick: (movie: SimpleMovie) => void;
  isVisible: boolean;
}

interface CarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  infinite?: boolean;
}

const CarouselWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(4),
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 4,
    borderRadius: theme.shape.borderRadius,
  },
}));

const CarouselContainer = styled(Box)({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  padding: "8px 0",
  touchAction: "pan-y",
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
});

const Track = styled("div")<{ $isDragging: boolean }>(({ $isDragging }) => ({
  display: "flex",
  gap: GAP,
  transformStyle: "preserve-3d",
  transition: $isDragging ? "none" : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
  willChange: "transform",
  cursor: $isDragging ? "grabbing" : "grab",
  userSelect: "none",
}));

const NavButton = styled(IconButton)<{ $position: "prev" | "next" }>(({ theme, $position }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  color: theme.palette.text.primary,
  backdropFilter: "blur(8px)",
  boxShadow: theme.shadows[4],
  width: 44,
  height: 44,
  transition: "all 0.2s ease",
  border: `1px solid ${theme.palette.divider}`,
  [$position === "prev" ? "left" : "right"]: 8,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    transform: "translateY(-50%) scale(1.1)",
    boxShadow: theme.shadows[8],
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  "&:disabled": {
    opacity: 0,
    pointerEvents: "none",
  },
  [theme.breakpoints.down("sm")]: {
    width: 36,
    height: 36,
  },
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.palette.mode === "light" ? theme.shadows[8] : "0 10px 30px rgba(0,0,0,0.5)",
  },
  "&:focus-within": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const PosterContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: POSTER_HEIGHT,
  position: "relative",
  overflow: "hidden",
  backgroundColor: theme.palette.action.hover,
}));

const PosterImage = styled("img")<{ $loaded: boolean }>(({ $loaded }) => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: $loaded ? 1 : 0,
  transition: "opacity 0.3s ease",
}));

const PosterPlaceholder = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.action.selected,
  color: theme.palette.text.secondary,
}));

const RatingBadge = styled(Box)({
  position: "absolute",
  top: 8,
  right: 8,
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 8px",
  borderRadius: 12,
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  backdropFilter: "blur(4px)",
  color: "#ffffff",
});

const IndicatorsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: 6,
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
}));

const Indicator = styled("button")<{ $active: boolean }>(({ theme, $active }) => ({
  width: $active ? 24 : 8,
  height: 8,
  type: "button",
  borderRadius: 4,
  border: "none",
  padding: 0,
  cursor: "pointer",
  backgroundColor: $active ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: $active ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.5),
  },
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  backgroundColor: alpha(theme.palette.error.main, 0.05),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
}));

const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void, enabled = true) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!enabled) return;
      const point = "touches" in e ? e.touches[0] : e;
      touchStartRef.current = { x: point.clientX, y: point.clientY, time: Date.now() };
      setIsDragging(true);
    },
    [enabled],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!touchStartRef.current || !isDragging) return;
      const point = "touches" in e ? e.touches[0] : e;
      const deltaX = point.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(point.clientY - touchStartRef.current.y);

      if (deltaY < Math.abs(deltaX)) {
        if (e.cancelable && "preventDefault" in e) e.preventDefault();
        setDragOffset(deltaX);
      }
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(dragOffset) / deltaTime;
    const shouldSwipe =
      Math.abs(dragOffset) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD;

    if (shouldSwipe) {
      if (dragOffset > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    touchStartRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, [dragOffset, onSwipeLeft, onSwipeRight]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseMove: handleTouchMove,
      onMouseUp: handleTouchEnd,
      onMouseLeave: handleTouchEnd,
    },
    isDragging,
    dragOffset,
  };
};

const useCarouselNavigation = (
  totalItems: number,
  visibleItems: number,
  infinite = false,
  scrollStep: number = SCROLL_STEP,
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, totalItems - visibleItems);
  const remainingItems = totalItems - currentIndex - visibleItems;

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goToIndex = useCallback(
    (index: number) => {
      setCurrentIndex(() => {
        if (infinite) {
          if (index < 0) return maxIndex;
          if (index > maxIndex) return 0;
          return index;
        }
        return Math.max(0, Math.min(index, maxIndex));
      });
    },
    [infinite, maxIndex],
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + scrollStep;
      if (infinite) return next > maxIndex ? 0 : next;
      return Math.min(next, maxIndex);
    });
  }, [infinite, maxIndex, scrollStep]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev - scrollStep;
      if (infinite) return next < 0 ? maxIndex : next;
      return Math.max(next, 0);
    });
  }, [infinite, maxIndex, scrollStep]);

  const canGoNext = infinite || currentIndex < maxIndex;
  const canGoPrev = infinite || currentIndex > 0;

  return {
    currentIndex,
    goToIndex,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
    maxIndex,
    remainingItems,
  };
};

const MovieCard = memo(({ movie, onClick, isVisible }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [movie.image]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const hasSrc = Boolean(movie.image);

  return (
    <Link
      component={RouterLink}
      to={`/title/${movie.kpId}`}
      underline="none"
      onClick={() => onClick(movie)}
      aria-label={`${movie.title}, Rating: ${movie.rating.toFixed(1)}`}
      tabIndex={isVisible ? 0 : -1}
      draggable={false}
    >
      <StyledCard elevation={2}>
        <PosterContainer>
          {!imageLoaded && (
            <PosterPlaceholder>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
            </PosterPlaceholder>
          )}

          {!hasSrc ? (
            <PosterPlaceholder>
              <Typography variant="caption" color="text.secondary">
                Image unavailable
              </Typography>
            </PosterPlaceholder>
          ) : imageError ? (
            <PosterPlaceholder>
              <Typography variant="caption" textAlign="center" px={2} color="text.secondary">
                Image unavailable
              </Typography>
            </PosterPlaceholder>
          ) : (
            <PosterImage
              src={movie.image}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
              $loaded={imageLoaded}
              draggable={false}
            />
          )}

          <RatingBadge>
            <StarIcon sx={{ color: "#fbbf24", fontSize: 16 }} />
            <Typography variant="caption" fontWeight="bold" fontSize={13}>
              {movie.rating.toFixed(1)}
            </Typography>
          </RatingBadge>
        </PosterContainer>

        <Box sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.primary"
            title={movie.title}
            sx={{
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {movie.title}
          </Typography>
        </Box>
      </StyledCard>
    </Link>
  );
});

MovieCard.displayName = "MovieCard";

const LoadingSkeleton = memo(() => (
  <Box sx={{ display: "flex", gap: 2, overflow: "hidden", py: 1 }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Box key={i} sx={{ width: CARD_WIDTH, flexShrink: 0 }}>
        <Skeleton
          variant="rectangular"
          height={POSTER_HEIGHT}
          sx={{ borderRadius: 1, mb: 1, bgcolor: "action.hover" }}
          animation="wave"
        />
        <Skeleton width="90%" animation="wave" sx={{ bgcolor: "action.hover" }} />
        <Skeleton width="60%" animation="wave" sx={{ bgcolor: "action.hover" }} />
      </Box>
    ))}
  </Box>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

const ErrorState = memo(({ onRetry }: { onRetry: () => void }) => (
  <ErrorContainer>
    <Typography color="error" variant="body1">
      Failed to load movies
    </Typography>
    <Button variant="outlined" color="error" startIcon={<RefreshIcon />} onClick={onRetry}>
      Try Again
    </Button>
  </ErrorContainer>
));

ErrorState.displayName = "ErrorState";

const CarouselIndicators = memo(
  ({
    total,
    current,
    onSelect,
  }: {
    total: number;
    current: number;
    visibleItems: number;
    onSelect: (index: number) => void;
  }) => {
    const indicatorCount = Math.ceil(total / SCROLL_STEP);
    const activeIndicator = Math.floor(current / SCROLL_STEP);

    if (indicatorCount <= 1) return null;

    return (
      <IndicatorsContainer role="tablist" aria-label="Carousel navigation">
        {Array.from({ length: indicatorCount }).map((_, i) => (
          <Indicator
            key={i}
            $active={i === activeIndicator}
            onClick={() => onSelect(i * SCROLL_STEP)}
            role="tab"
            aria-selected={i === activeIndicator}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </IndicatorsContainer>
    );
  },
);

CarouselIndicators.displayName = "CarouselIndicators";

export const Best50Titles = memo(
  ({
    autoPlay = false,
    autoPlayInterval = AUTO_PLAY_INTERVAL,
    showIndicators = true,
    infinite = false,
  }: CarouselProps) => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const lang: "ru" | "en" = ((i18n.resolvedLanguage ?? i18n.language) || "ru")
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "ru";

    const [containerWidth, setContainerWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const [imdbCache, setImdbCache] = useState<Record<string, { title: string; image: string }>>(
      {},
    );
    const attemptedIdsRef = useRef<Set<string>>(new Set());

    const { data, isLoading, isError, refetch } = useGetCollectionQuery({
      slug: "top250",
      limit: 50,
    });

    const [triggerMediaDetails] = useLazyGetMediaDetailsQuery();
    const [triggerImdbTitle] = useLazyGetImdbTitleQuery();

    const rawMovies = useMemo(() => data?.movies?.docs ?? [], [data]);

    const movies: SimpleMovie[] = useMemo(() => {
      return rawMovies.map(({ movie: m }) => {
        const kpId = String(m.id);
        const cache = imdbCache[kpId];

        const ruTitle = m.name ?? m.alternativeName ?? "Untitled";
        const enTitle = (cache?.title || m.enName) ?? m.alternativeName ?? m.name ?? "Untitled";

        const kpPoster = m.poster?.previewUrl ?? m.poster?.url ?? "";
        const enPoster = cache?.image || kpPoster;

        return {
          id: m.id,
          kpId: kpId,
          title: lang === "en" ? enTitle : ruTitle,
          image: lang === "en" ? enPoster : kpPoster,
          rating: m.rating?.kp ?? m.rating?.imdb ?? 0,
        };
      });
    }, [rawMovies, imdbCache, lang]);

    const visibleItems = useMemo(
      () => Math.max(1, Math.floor((containerWidth + GAP) / ITEM_FULL_WIDTH)),
      [containerWidth],
    );

    const { currentIndex, goToIndex, goNext, goPrev, canGoNext, canGoPrev, maxIndex } =
      useCarouselNavigation(movies.length, visibleItems, infinite);

    const handleFocusCapture = useCallback(() => setIsPaused(true), []);
    const handleBlurCapture = useCallback((e: React.FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && wrapperRef.current?.contains(next)) return;
      setIsPaused(false);
    }, []);

    const { handlers, isDragging, dragOffset } = useSwipeGesture(
      goNext,
      goPrev,
      movies.length > visibleItems,
    );

    const imdbCacheRef = useRef(imdbCache);

    useEffect(() => {
      imdbCacheRef.current = imdbCache;
    }, [imdbCache]);

    const kpIds = useMemo(() => {
      return rawMovies.map(({ movie: m }) => String(m.id));
    }, [rawMovies]);

    useEffect(() => {
      if (lang !== "en" || kpIds.length === 0) return;

      const startIndex = Math.max(0, currentIndex - FETCH_BUFFER);
      const endIndex = Math.min(kpIds.length - 1, currentIndex + visibleItems + FETCH_BUFFER);

      const windowIds = kpIds.slice(startIndex, endIndex + 1);

      const idsToFetch = windowIds.filter((kpId) => {
        const alreadyAttempted = attemptedIdsRef.current.has(kpId);
        const alreadyCached = Boolean(imdbCacheRef.current[kpId]);
        return !alreadyAttempted && !alreadyCached;
      });

      if (idsToFetch.length === 0) return;

      let cancelled = false;

      const updates: Record<string, { title: string; image: string }> = {};

      const fetchOne = async (kpId: string) => {
        attemptedIdsRef.current.add(kpId);

        try {
          const details = await triggerMediaDetails({ id: kpId }, true).unwrap();
          if (cancelled) return;

          const imdbId = details.externalId?.imdb;
          if (!imdbId) return;

          const imdbData = await triggerImdbTitle({ id: imdbId }, true).unwrap();
          if (cancelled) return;

          const title = imdbData.title?.trim() ?? "";
          const image = imdbData.image ?? "";

          if (title || image) {
            updates[kpId] = { title, image };
          }
        } catch (e) {
          console.debug(`Failed to fetch EN data for ${kpId}`, e);
        }
      };

      const run = async () => {
        const concurrency = 4;
        const queue = [...idsToFetch];

        const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
          while (!cancelled && queue.length > 0) {
            const kpId = queue.shift()!;
            await fetchOne(kpId);
          }
        });

        await Promise.all(workers);

        if (!cancelled && Object.keys(updates).length > 0) {
          setImdbCache((prev) => ({ ...prev, ...updates }));
        }
      };

      void run();

      return () => {
        cancelled = true;
      };
    }, [lang, kpIds, currentIndex, visibleItems, triggerMediaDetails, triggerImdbTitle]);

    useEffect(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) setContainerWidth(entry.contentRect.width);
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (!autoPlay || isPaused || !canGoNext) {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
          autoPlayRef.current = null;
        }
        return;
      }

      autoPlayRef.current = setInterval(() => goNext(), autoPlayInterval);
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }, [autoPlay, autoPlayInterval, isPaused, canGoNext, goNext]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            goPrev();
            break;
          case "ArrowRight":
            e.preventDefault();
            goNext();
            break;
          case "Home":
            e.preventDefault();
            goToIndex(0);
            break;
          case "End":
            e.preventDefault();
            goToIndex(maxIndex);
            break;
        }
      },
      [goPrev, goNext, goToIndex, maxIndex],
    );

    const handleCardClick = useCallback(
      (movie: SimpleMovie) => {
        dispatch(
          operateRecentViewedData({
            id: movie.id,
            title: { [lang]: movie.title },
            image: { [lang]: movie.image },
            rating: movie.rating,
          }),
        );
      },
      [dispatch, lang],
    );

    const handleMouseEnter = useCallback(() => setIsPaused(true), []);
    const handleMouseLeave = useCallback(() => setIsPaused(false), []);

    const translateX = useMemo(() => {
      const baseOffset = Math.min(currentIndex, maxIndex) * ITEM_FULL_WIDTH;
      return baseOffset - dragOffset;
    }, [currentIndex, maxIndex, dragOffset]);

    const getIsVisible = useCallback(
      (index: number) => {
        return index >= currentIndex && index < currentIndex + visibleItems;
      },
      [currentIndex, visibleItems],
    );

    if (isLoading) {
      return (
        <Box sx={{ width: "100%", mb: 4 }}>
          <Skeleton width={200} height={32} sx={{ mb: 2, bgcolor: "action.hover" }} />
          <LoadingSkeleton />
        </Box>
      );
    }

    if (isError) {
      return (
        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="text.primary">
            {t("pages.home.best50")}
          </Typography>
          <ErrorState onRetry={refetch} />
        </Box>
      );
    }

    if (!movies.length) return null;

    return (
      <CarouselWrapper
        ref={wrapperRef}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
        tabIndex={0}
        role="region"
        aria-label="Top 50 Movies Carousel"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
          }}
        >
          <Typography variant="h5" fontWeight={700} component="h2" color="text.primary">
            {t("pages.home.best50")}
          </Typography>
        </Box>
        <CarouselContainer ref={containerRef} aria-live="polite" aria-atomic="false">
          <NavButton
            onClick={goPrev}
            disabled={!canGoPrev}
            $position="prev"
            size="medium"
            aria-label="Previous slides"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </NavButton>

          <Track
            style={{ transform: `translate3d(-${translateX}px, 0, 0)` }}
            $isDragging={isDragging}
            {...handlers}
          >
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleCardClick}
                isVisible={getIsVisible(index)}
              />
            ))}
          </Track>

          <NavButton
            onClick={goNext}
            disabled={!canGoNext}
            $position="next"
            size="medium"
            aria-label="Next slides"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </NavButton>
        </CarouselContainer>

        {showIndicators && (
          <CarouselIndicators
            total={movies.length}
            current={currentIndex}
            visibleItems={visibleItems}
            onSelect={goToIndex}
          />
        )}
      </CarouselWrapper>
    );
  },
);
export default Best50Titles;

Best50Titles.displayName = "Top50Carousel";
