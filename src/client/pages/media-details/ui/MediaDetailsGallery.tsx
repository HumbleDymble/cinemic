import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { Image } from "@/entities/media-detail";

interface Props {
  images: Image[];
  title: string;
}

export const MediaDetailsGallery = ({ images, title }: Props) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
    setIsImageLoading(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = useCallback(
    (e?: MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      setIsImageLoading(true);
      setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [images.length],
  );

  const handleNext = useCallback(
    (e?: MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      setIsImageLoading(true);
      setActiveIndex((prev) => (prev + 1) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev(e);
      if (e.key === "ArrowRight") handleNext(e);
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handlePrev, handleNext]);

  if (!images?.length) return null;

  const activeImage = images[activeIndex];

  return (
    <>
      <Grid sx={{ xs: 12 }}>
        <Box
          display="flex"
          gap={2}
          sx={{
            overflowX: "auto",
            pb: 2,
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-track": {
              backgroundColor: (theme) => theme.palette.action.hover,
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: (theme) => alpha(theme.palette.text.secondary, 0.3),
              borderRadius: 4,
              "&:hover": {
                backgroundColor: (theme) => alpha(theme.palette.text.secondary, 0.5),
              },
            },
          }}
        >
          {images.map((img, index) => (
            <ButtonBase
              key={index}
              onClick={() => handleOpen(index)}
              focusRipple
              sx={{
                minWidth: { xs: 220, sm: 250, md: 280 },
                height: { xs: 130, sm: 150, md: 170 },
                borderRadius: 2,
                overflow: "hidden",
                flexShrink: 0,
                bgcolor: "action.hover",
                cursor: "zoom-in",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.4)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <img
                src={img.previewUrl ?? img.url}
                alt={t("pages.media-details.components.gallery.thumb_alt", {
                  title,
                  index: index + 1,
                })}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </ButtonBase>
          ))}
        </Box>
      </Grid>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { style: { backgroundColor: "rgba(0, 0, 0, 0.95)", boxShadow: "none" } },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleClose}
        >
          <IconButton
            onClick={handleClose}
            aria-label={t("pages.media-details.components.gallery.close")}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              zIndex: 1500,
            }}
          >
            <CloseIcon />
          </IconButton>

          {images.length > 1 && (
            <IconButton
              onClick={handlePrev}
              aria-label={t("pages.media-details.components.gallery.prev")}
              sx={{
                position: "absolute",
                left: 20,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                zIndex: 1500,
                p: 2,
                display: { xs: "none", md: "inline-flex" },
              }}
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          )}

          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isImageLoading && <CircularProgress sx={{ color: "#fff", position: "absolute" }} />}

            {activeImage && (
              <img
                src={activeImage.url ?? activeImage.previewUrl}
                alt={t("pages.media-details.components.gallery.full_alt", {
                  title,
                  index: activeIndex + 1,
                })}
                onLoad={() => setIsImageLoading(false)}
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                  borderRadius: 4,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  opacity: isImageLoading ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              />
            )}
          </Box>

          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              aria-label={t("pages.media-details.components.gallery.next")}
              sx={{
                position: "absolute",
                right: 20,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                zIndex: 1500,
                p: 2,
                display: { xs: "none", md: "inline-flex" },
              }}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Dialog>
    </>
  );
};
