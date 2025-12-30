import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import ReviewIcon from "@mui/icons-material/RateReview";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import { FriendsPanel } from "./FriendsPanel";
import { SettingsPanel } from "./SettingsPanel";
import {
  ProfileHeader,
  ProfileSkeleton,
  RatingsTab,
  ReviewsTab,
  WatchlistTab,
} from "./UserProfileTabs";
import { useGetUserProfileQuery } from "../api/endpoints";
import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`}>
      {children}
    </Box>
  );
};

export const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data, isLoading, error } = useGetUserProfileQuery();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const tabs = useMemo(
    () => [
      {
        label: t("pages.user-profile.profile.tabs.ratings"),
        icon: <StarIcon />,
        iconColor: "action" as const,
      },
      {
        label: t("pages.user-profile.profile.tabs.watchlist"),
        icon: <BookmarkBorder />,
        iconColor: "primary" as const,
      },
      {
        label: t("pages.user-profile.profile.tabs.reviews"),
        icon: <ReviewIcon />,
        iconColor: "secondary" as const,
      },
      {
        label: t("pages.user-profile.profile.tabs.friends"),
        icon: <GroupIcon />,
        iconColor: "info" as const,
      },
      {
        label: t("pages.user-profile.profile.tabs.settings"),
        icon: <SettingsIcon />,
        iconColor: "disabled" as const,
      },
    ],
    [t],
  );

  if (isLoading) return <ProfileSkeleton />;

  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 } }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {t("pages.user-profile.profile.loadError")}
        </Alert>
      </Container>
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
          px: { xs: 1, sm: 2 },
        }}
      >
        <ProfileHeader data={data} />

        <Paper
          sx={{
            p: { xs: 1.5, md: 3 },
            mb: { xs: 2, md: 3 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
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
                minHeight: isMobile ? 56 : 48,
                textTransform: "none",
                fontWeight: 600,
                fontSize: isMobile ? "0.85rem" : "0.95rem",
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
                id={`profile-tab-${idx}`}
                aria-controls={`profile-tabpanel-${idx}`}
                icon={React.cloneElement(tab.icon, { color: tab.iconColor })}
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

          <TabPanel value={tabValue} index={3}>
            <FriendsPanel profileData={data} />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <SettingsPanel currentPrivacy={data.privacy} />
          </TabPanel>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};
