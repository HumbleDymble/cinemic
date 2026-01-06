"use client";

import { type ChangeEvent, type FormEvent, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { type RegisterForm, signUp, useSignUpMutation } from "@/client/entities/user";
import { showSnackbar } from "@/client/entities/alert";
import { useAppDispatch } from "@/client/shared/config";

export const useSignUp = (catchError: ReactNode) => {
  const { t } = useTranslation();

  const [auth, setAuth] = useState<RegisterForm>({
    email: "",
    password: "",
    username: "",
  });

  const dispatch = useAppDispatch();
  const [register] = useSignUpMutation();

  const handleRegistration = (e: ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await register(auth).unwrap();
      dispatch(signUp(user));
      dispatch(
        showSnackbar({
          open: true,
          severity: "success",
          message: t("pages.auth.signup.snackbar_account_created"),
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(
        showSnackbar({
          open: true,
          severity: "error",
          message: t("pages.auth.signup.snackbar_generic_error"),
          action: catchError,
        }),
      );
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return { isMobile, handleSubmit, handleRegistration };
};
