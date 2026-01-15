import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BlockIcon from "@mui/icons-material/Block";
import { useHandleAuthorizationQuery, useSignOutMutation } from "@/entities/user";

export const IsBanned = () => {
  const { t, i18n } = useTranslation();
  const { data } = useHandleAuthorizationQuery();
  const navigate = useNavigate();

  const [signOut] = useSignOutMutation();

  useEffect(() => {
    if (data?.user?.isBanned) void navigate("/banned", { replace: true });
    else void navigate("/", { replace: true });
  }, [data?.user, navigate]);

  const handleLogout = () => {
    signOut()
      .unwrap()
      .then(() => {
        void navigate("/auth/signin", { replace: true });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const formattedBanUntil = data?.user?.banUntil
    ? new Date(data.user.banUntil).toLocaleString(i18n.resolvedLanguage)
    : t("pages.auth.banned.unknown_period");

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
};
