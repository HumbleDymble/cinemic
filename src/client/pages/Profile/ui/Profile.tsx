import React, { ChangeEvent, FormEvent, JSX } from "react";
import {
  Box,
  TextField,
  Typography,
  Tabs,
  Tab,
  Button,
  useMediaQuery,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { api, token } from "@/shared/api/api";

// Import icons from MUI icons-material.
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Define the types for TabPanel props.
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// A reusable TabPanel component with proper typing.
function TabPanel({
  children,
  value,
  index,
  ...other
}: TabPanelProps): JSX.Element {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Define the structure of the password state.
interface PasswordState {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export const Profile: React.FC = () => {
  const theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));

  // Manage selected tab state.
  const [tabValue, setTabValue] = React.useState<number>(0);
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    setTabValue(newValue);
  };

  // State for the password change form.
  const [password, setPassword] = React.useState<PasswordState>({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  // Fetch user authentication data; type as needed from the API.
  const { data } = api.useCheckAuthQuery(undefined, { skip: !token });
  // Mutation hook to update the user profile.
  const [pass] = api.useUserProfileMutation();
  const username: string | undefined = data?.user?.username;

  // Handle changes in the password form input fields.
  const changeHandlerPassword = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  // Handle password form submission.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await pass({
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
        repeatPassword: password.repeatPassword,
      }).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      {/* Back Link */}
      <Box sx={{ mb: 2 }}>
        <Link
          href="http://localhost:5555/"
          variant="body2"
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ArrowBackIcon sx={{ mr: 0.5 }} /> Back to Home
        </Link>
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        Profile Page
      </Typography>

      {/* Tab Header with Icons */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          aria-label="Profile tabs"
        >
          <Tab
            icon={<PersonIcon />}
            label="User Info"
            id="profile-tab-0"
            aria-controls="profile-tabpanel-0"
          />
          <Tab
            icon={<SettingsIcon />}
            label="Account Settings"
            id="profile-tab-1"
            aria-controls="profile-tabpanel-1"
          />
          <Tab
            icon={<NotificationsIcon />}
            label="Notifications"
            id="profile-tab-2"
            aria-controls="profile-tabpanel-2"
          />
        </Tabs>
      </Box>

      {/* User Info Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Typography variant="h5">{username || "User Name"}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Your personal information goes here.
          </Typography>
        </Grid>
      </TabPanel>

      {/* Account Settings Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Typography variant="h5" gutterBottom>
            Account Settings
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              autoComplete="current-password"
              onChange={changeHandlerPassword}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="current-password"
              onChange={changeHandlerPassword}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              id="repeatPassword"
              autoComplete="current-password"
              onChange={changeHandlerPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
          </Box>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Typography variant="h5" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body1">
            Notification settings and alerts will be displayed here.
          </Typography>
        </Grid>
      </TabPanel>
    </Box>
  );
};
