"use client";

import { type MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { signIn, useHandleAuthorizationQuery, useSignOutMutation } from "@/client/entities/user";
import { useAppDispatch, useAppSelector } from "@/client/shared/config";
import { useToggle } from "@/client/shared/lib/hooks";

export const useNavbar = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  const { data } = useHandleAuthorizationQuery();
  const [logout] = useSignOutMutation();

  useEffect(() => {
    if (data) {
      dispatch(signIn(data));
    }
  }, [dispatch, data]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openUserMenu = Boolean(anchorEl);

  const [drawerOpen, toggleDrawerOpen] = useToggle(false);

  const closeDrawer = useCallback(() => {
    toggleDrawerOpen(false);
  }, [toggleDrawerOpen]);

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
    } finally {
      setAnchorEl(null);
      toggleDrawerOpen(false);
    }
  };

  const handleAvatarClick = useCallback((e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const userInitial = useMemo(() => {
    return data?.user?.username?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase();
  }, [data?.user?.username, user?.username]);

  return {
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
  };
};
