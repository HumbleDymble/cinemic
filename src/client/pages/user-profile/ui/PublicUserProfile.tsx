import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import StarIcon from "@mui/icons-material/Star";
import ReviewIcon from "@mui/icons-material/RateReview";
import LockIcon from "@mui/icons-material/Lock";
import { FriendshipActionButton } from "./FriendshipActionButton";
import { ProfileSkeleton, RatingsTab, ReviewsTab, WatchlistTab } from "./UserProfileTabs";
import { useGetPublicProfileQuery } from "../api/endpoints";
import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";
import type { UserId } from "@/entities/user";
import { useAppSelector } from "@/shared/config";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) return null;

  return (
    <Box
      role="tabpanel"
      id={`public-profile-tabpanel-${index}`}
      aria-labelledby={`public-profile-tab-${index}`}
      sx={{
        animation: "fadeIn 0.25s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {children}
    </Box>
  );
};

export const PrivateProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 4, md: 8 },
        mb: { xs: 4, md: 8 },
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          width: "100%",
          textAlign: "center",
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          boxShadow: theme.shadows[1],
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: { xs: 2, md: 3 },
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: "warning.main",
            mb: { xs: 2, md: 3 },
          }}
        >
          <LockIcon sx={{ fontSize: { xs: 40, md: 48 } }} />
        </Box>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={800}
          gutterBottom
          color="text.primary"
        >
          {t("pages.user-profile.publicProfile.private.title")}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: { xs: 3, md: 4 }, lineHeight: 1.6 }}
        >
          {t("pages.user-profile.publicProfile.private.description")}
        </Typography>

        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 20, width: { xs: "100%", sm: "auto" } }}
          >
            {t("pages.user-profile.publicProfile.private.backHome")}
          </Button>
        </Link>
      </Paper>
    </Container>
  );
};

export const PublicUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [tabValue, setTabValue] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?._id === userId) {
      void navigate("/user/profile", { replace: true });
    }
  }, [user, userId, navigate]);

  const skipPublic = !userId || user?._id === userId;

  const { data, isLoading, isError } = useGetPublicProfileQuery(userId as UserId, {
    skip: skipPublic,
  });

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const tabs = useMemo(
    () => [
      { label: t("pages.user-profile.profile.tabs.ratings"), icon: <StarIcon /> },
      { label: t("pages.user-profile.profile.tabs.watchlist"), icon: <BookmarkBorder /> },
      { label: t("pages.user-profile.profile.tabs.reviews"), icon: <ReviewIcon /> },
    ],
    [t],
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <ProfileSkeleton />
        <Footer />
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Navbar />
        <PrivateProfile />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          minHeight: "60vh",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: theme.palette.primary.contrastText,
            p: { xs: 2, sm: 3, md: 5 },
            borderRadius: 3,
            mb: { xs: 2, md: 3 },
            position: "relative",
            overflow: "hidden",
            boxShadow: theme.shadows[8],
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            alignItems="center"
            position="relative"
            zIndex={1}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Avatar
              sx={{
                width: { xs: 80, sm: 90, md: 100 },
                height: { xs: 80, sm: 90, md: 100 },
                fontSize: { xs: "2.25rem", md: "3rem" },
                bgcolor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              }}
            >
              {data.username.charAt(0).toUpperCase()}
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                fontWeight={800}
                sx={{ mb: 0.5, letterSpacing: -0.5, wordBreak: "break-word" }}
              >
                {data.username}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  label={t("pages.user-profile.publicProfile.role.user")}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "inherit",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ mt: { xs: 1, md: 0 }, width: { xs: "100%", md: "auto" } }}>
              <FriendshipActionButton status={data.friendshipStatus} userId={userId as UserId} />
            </Box>
          </Stack>
        </Box>

        <Paper
          sx={{
            p: { xs: 1.5, md: 3 },
            minHeight: 500,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1],
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            aria-label={t("pages.user-profile.profile.tabs.aria")}
            sx={{
              mb: { xs: 1.5, md: 3 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                backgroundColor: "primary.main",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                minHeight: 56,
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
                "&:hover": {
                  color: "primary.light",
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              },
            }}
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={tab.label}
                id={`public-profile-tab-${idx}`}
                aria-controls={`public-profile-tabpanel-${idx}`}
                icon={tab.icon}
                label={tab.label}
                iconPosition={isMobile ? "top" : "start"}
              />
            ))}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <RatingsTab ratings={data.ratings} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <WatchlistTab items={data.watchlist?.watchlist} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ReviewsTab reviews={data.reviews} />
          </TabPanel>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};
