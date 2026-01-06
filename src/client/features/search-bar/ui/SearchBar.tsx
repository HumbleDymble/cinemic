"use client";

import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { SearchList } from "./SearchList";
import { useSearchBar } from "../model/useSearchBar";
import { useSearchList } from "../model/useSearchList";

export const SearchBar = () => {
  const { t } = useTranslation();

  const {
    search,
    query,
    data,
    isError,
    handleSearchChange,
    clearSearch,
    showLoader,
    handleSubmit,
    handleClearClick,
    preventMouseDownBlur,
    hasAnyText,
    inputRef,
  } = useSearchBar();

  const { results, selectedIndex, handleKeyDown, handleItemClick, handleItemHover } = useSearchList(
    {
      search: query,
      clearSearch,
      data,
    },
  );

  return (
    <Box component="form" role="search" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          gap: 1,
          borderRadius: 999,
          bgcolor: theme.palette.background.paper,
          transition: "border-color 120ms ease, box-shadow 120ms ease",
          borderColor: theme.palette.divider,
          "&:focus-within": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`,
          },
        })}
      >
        <SearchIcon sx={{ color: "text.secondary" }} />
        <InputBase
          inputRef={inputRef}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={t("features.search.placeholder")}
          autoComplete="off"
          inputProps={{ "aria-label": t("features.search.aria_input") }}
          sx={{ flex: 1, fontSize: 14, "& input": { py: 0.75 } }}
        />
        {(showLoader ?? hasAnyText) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {showLoader && <CircularProgress size={16} thickness={5} />}
            {hasAnyText && (
              <IconButton
                aria-label={t("features.search.aria_clear")}
                size="small"
                onMouseDown={preventMouseDownBlur}
                onClick={handleClearClick}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      </Paper>

      <SearchList
        search={query}
        clearSearch={clearSearch}
        results={results}
        selectedIndex={selectedIndex}
        onItemClick={handleItemClick}
        onItemHover={handleItemHover}
        isLoading={showLoader}
        error={isError}
      />
    </Box>
  );
};
