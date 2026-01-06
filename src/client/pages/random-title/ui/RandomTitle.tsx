"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { EmptyState, FilterForm, HistoryList, MovieResult } from "./RandomTitleItem";
import { useRandomTitle } from "../model/useRandomTitle";
import { Navbar } from "@/client/widgets/navbar";
import { Footer } from "@/client/widgets/footer";

export const RandomTitle = () => {
  const { t } = useTranslation();
  const { filters, currentMovie, history, isFetching, onFilterChange, onRoll, onClearHistory } =
    useRandomTitle();

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <IconButton
              component={NextLink}
              href="/"
              aria-label={t("pages.random-title.common.aria_go_home")}
              sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {t("pages.random-title.page_title")}
            </Typography>
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ ml: 7 }}>
            {t("pages.random-title.page_subtitle")}
          </Typography>
        </Box>

        <FilterForm
          filters={filters}
          onChange={onFilterChange}
          onRoll={onRoll}
          isFetching={isFetching}
        />

        {currentMovie ? (
          <MovieResult movie={currentMovie} />
        ) : (
          <EmptyState isFetching={isFetching} />
        )}

        <HistoryList history={history} onClear={onClearHistory} />
      </Box>
      <Footer />
    </>
  );
};
