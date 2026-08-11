import { createTheme, alpha } from "@mui/material/styles";

export function generateTheme(primaryColor = "#8B5CF6", mode = "light") {
  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: alpha(primaryColor, 0.7),
        dark: alpha(primaryColor, 0.9),
        contrastText: "#FFFFFF",
      },
      background: {
        default: mode === "light" ? "#F8FAFC" : "#0F0F12",
        paper: mode === "light" ? "#FFFFFF" : "#18181C",
      },
      text: {
        primary: mode === "light" ? "#0F172A" : "#FFFFFF",
        secondary: mode === "light" ? "#64748B" : "#A1A1AA",
      },
      divider: mode === "light" ? "#E2E8F0" : "#2A2A2E",
      success: { main: "#10B981" },
      warning: { main: "#F59E0B" },
      error: { main: mode === "light" ? "#EF4444" : "#F43F5E" },
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
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
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
            "&:hover": { boxShadow: "none" },
          },
          contained: {
            boxShadow: `0 1px 3px ${alpha(primaryColor, 0.25)}`,
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
          root: { backgroundImage: "none" },
          rounded: { borderRadius: 16 },
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
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: "2px 8px",
            "&.Mui-selected": {
              backgroundColor: alpha(primaryColor, 0.12),
              color: primaryColor,
              "& .MuiListItemIcon-root": {
                color: primaryColor,
              },
            },
          },
        },
      },
    },
  });
}