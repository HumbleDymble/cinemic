"use client";

import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { ThemeSwitcher } from "@/client/features/theme-switcher";
import { LanguageSwitcher } from "@/client/features/language-switcher";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "center", md: "center" }}
          justifyContent={{ xs: "center", md: "space-between" }}
          spacing={{ xs: 2, md: 3 }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Typography variant="body2" color="text.secondary">
            <CopyrightIcon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "text-bottom" }} />
            {new Date().getFullYear()} {t("widgets.footer.copyright")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent={{ xs: "center", md: "flex-end" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {t("widgets.footer.appearance")}
              </Typography>
              <ThemeSwitcher />
            </Stack>
            <LanguageSwitcher />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
