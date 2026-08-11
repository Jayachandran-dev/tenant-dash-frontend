import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { generateTheme } from "./generateTheme";
import { useAuth } from "../context/AuthContext";

const ThemeContext = createContext();

export function AppThemeProvider({ children }) {
  const { currentTenant } = useAuth();

  // Priority:
  // 1. Business themeMode (if available)
  // 2. User preference stored in localStorage
  // 3. Default "light"
  const [mode, setMode] = useState("light");

  useEffect(() => {
    if (currentTenant?.themeMode) {
      setMode(currentTenant.themeMode);
    } else {
      const saved = localStorage.getItem("themeMode");
      if (saved) setMode(saved);
    }
  }, [currentTenant?.themeMode]);

  const primaryColor = currentTenant?.themeColor || "#8B5CF6";

    const theme = useMemo(() => {
      return generateTheme(primaryColor, mode);
    }, [primaryColor, mode, currentTenant?.id]); // added currentTenant.id

  const toggleMode = async () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("themeMode", next);

    // Optional: also update the business themeMode if user is owner
    // (we will handle this from Business Profile / toggle)
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, primaryColor }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);