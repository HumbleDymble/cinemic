"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopNavbar } from "./DesktopNavbar";
import { useNavbar } from "../model/useNavbar";

export const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    drawerOpen,
    toggleDrawerOpen,
    user,
    handleSignOut,
    handleAvatarClick,
    handleMenuClose,
    token,
    userInitial,
    anchorEl,
    openUserMenu,
    closeDrawer,
  } = useNavbar();

  return isMobile ? (
    <MobileNavbar
      drawerOpen={drawerOpen}
      toggleDrawer={toggleDrawerOpen}
      onClose={closeDrawer}
      user={user}
      token={token}
      onSignOut={handleSignOut}
    />
  ) : (
    <DesktopNavbar
      user={user}
      token={token}
      userInitial={userInitial}
      anchorEl={anchorEl}
      openUserMenu={openUserMenu}
      onAvatarClick={handleAvatarClick}
      onMenuClose={handleMenuClose}
      onSignOut={handleSignOut}
    />
  );
};
