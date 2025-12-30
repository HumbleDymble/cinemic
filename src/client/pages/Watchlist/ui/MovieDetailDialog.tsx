import { memo } from "react";
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
import type { MovieDtoV1_4 } from "@/entities/media-detail";

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
  limit?: number,
) => {
  if (!persons?.length) return t("pages.watchlist.common.na");

  const relevantPersons = persons.filter((p) => p.enProfession === profession);
  if (relevantPersons.length === 0) return t("pages.watchlist.common.na");

  const visible = limit ? relevantPersons.slice(0, limit) : relevantPersons;

  const names = visible
    .map((p) => p.name ?? p.enName ?? t("pages.watchlist.common.unknown"))
    .join(", ");

  return limit && relevantPersons.length > limit ? `${names}...` : names;
};

export const MovieDetailDialog = memo(
  ({ selected, onClose }: { selected: MovieDtoV1_4 | null; onClose: () => void }) => {
    const { t } = useTranslation();
    if (!selected) return null;

    return (
      <Dialog fullWidth maxWidth="md" open={!!selected} onClose={onClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {selected.name ?? selected.enName} ({selected.year})
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ p: 1 }}>
            <Box sx={{ flexShrink: 0, width: { xs: "100%", md: 200 } }}>
              <Box
                component="img"
                src={selected.poster?.previewUrl ?? selected.poster?.url ?? ""}
                alt={
                  selected.name ??
                  selected.enName ??
                  t("pages.watchlist.detail_dialog.movie_poster_alt")
                }
                sx={{ width: "100%", height: "auto", borderRadius: 1 }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography variant="body1" gutterBottom>
                {selected.description ??
                  selected.shortDescription ??
                  t("pages.watchlist.detail_dialog.no_description")}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.directed_by")}
                  value={getPersonNames(t, selected.persons, "director")}
                />
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.genre")}
                  value={selected.genres?.map((g) => g.name).join(", ") ?? t("common.na")}
                />
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.actors")}
                  value={getPersonNames(t, selected.persons, "actor", 5)}
                />
                <DetailItem
                  label={t("pages.watchlist.detail_dialog.countries")}
                  value={selected.countries?.map((c) => c.name).join(", ") ?? t("common.na")}
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
