import { type ReactNode, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppTheme } from "../styles/theme";
import { useAppSelector } from "@/shared/config";

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => AppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
