import { createTheme } from "@mui/material/styles";

const softTeal = {
  50: "#F0FDFA",
  100: "#CCFBF1",
  200: "#99F6E4",
  300: "#5EEAD4",
  400: "#2DD4BF",
  500: "#14B8A6", // main light
  600: "#0D9488", // primary
  700: "#0F766E",
  800: "#115E59",
  900: "#134E4A",
};

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: softTeal[600],
          light: softTeal[500],
          dark: softTeal[700],
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#64748B",
        },
        background: {
          default: "#F8FAFC",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
        },
        divider: "#E2E8F0",
        success: { main: "#10B981" },
        warning: { main: "#F59E0B" },
        error: { main: "#EF4444" },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: softTeal[400],
          light: softTeal[300],
          dark: softTeal[500],
          contrastText: "#0F172A",
        },
        secondary: {
          main: "#94A3B8",
        },
        background: {
          default: "#0F172A",
          paper: "#1E293B",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
        },
        divider: "#334155",
        success: { main: "#34D399" },
        warning: { main: "#FBBF24" },
        error: { main: "#F87171" },
      },
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          boxShadow: "0 1px 3px rgba(13, 148, 136, 0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid",
          borderColor: "divider",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid",
          borderColor: "divider",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundImage: "none",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: "1px solid",
          borderColor: "divider",
        },
      },
    },
  },
});

export default theme;