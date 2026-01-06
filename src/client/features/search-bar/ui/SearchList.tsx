"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import ListItemButton, { type ListItemButtonProps } from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Backdrop from "@mui/material/Backdrop";
import Portal from "@mui/material/Portal";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import CloseIcon from "@mui/icons-material/Close";
import type { SearchMovieDtoV1_4 } from "@/client/entities/media-detail";

interface Props {
  search: string;
  clearSearch: () => void;
  results: SearchMovieDtoV1_4[];
  selectedIndex: number;
  onItemClick: (item: SearchMovieDtoV1_4) => void;
  onItemHover: (index: number) => void;
  isLoading: boolean;
  error: boolean;
}

const StyledListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "animationDelay",
})<ListItemButtonProps & LinkProps & { animationDelay?: number }>(
  ({ theme, animationDelay = 0 }) => ({
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: "slideIn 0.4s ease-out forwards",
    animationDelay: `${animationDelay}ms`,
    opacity: 0,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows[4],
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.action.selected,
      "&:hover": {
        backgroundColor: theme.palette.action.selected,
      },
    },
    "@keyframes slideIn": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  }),
);

const SearchPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  maxHeight: "75vh",
  overflowY: "auto",
  borderRadius: theme.spacing(2),
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-track": { background: theme.palette.grey[100] },
  "&::-webkit-scrollbar-thumb": { background: theme.palette.grey[400], borderRadius: 4 },
  "&::-webkit-scrollbar-thumb:hover": { background: theme.palette.grey[600] },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 120,
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[100],
  position: "relative",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  "&:hover img": { transform: "scale(1.05)" },
}));

export const SearchList = ({
  search,
  clearSearch,
  results,
  selectedIndex,
  onItemClick,
  onItemHover,
  isLoading,
  error,
}: Props) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [showList, setShowList] = useState(false);

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    clearSearch();
  }, [pathname, clearSearch]);

  useEffect(() => {
    if (search) {
      setShowList(true);
      return;
    }
    const timeout = setTimeout(() => setShowList(false), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (selectedIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  const mounted = useMemo(() => Boolean(search) || showList, [search, showList]);
  if (!mounted) return null;

  const imageSize = 125;

  return (
    <Portal>
      <Backdrop
        open={!!search}
        onClick={clearSearch}
        sx={{
          zIndex: (t) => t.zIndex.appBar - 2,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      <Fade in={!!search} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.appBar - 1,
            mt: "60px",
            px: 2,
            maxWidth: 800,
            width: "100%",
            mx: "auto",
            display: search ? "block" : "none",
          }}
        >
          <Grow in={showList} timeout={400}>
            <SearchPaper elevation={6}>
              {error ? (
                <Fade in>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2.5,
                      textAlign: "center",
                      mt: 1.5,
                      backgroundColor: "error.lighter",
                      border: 1,
                      borderColor: "error.light",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="body1" color="error">
                      {t("features.search.fetch_error")}
                    </Typography>

                    <IconButton onClick={clearSearch} size="small" color="primary" sx={{ mt: 0.5 }}>
                      <CloseIcon fontSize="small" />
                      <Typography variant="button" sx={{ ml: 0.5 }}>
                        {t("features.search.clear")}
                      </Typography>
                    </IconButton>
                  </Paper>
                </Fade>
              ) : isLoading ? (
                <Box sx={{ position: "relative", p: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.5,
                      px: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={16} thickness={4} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1.5 }}>
                        {t("features.search.searching_for", { search })}
                      </Typography>
                    </Box>

                    <Tooltip title={t("features.search.cancel_search")}>
                      <IconButton
                        onClick={clearSearch}
                        size="small"
                        aria-label={t("features.search.cancel_search")}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {Array.from({ length: 2 }).map((_, index) => (
                    <Paper key={`skeleton-${index}`} elevation={2} sx={{ mb: 1.5, p: 1.5 }}>
                      <ListItem alignItems="center">
                        <ListItemAvatar sx={{ minWidth: imageSize + 20 }}>
                          <Skeleton
                            variant="rectangular"
                            width={imageSize}
                            height={imageSize}
                            animation="wave"
                            sx={{ borderRadius: 1 }}
                          />
                        </ListItemAvatar>
                        <Box sx={{ width: "100%", ml: 1 }}>
                          <Skeleton variant="text" width="80%" height={24} animation="wave" />
                        </Box>
                      </ListItem>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Fade in={!isLoading} timeout={200}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        background: (theme) => theme.palette.grey[50],
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("features.search.found_results", { count: results.length })}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} color="primary">
                          {t("features.search.query", { search })}
                        </Typography>
                      </Box>

                      <Tooltip title={t("features.search.clear_search")}>
                        <IconButton
                          onClick={clearSearch}
                          size="small"
                          aria-label={t("features.search.clear_search")}
                          sx={{
                            transition: "transform 0.2s",
                            "&:hover": { transform: "rotate(90deg)" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <List ref={listRef} disablePadding sx={{ p: 2 }}>
                      {results.map((item, index) => {
                        const isSelected = index === selectedIndex;

                        const title =
                          item.name ??
                          item.enName ??
                          item.alternativeName ??
                          t("features.search.untitled");

                        const imageUrl = item.poster?.previewUrl ?? item.poster?.url ?? "";
                        const year = item.year ? `(${item.year})` : "";
                        const rating = item.rating?.kp ?? item.rating?.imdb ?? 0;

                        return (
                          <StyledListItem
                            key={item.id ?? `${title}-${index}`}
                            component={NextLink}
                            href={item.id != null ? `/title/${item.id}` : "#"}
                            onMouseEnter={() => onItemHover(index)}
                            onClick={() => onItemClick(item)}
                            selected={isSelected}
                            data-index={index}
                            animationDelay={index * 50}
                          >
                            <ListItemAvatar sx={{ minWidth: 100 }}>
                              <ImageContainer>
                                <img
                                  src={imageUrl}
                                  alt={title}
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "";
                                  }}
                                />
                              </ImageContainer>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="start"
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: isSelected ? 600 : 500,
                                      color: isSelected ? "primary.main" : "text.primary",
                                      transition: "color 0.2s",
                                    }}
                                  >
                                    {title}
                                  </Typography>

                                  {rating > 0 && (
                                    <Chip
                                      label={rating.toFixed(1)}
                                      size="small"
                                      color={rating > 7 ? "success" : "default"}
                                      variant="outlined"
                                      sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box
                                  component="span"
                                  display="flex"
                                  flexDirection="column"
                                  gap={0.5}
                                  mt={0.5}
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    {year} {item.type ? `• ${item.type}` : ""}
                                  </Typography>

                                  {item.enName && item.enName !== title && (
                                    <Typography variant="caption" color="text.secondary">
                                      {t("features.search.original")}: {item.enName}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </StyledListItem>
                        );
                      })}
                    </List>
                  </Box>
                </Fade>
              )}
            </SearchPaper>
          </Grow>
        </Box>
      </Fade>
    </Portal>
  );
};
