import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { type LoginForm, signIn, useSignInMutation } from "@/entities/user";
import { showSnackbar } from "@/entities/alert";
import { useAppDispatch } from "@/shared/config";

export const useSignIn = () => {
  const { t } = useTranslation();

  const [auth, setAuth] = useState<LoginForm>({ email: "", password: "" });

  const [login] = useSignInMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await login(auth).unwrap();
      dispatch(signIn(user));

      if (user?.user?.banUntil && user?.user?.banUntil > new Date().toISOString()) {
        void navigate("/banned", { replace: true });
      } else {
        void navigate("/", { replace: true });
      }
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
