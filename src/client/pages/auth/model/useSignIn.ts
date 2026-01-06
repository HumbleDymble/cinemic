"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { type LoginForm, signIn, useSignInMutation } from "@/client/entities/user";
import { showSnackbar } from "@/client/entities/alert";
import { useAppDispatch } from "@/client/shared/config";

export const useSignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [auth, setAuth] = useState<LoginForm>({ email: "", password: "" });

  const [login] = useSignInMutation();
  const dispatch = useAppDispatch();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAuth((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = await login(auth).unwrap();
      dispatch(signIn(payload));

      const banUntil = payload?.user?.banUntil;
      const isBannedNow = typeof banUntil === "string" && new Date(banUntil).getTime() > Date.now();

      router.replace(isBannedNow ? "/banned" : "/");
    } catch (e) {
      console.error("Login failed:", e);
      dispatch(
        showSnackbar({
          open: true,
          message: t("pages.auth.signin.snackbar_invalid_credentials"),
          severity: "error",
        }),
      );
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return { isMobile, changeHandler, handleSubmit };
};
