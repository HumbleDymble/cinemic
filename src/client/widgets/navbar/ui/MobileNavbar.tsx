import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PersonIcon from "@mui/icons-material/Person";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import QuizIcon from "@mui/icons-material/Quiz";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import SettingsIcon from "@mui/icons-material/Settings";
import { NotificationPopoverDisplay } from "./NotificationPopoverDisplay";
import type { User } from "@/entities/user";

interface Props {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  onClose: () => void;
  user: User | null;
  token: string | null;
  onSignOut: () => void;
}

export const MobileNavbar = memo(
  ({ drawerOpen, toggleDrawer, onClose, user, token, onSignOut }: Props) => {
    const { t } = useTranslation();

    return (
      <>
        <AppBar position="static" color="default" elevation={3} component="header">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
            <IconButton
              edge="start"
              color="inherit"
              component={Link}
              to="/"
              aria-label={t("widgets.navbar.aria.home")}
            >
              <HomeIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {user && <NotificationPopoverDisplay token={token} />}

              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleDrawer}
                aria-label={t("widgets.navbar.aria.openMenu")}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={onClose}
          PaperProps={{ sx: { width: { xs: "80vw", sm: 320 }, maxWidth: 360 } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t("widgets.navbar.menu")}
            </Typography>
            {user?.username ? (
              <Typography variant="body2" color="text.secondary">
                {user.username}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("widgets.navbar.notSignedIn")}
              </Typography>
            )}
          </Box>

          <Divider />

          <List sx={{ py: 0 }}>
            <ListItemButton component={Link} to="/" onClick={onClose}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t("widgets.navbar.home")} />
            </ListItemButton>

            <ListItemButton component={Link} to="/user/watchlist" onClick={onClose}>
              <ListItemIcon>
                <BookmarkBorderIcon />
              </ListItemIcon>
              <ListItemText primary={t("widgets.navbar.watchlist")} />
            </ListItemButton>

            <Divider />

            {user ? (
              <>
                <ListItemButton component={Link} to="/auth/settings" onClick={onClose}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("widgets.navbar.settings")} />
                </ListItemButton>

                <ListItemButton component={Link} to="/user/profile" onClick={onClose}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("widgets.navbar.userProfile")} />
                </ListItemButton>

                <ListItemButton component={Link} to="/user/random-title" onClick={onClose}>
                  <ListItemIcon>
                    <CasinoOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("widgets.navbar.randomTitle")} />
                </ListItemButton>

                <ListItemButton component={Link} to="/title/guess" onClick={onClose}>
                  <ListItemIcon>
                    <QuizIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("widgets.navbar.titleGuesser")} />
                </ListItemButton>

                <Divider />

                <ListItemButton
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("widgets.navbar.logout")} />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton component={Link} to="/auth/signin" onClick={onClose}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary={t("widgets.navbar.signIn")} />
              </ListItemButton>
            )}
          </List>
        </Drawer>
      </>
    );
  },
);

MobileNavbar.displayName = "MobileNavbar";
