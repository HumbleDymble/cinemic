import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useSignIn } from "../model/useSignIn";
import { Footer } from "@/widgets/footer";

export const SignIn = () => {
  const { t } = useTranslation();
  const { isMobile, changeHandler, handleSubmit } = useSignIn();

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
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: isMobile ? 2 : 4,
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
            component={RouterLink}
            to="/"
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
          <Typography variant="h3" color="text.primary">
            {t("pages.auth.signin.title")}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ my: 2, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("pages.auth.common.email_label")}
              name="email"
              autoComplete="email"
              onChange={changeHandler}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("pages.auth.common.password_label")}
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={changeHandler}
            />
            <Link
              component={RouterLink}
              to="#"
              underline="hover"
              color="primary"
              sx={{
                mt: 1,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <LockResetIcon sx={{ fontSize: 18 }} />
              {t("pages.auth.signin.forgot_password")}
            </Link>
            <Button type="submit" fullWidth variant="contained" sx={{ my: 3, py: 1.5 }}>
              {t("pages.auth.signin.submit")}
            </Button>
            <Typography variant="body1" color="text.secondary">
              {t("pages.auth.signin.no_account")}{" "}
              <Link
                component={RouterLink}
                to="/auth/signup"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {t("pages.auth.signup.title")}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};
