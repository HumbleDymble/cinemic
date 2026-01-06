"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { store as makeStore } from "./store/store";
import { SocketProvider } from "./store/socket-provider";
import { AppThemeProvider } from "./store/theme-provider";
import { ThemeHydrator } from "./store/theme-hydrator";
import { AppSnackbar } from "@/client/entities/alert";
import { initI18n } from "@/client/shared/i18n";
import { Loader } from "@/client/shared/ui";

export function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    let alive = true;

    initI18n()
      .then(() => {
        if (alive) setI18nReady(true);
      })
      .catch((e) => {
        console.error("i18n init failed", e);
        if (alive) setI18nReady(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (!i18nReady) return <Loader open={true} />;

  return (
    <Provider store={storeRef.current}>
      <ThemeHydrator />
      <SocketProvider>
        <AppThemeProvider>
          {children}
          <AppSnackbar />
        </AppThemeProvider>
      </SocketProvider>
    </Provider>
  );
}
