"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSignUp } from "../model/useSignUp";
import { Footer } from "@/client/widgets/footer";

const SignUpErrorAction = () => {
  const { t } = useTranslation();

  return (
    <>
      <Link
        component={NextLink}
        href="/auth/signin"
        sx={{ mr: 1.5, color: "text.primary", textDecoration: "underline" }}
      >
        {t("pages.auth.signin.title")}
      </Link>
      <Link
        component={NextLink}
        href="/"
        sx={{ color: "text.primary", textDecoration: "underline" }}
      >
        {t("pages.auth.common.home")}
      </Link>
    </>
  );
};

export const SignUp = () => {
  const { t } = useTranslation();
  const { isMobile, handleRegistration, handleSubmit } = useSignUp(<SignUpErrorAction />);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 0 },
          py: 4,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              p: isMobile ? 2 : 4,
              borderRadius: isMobile ? 0 : 2,
              backgroundColor: isMobile ? "transparent" : "background.paper",
              boxShadow: (theme) =>
                isMobile
                  ? "none"
                  : theme.palette.mode === "light"
                    ? "0px 4px 12px rgba(0, 0, 0, 0.1)"
                    : "0px 4px 12px rgba(0, 0, 0, 0.6)",
            }}
          >
            <IconButton
              component={NextLink}
              href="/"
              edge="start"
              aria-label={t("pages.auth.common.aria_go_home")}
              sx={{
                alignSelf: "flex-start",
                mb: { xs: 1, sm: 1.5 },
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" component="h1" color="text.primary">
              {t("pages.auth.signup.title")}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ my: 2, width: "100%" }}>
              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("pages.auth.common.email_label")}
                  name="email"
                  autoComplete="email"
                  onChange={handleRegistration}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={t("pages.auth.common.password_label")}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleRegistration}
                />
                <TextField
                  required
                  fullWidth
                  id="username"
                  label={t("pages.auth.common.username_label")}
                  name="username"
                  autoComplete="username"
                  onChange={handleRegistration}
                />
              </Stack>
              <Button type="submit" fullWidth variant="contained" sx={{ my: 3, py: 1.5 }}>
                {t("pages.auth.signup.submit")}
              </Button>
              <Typography variant="body1" color="text.secondary">
                {t("pages.auth.signup.have_account")}{" "}
                <Link
                  component={NextLink}
                  href="/auth/signin"
                  underline="hover"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {t("pages.auth.signin.title")}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};
