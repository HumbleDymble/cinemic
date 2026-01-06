"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { alpha, styled, useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { RecentViewed } from "./RecentViewed";
import { PopularNow } from "./PopularNow";
import { Best50Titles } from "./Best50Titles";
import { Navbar } from "@/client/widgets/navbar";
import { Footer } from "@/client/widgets/footer";
import { useAppSelector } from "@/client/shared/config";

const brandColors = {
  primary: "#6366f1",
  secondary: "#ec4899",
  accent: "#fbbf24",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const AppContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  position: "relative",
  transition: "background-color 0.3s ease",
}));

const StyledNavbar = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "fixed",
  width: "100%",
  top: 0,
  zIndex: 1100,
  backdropFilter: "blur(12px)",
  transition: "background-color 0.3s ease, border-color 0.3s ease",
}));

const NavbarOffset = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: "relative",
  display: "inline-block",
  color: theme.palette.text.primary,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: "50px",
    height: "4px",
    borderRadius: "2px",
    background: brandColors.gradient,
  },
}));

export const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      <AppContainer>
        <StyledNavbar>
          <Navbar />
        </StyledNavbar>
        <NavbarOffset />
        <PopularNow />
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <Best50Titles />
          </Box>
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                flexWrap: "wrap",
                mb: { xs: 2.5, md: 4 },
              }}
            >
              <SectionTitle
                variant="h4"
                sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" } }}
              >
                {t("pages.home.recentlyViewed")}
              </SectionTitle>
              <Chip
                icon={<AccessTimeIcon />}
                color={theme.palette.mode === "light" ? "default" : "secondary"}
                label={t("pages.home.history")}
                clickable
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
                variant="outlined"
              />
            </Box>
            <RecentViewed />
          </Box>
          {!user?.username && (
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 8 },
                borderRadius: { xs: 4, md: 6 },
                background:
                  "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=2000&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                color: "white",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${alpha(brandColors.primary, 0.9)} 0%, ${alpha(
                    "#764ba2",
                    0.9,
                  )} 100%)`,
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Typography
                  component="h2"
                  variant="h3"
                  fontWeight={800}
                  gutterBottom
                  sx={{ mb: 2, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
                >
                  {t("pages.home.cta.title")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 3, md: 5 },
                    opacity: 0.9,
                    maxWidth: 600,
                    mx: "auto",
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  {t("pages.home.cta.subtitle")}
                </Typography>
                <Button
                  component={NextLink}
                  href="/auth/signup"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: brandColors.primary,
                    fontWeight: 700,
                    px: { xs: 3.5, sm: 5 },
                    py: { xs: 1.25, sm: 2 },
                    borderRadius: 50,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      backgroundColor: alpha("#fff", 0.9),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {t("pages.home.cta.joinNow")}
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </AppContainer>
      <Footer />
    </>
  );
};
