import { Box, Paper } from "@mui/material";

/**
 * Shared shell for auth screens (Login, Signup, Select Business) —
 * a centered card on a full-height background. Theme-safe (uses
 * background.default instead of a hardcoded hex) and responsive
 * (the card shrinks to fit narrow phones instead of a fixed pixel width).
 *
 * Props:
 *  - maxWidth: card's max width on larger screens (default 420)
 */
export default function AuthLayout({ children, maxWidth = 420 }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}