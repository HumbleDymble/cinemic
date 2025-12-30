import { createTheme, type PaletteMode } from "@mui/material/styles";

const lightPalette = {
  primary: {
    main: "#0A84FF",
    light: "#64B5F6",
    dark: "#005CB2",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#8A8A8E",
    light: "#E5E5EA",
    dark: "#636366",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F9F9F9",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1D1D1F",
    secondary: "#6E6E73",
  },
  grey: {
    100: "#F5F5F7",
    200: "#E5E5EA",
    300: "#D1D1D6",
    400: "#C7C7CC",
  },
};

const darkPalette = {
  primary: {
    main: "#0A84FF",
    light: "#64B5F6",
    dark: "#005CB2",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#98989D",
    light: "#3A3A3C",
    dark: "#8E8E93",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#282828",
    paper: "#282828",
  },
  text: {
    primary: "#F5F5F7",
    secondary: "#86868B",
  },
  grey: {
    100: "#1C1C1E",
    200: "#2C2C2E",
    300: "#3A3A3C",
    400: "#48484A",
  },
};

export const AppTheme = (mode: PaletteMode) => {
  const isLight = mode === "light";
  const palette = isLight ? lightPalette : darkPalette;

  return createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: "2.8rem", fontWeight: 700, color: palette.text.primary },
      h2: { fontSize: "2.2rem", fontWeight: 700, color: palette.text.primary },
      h3: { fontSize: "1.8rem", fontWeight: 600, color: palette.text.primary },
      h4: { fontSize: "1.5rem", fontWeight: 600, color: palette.text.primary },
      body1: { fontSize: "1rem", fontWeight: 400, color: palette.text.primary },
      body2: { fontSize: "0.875rem", fontWeight: 400, color: palette.text.secondary },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          "*": { padding: 0, margin: 0, border: 0 },
          ":focus, :active": { outline: "none" },
          "html, body": { height: "100%", width: "100%" },
          body: {
            minHeight: "100svh",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            WebkitOverflowScrolling: "touch",
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
          "#root": { minHeight: "100%", display: "flex", flexDirection: "column" },
          "input, button, textarea": { fontFamily: "inherit" },
          button: { cursor: "pointer" },
          "a, a:visited, a:hover": { textDecoration: "none", color: "inherit" },
          "h1, h2, h3, h4, h5, h6": { fontSize: "inherit", fontWeight: "inherit" },
          "::selection": { background: theme.palette.primary.light, color: "#fff" },
          "img, video": { maxWidth: "100%", height: "auto" },
          ".pageRoot": {
            position: "relative",
            flexGrow: 1,
            overflow: "hidden",
            paddingBlock: theme.spacing(2),
            [theme.breakpoints.up("md")]: { paddingBlock: theme.spacing(4) },
            background: isLight
              ? "radial-gradient(1200px 800px at 0% 0%, rgba(10,132,255,0.10), transparent 80%), linear-gradient(180deg,#F9F9F9 0%,#EEF2F7 100%)"
              : "radial-gradient(1200px 800px at 0% 0%, rgba(10,132,255,0.15), transparent 80%), linear-gradient(180deg,#000000 0%,#1C1C1E 100%)",
          },
          ".pageRoot::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(28px)",
            opacity: isLight ? 0.14 : 0.08,
            transform: "scale(1.05)",
            pointerEvents: "none",
          },
        }),
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "rgba(255, 255, 255, 0.8)" : "rgba(28, 28, 30, 0.8)",
            backdropFilter: "blur(10px)",
            boxShadow: "none",
            borderBottom: isLight
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.1)",
            color: palette.text.primary,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            borderRadius: 16,
            boxShadow: isLight ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 4px 12px rgba(0, 0, 0, 0.5)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
            "&:hover": {
              boxShadow: isLight
                ? "0 8px 24px rgba(0, 0, 0, 0.12)"
                : "0 8px 24px rgba(0, 0, 0, 0.7)",
              zIndex: 1,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 20,
            padding: "8px 24px",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "0.750rem",
            borderRadius: 8,
            backgroundColor: isLight ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
            color: isLight ? "#fff" : "#000",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: isLight ? "#F5F5F7" : "#2C2C2E",
              color: palette.text.primary,
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0A84FF",
              },
              "& input": {
                color: palette.text.primary,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(28, 28, 30, 0.9)",
            backdropFilter: "blur(15px)",
            borderRadius: 20,
            backgroundImage: "none",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: "#0A84FF",
          },
        },
      },
      MuiIcon: {
        styleOverrides: {
          root: {
            color: palette.text.primary,
          },
        },
      },
    },
  });
};
