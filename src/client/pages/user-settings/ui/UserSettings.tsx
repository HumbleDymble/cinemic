"use client";

import { type SyntheticEvent, useState } from "react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { UserInfo } from "./UserInfo";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { Navbar } from "@/client/widgets/navbar";
import { Footer } from "@/client/widgets/footer";

export const UserSettings = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number): void => {
    setTab(newValue);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
        <Button
          component={NextLink}
          href="/"
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            px: 1.8,
            "&:hover": { backgroundColor: "action.hover", borderColor: "primary.main" },
          }}
        >
          {t("pages.user-settings.settings.back_home")}
        </Button>

        <Typography align="center" variant="h5" gutterBottom>
          {t("pages.user-settings.settings.title")}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            aria-label={t("pages.user-settings.settings.aria_tabs")}
          >
            <Tab icon={<PersonIcon />} label={t("pages.user-settings.settings.tabs.user_info")} />
            <Tab
              icon={<LockOutlinedIcon />}
              label={t("pages.user-settings.settings.tabs.change_password")}
            />
          </Tabs>
        </Box>

        {tab === 0 && <UserInfo />}
        {tab === 1 && <ChangePasswordForm />}
      </Box>
      <Footer />
    </>
  );
};
