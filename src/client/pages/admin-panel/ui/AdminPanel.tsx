import { type ReactNode, type SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { AdminUserTable } from "./AdminUserTable";
import { AdminReviewTable } from "./AdminReviewTable";
import { Footer } from "@/widgets/footer";
import { signIn, useHandleAuthorizationQuery } from "@/entities/user";
import { useAppDispatch } from "@/shared/config";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    "aria-controls": `admin-tabpanel-${index}`,
  };
}

export const AdminPanel = () => {
  const { t } = useTranslation();

  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { data } = useHandleAuthorizationQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) dispatch(signIn(data));
  }, [dispatch, data]);

  return (
    <>
      <Paper elevation={3} sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label={t("pages.admin-panel.panel.aria_tabs")}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              icon={<SupervisorAccountIcon />}
              iconPosition="start"
              label={t("pages.admin-panel.panel.tab_users")}
              {...a11yProps(0)}
            />
            <Tab
              icon={<RateReviewIcon />}
              iconPosition="start"
              label={t("pages.admin-panel.panel.tab_reviews")}
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <AdminUserTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AdminReviewTable />
        </TabPanel>
      </Paper>

      <Footer />
    </>
  );
};
