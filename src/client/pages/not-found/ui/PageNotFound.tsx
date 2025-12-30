import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { keyframes, useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useToggle } from "@/shared/lib/hooks";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: .6; }
  100% { transform: scale(1); opacity: 1; }
`;

export const PageNotFound = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [timerActive] = useToggle(true);

  const goBack = () => void navigate(-1);
  const goHome = () => void navigate("/", { replace: true });

  useEffect(() => {
    if (!timerActive) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          void goBack();
          return 0;
        }
        return s - 1;
      });
    }, 1_000);

    return () => clearInterval(id);
  }, [timerActive, goBack]);

  const countdownLabel = t("pages.page-not-found.seconds", { count: secondsLeft });

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        gap: 4,
      }}
    >
      <Box>
        <ErrorOutlineIcon sx={{ fontSize: 120, color: theme.palette.error.main }} aria-hidden />
        <Typography variant="h3" component="h1" gutterBottom>
          {t("pages.page-not-found.title")}
        </Typography>
        <Typography color="text.secondary">{t("pages.page-not-found.subtitle")}</Typography>
      </Box>

      {timerActive && (
        <Typography
          sx={{ animation: `${pulse} 1.6s ease-in-out infinite`, fontWeight: 500 }}
          color="text.secondary"
        >
          {t("pages.page-not-found.taking_you_back_in")}{" "}
          <Box component="span" sx={{ color: "text.primary" }}>
            {countdownLabel}
          </Box>
          …
        </Typography>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
        <Button variant="contained" startIcon={<HomeIcon />} onClick={goHome}>
          {t("pages.page-not-found.common.home")}
        </Button>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={goBack}>
          {t("pages.page-not-found.common.back")}
        </Button>
      </Stack>
    </Container>
  );
};
