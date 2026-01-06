"use client";

import { useEffect } from "react";
import { setTheme } from "@/client/features/theme-switcher";
import { useAppDispatch, useAppSelector } from "@/client/shared/config";

export function ThemeHydrator() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    const saved = window.localStorage.getItem("app_theme");
    if (saved === "light" || saved === "dark") dispatch(setTheme(saved));
  }, [dispatch]);

  useEffect(() => {
    window.localStorage.setItem("app_theme", mode);
  }, [mode]);

  return null;
}
