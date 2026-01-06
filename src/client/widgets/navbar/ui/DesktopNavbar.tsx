"use client";

import { memo, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { keyframes, styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HomeIcon from "@mui/icons-material/Home";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import QuizIcon from "@mui/icons-material/Quiz";
import { NotificationPopoverDisplay } from "./NotificationPopoverDisplay";
import { SearchBar } from "@/client/features/search-bar";
import type { User } from "@/client/entities/user";

const diceRoll = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(15deg) scale(1.1); }
  50% { transform: rotate(-15deg) scale(1.1); }
  75% { transform: rotate(10deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
`;
const questionJump = keyframes`
  0% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-4px) scale(1.1); }
  50% { transform: translateY(0) scale(1.1); }
  70% { transform: translateY(-2px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
`;
const pulseGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 0px transparent); }
  50% { filter: drop-shadow(0 0 3px currentColor); }
`;

const AnimatedCasinoIcon = styled(CasinoOutlinedIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  transition: "all 0.3s ease",
  ".MuiMenuItem-root:hover &": {
    color: theme.palette.primary.main,
    animation: `${diceRoll} 0.6s ease-in-out, ${pulseGlow} 1s ease-in-out infinite`,
  },
}));

const AnimatedQuizIcon = styled(QuizIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  transition: "all 0.3s ease",
  ".MuiMenuItem-root:hover &": {
    color: theme.palette.secondary.main,
    animation: `${questionJump} 0.6s ease-in-out, ${pulseGlow} 1s ease-in-out infinite`,
  },
}));

interface Props {
  user: User | null;
  token: string | null;
  userInitial: string | undefined;
  anchorEl: HTMLElement | null;
  openUserMenu: boolean;
  onAvatarClick: (e: MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onSignOut: () => void;
}

export const DesktopNavbar = memo(
  ({
    user,
    token,
    userInitial,
    anchorEl,
    openUserMenu,
    onAvatarClick,
    onMenuClose,
    onSignOut,
  }: Props) => {
    const { t } = useTranslation();

    return (
      <AppBar position="static" color="default" elevation={3} component="header">
        <Toolbar disableGutters sx={{ px: { xs: 1, sm: 0 } }}>
          <Container maxWidth="lg">
            <Box
              component="nav"
              aria-label={t("widgets.navbar.aria.primaryNavigation")}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "auto 1fr", md: "auto 1fr auto" },
                gridTemplateAreas: {
                  xs: `"home actions" "search search"`,
                  md: `"home search actions"`,
                },
                alignItems: "center",
                columnGap: 1,
                rowGap: { xs: 1, md: 0 },
                py: 1,
              }}
            >
              <Box sx={{ gridArea: "home", display: "flex", alignItems: "center" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  component={NextLink}
                  href="/"
                  aria-label={t("widgets.navbar.aria.home")}
                  sx={{ mr: 0.5 }}
                >
                  <HomeIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  gridArea: "search",
                  width: "100%",
                  minWidth: 0,
                  px: { xs: 0, md: 1 },
                }}
              >
                <SearchBar />
              </Box>

              <Box
                sx={{
                  gridArea: "actions",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1,
                  minWidth: 0,
                  flexWrap: "wrap",
                }}
              >
                {["admin", "moderator"].includes(user?.role ?? "user") && (
                  <Button
                    component={NextLink}
                    href={user?.role === "admin" ? "/admin/users" : "/moderator/users"}
                    size="small"
                    variant="outlined"
                    sx={{
                      display: { xs: "none", sm: "inline-flex" },
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 1.8,
                      "&:hover": {
                        backgroundColor: "action.hover",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    {user?.role === "admin"
                      ? t("widgets.navbar.admin")
                      : t("widgets.navbar.moderator")}
                  </Button>
                )}

                {user && <NotificationPopoverDisplay token={token} />}

                <Button
                  component={NextLink}
                  href="/user/watchlist"
                  startIcon={<BookmarkBorderIcon />}
                  sx={{
                    whiteSpace: "nowrap",
                    minWidth: { xs: 40, sm: "auto" },
                    px: { xs: 1, sm: 2 },
                    "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {t("widgets.navbar.watchlist")}
                  </Box>
                </Button>

                {userInitial ? (
                  <>
                    <Tooltip
                      title={t("widgets.navbar.loggedInAs", {
                        username: user?.username ?? "",
                      })}
                    >
                      <IconButton
                        size="small"
                        onClick={onAvatarClick}
                        aria-label={t("widgets.navbar.aria.userMenu")}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>{userInitial}</Avatar>
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={anchorEl}
                      open={openUserMenu}
                      onClose={onMenuClose}
                      slotProps={{ list: { "aria-label": t("widgets.navbar.aria.userMenu") } }}
                    >
                      <MenuItem component={NextLink} href="/auth/settings" onClick={onMenuClose}>
                        <PersonIcon sx={{ mr: 1 }} /> {t("widgets.navbar.settings")}
                      </MenuItem>

                      <MenuItem component={NextLink} href="/user/profile" onClick={onMenuClose}>
                        <PersonIcon sx={{ mr: 1 }} /> {t("widgets.navbar.userProfile")}
                      </MenuItem>

                      <MenuItem
                        component={NextLink}
                        href="/user/random-title"
                        onClick={onMenuClose}
                      >
                        <AnimatedCasinoIcon />
                        {t("widgets.navbar.randomTitle")}
                      </MenuItem>

                      <MenuItem component={NextLink} href="/title/guess" onClick={onMenuClose}>
                        <AnimatedQuizIcon />
                        {t("widgets.navbar.titleGuesser")}
                      </MenuItem>

                      <Divider />

                      <MenuItem onClick={onSignOut}>
                        <LogoutIcon sx={{ mr: 1 }} /> {t("widgets.navbar.logout")}
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button component={NextLink} href="/auth/signin" variant="outlined" size="small">
                    {t("widgets.navbar.signIn")}
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    );
  },
);

DesktopNavbar.displayName = "DesktopNavbar";
