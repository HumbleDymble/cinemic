"use client";

import { type ChangeEvent, type MouseEventHandler, useEffect, useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useChangeUsernameMutation } from "../api/endpoints";
import { useHandleAuthorizationQuery } from "@/client/entities/user";
import { showSnackbar } from "@/client/entities/alert";
import { useAppDispatch, useAppSelector } from "@/client/shared/config";

interface BackendErrorData {
  message: string;
  nextAllowedChangeDate?: string;
}

export const UserInfo = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const { data } = useHandleAuthorizationQuery(undefined, { skip: !user });

  const currentUsername = data?.user?.username ?? user?.username ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const [changeUsername, { isLoading, error }] = useChangeUsernameMutation();

  useEffect(() => {
    if (!isEditing && currentUsername) setUsernameInput(currentUsername);
  }, [currentUsername, isEditing]);

  const handleChangeUsernameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
  };

  const handleStartEdit = () => {
    setUsernameInput(currentUsername);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUsernameInput(currentUsername);
    setIsEditing(false);
  };

  const saveUsername = async () => {
    if (usernameInput === currentUsername) {
      setIsEditing(false);
      return;
    }

    await changeUsername({ newUsername: usernameInput }).unwrap();

    try {
      setIsEditing(false);
      dispatch(
        showSnackbar({
          open: true,
          message: t("pages.user-settings.settings.user.snackbar_updated"),
          severity: "success",
        }),
      );
    } catch (e) {
      console.error("Failed to update username", e);

      let message = t("pages.user-settings.settings.user.snackbar_update_failed");

      const err = e as FetchBaseQueryError;
      const errorData = err.data as BackendErrorData | undefined;

      if (errorData?.nextAllowedChangeDate) {
        const dateObj = new Date(errorData.nextAllowedChangeDate);
        const formatted = dateObj.toLocaleDateString(i18n.resolvedLanguage);

        message = t("pages.user-settings.settings.user.snackbar_change_available_on", {
          date: formatted,
        });
      }

      dispatch(
        showSnackbar({
          open: true,
          message,
          severity: "error",
          autoHideDuration: 5000,
        }),
      );
    }
  };

  const handleSave: MouseEventHandler<HTMLButtonElement> = () => {
    void saveUsername();
  };

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      textAlign="center"
      gap={2}
    >
      <TextField
        margin="normal"
        fullWidth
        label={t("pages.user-settings.settings.user.username_label")}
        value={usernameInput}
        onChange={handleChangeUsernameInput}
        disabled={!isEditing || isLoading}
        error={!!error}
      />

      <Box display="flex" gap={2}>
        {!isEditing ? (
          <Button variant="contained" onClick={handleStartEdit}>
            {t("pages.user-settings.settings.user.edit")}
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t("pages.user-settings.common.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading || !usernameInput.trim()}
            >
              {isLoading
                ? t("pages.user-settings.common.saving")
                : t("pages.user-settings.common.save")}
            </Button>
          </>
        )}
      </Box>
    </Grid>
  );
};
