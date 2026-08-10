import { Box, CircularProgress } from "@mui/material";

/**
 * Full-page loading state — used while auth/session state is being
 * resolved (App.jsx, ProtectedRoute.jsx). Theme-aware background instead
 * of a bare unstyled <div>, so it doesn't flash unstyled text in dark mode.
 */
export default function PageLoader() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
    <CircularProgress />
    </Box>
  );
}