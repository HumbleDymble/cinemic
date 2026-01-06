"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { WatchlistItem } from "./WatchlistItem";
import { MovieDetailDialog } from "./MovieDetailDialog";
import { Navbar } from "@/client/widgets/navbar";
import { Footer } from "@/client/widgets/footer";
import type { MovieDtoV1_4 } from "@/client/entities/media-detail";
import { useGetWatchlistQuery } from "@/client/entities/watchlist";
import { Loader } from "@/client/shared/ui";
import { useAppSelector } from "@/client/shared/config";

export const Watchlist = () => {
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.auth.accessToken);

  const { data, isLoading: loadingIds } = useGetWatchlistQuery(undefined, {
    skip: !token,
  });

  const watchlistIds = data?.watchlist ?? [];
  const [selected, setSelected] = useState<MovieDtoV1_4 | null>(null);

  const handleOpen = useCallback((item: MovieDtoV1_4) => setSelected(item), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <Navbar />

      {loadingIds ? (
        <Loader open />
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: "1rem" }}>
            <Typography variant="h3" fontWeight="bold">
              {t("pages.watchlist.page_title")}
            </Typography>
          </Box>

          {!token ? (
            <Typography color="text.secondary">{t("pages.watchlist.login_hint")}</Typography>
          ) : watchlistIds.length > 0 ? (
            <Stack divider={<Divider flexItem />} spacing={2}>
              {watchlistIds.map((id) => (
                <WatchlistItem key={id} id={id} onOpen={handleOpen} />
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 5 }}>
              {t("pages.watchlist.empty")}
            </Typography>
          )}

          {selected && <MovieDetailDialog selected={selected} onClose={handleClose} />}
        </Container>
      )}

      <Footer />
    </>
  );
};
