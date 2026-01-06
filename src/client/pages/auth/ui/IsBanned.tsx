"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BlockIcon from "@mui/icons-material/Block";
import { useHandleAuthorizationQuery, useSignOutMutation } from "@/client/entities/user";
import { Loader } from "@/client/shared/ui";

export function IsBanned() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const { data, isLoading } = useHandleAuthorizationQuery();
  const [signOut] = useSignOutMutation();

  const user = data?.user;

  useEffect(() => {
    if (!user) return;
    if (!user.isBanned) router.replace("/");
  }, [user, router]);

  if (isLoading) return <Loader open={true} />;

  if (!user) {
    router.replace("/");
    return <Loader open={true} />;
  }

  if (!user.isBanned) return <Loader open={true} />;

  const formattedBanUntil = user.banUntil
    ? new Date(user.banUntil).toLocaleString(i18n.resolvedLanguage)
    : t("pages.auth.banned.unknown_period");

  const handleLogout = () => {
    signOut()
      .unwrap()
      .then(() => {
        router.replace("/auth/signin");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BlockIcon color="error" sx={{ fontSize: 60, mb: 2 }} />

        <Typography component="h1" variant="h4" gutterBottom>
          {t("pages.auth.banned.title")}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t("pages.auth.banned.subtitle", { date: formattedBanUntil })}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t("pages.auth.banned.description")}
        </Typography>

        <Box>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            {t("pages.auth.banned.logout")}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
