"use client";

import { type ReactNode, type SyntheticEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ModeratorReviewTable } from "./ModeratorReviewTable";
import { UserListTable } from "./UserListTable";
import { Footer } from "@/client/widgets/footer";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  if (value !== index) return null;

  return (
    <Box
      role="tabpanel"
      id={`moderator-tabpanel-${index}`}
      aria-labelledby={`moderator-tab-${index}`}
      {...other}
      sx={{ p: { xs: 1, sm: 2, md: 3 } }}
    >
      {children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `moderator-tab-${index}`,
    "aria-controls": `moderator-tabpanel-${index}`,
  };
}

export const ModeratorPanel = () => {
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = useMemo(
    () => [
      {
        label: t("pages.moderator-panel.tabs.users"),
        icon: <PeopleIcon />,
        content: <UserListTable />,
      },
      {
        label: t("pages.moderator-panel.tabs.reviews"),
        icon: <RateReviewIcon />,
        content: <ModeratorReviewTable />,
      },
    ],
    [t],
  );

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
      >
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
            {t("pages.moderator-panel.title")}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t("pages.moderator-panel.subtitle")}
          </Typography>
        </Box>

        <Paper
          elevation={isMobile ? 1 : 3}
          sx={{
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label={t("pages.moderator-panel.tabs.aria")}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              indicatorColor="primary"
              textColor="primary"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 56,
                },
              }}
            >
              {tabs.map((tab, idx) => (
                <Tab
                  key={tab.label}
                  icon={tab.icon}
                  iconPosition={isMobile ? "top" : "start"}
                  label={tab.label}
                  {...a11yProps(idx)}
                />
              ))}
            </Tabs>
          </Box>

          {tabs.map((tab, idx) => (
            <TabPanel key={idx} value={value} index={idx}>
              {tab.content}
            </TabPanel>
          ))}
        </Paper>
      </Container>

      <Footer />
    </>
  );
};
