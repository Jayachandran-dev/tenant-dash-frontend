import { Box, Typography, Paper, Stack, TextField, Button, Divider } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

/**
 * Appearance settings — theme color + default theme mode.
 * Each subsection's controls are explicitly centered (width: 100% + flex
 * justifyContent: center on a plain Box, not relying on Stack's system
 * props) so centering is guaranteed regardless of parent layout, with a
 * divider separating the two subsections.
 *
 * Props:
 *  - themeColor, themeMode: current values
 *  - editing: whether inputs are enabled
 *  - onColorChange(e): change handler for the color field
 *  - onModeChange(mode): called with "light" | "dark"
 */
export default function AppearanceSection({
  themeColor,
  themeMode,
  editing = false,
  onColorChange,
  onModeChange,
}) {
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" textAlign="center" gutterBottom>
            Business Theme Color
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mb={2}
          >
            Primary accent color used across this business's dashboard
          </Typography>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              pt: 2
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: themeColor,
                border: "2px solid",
                borderColor: "divider",
                cursor: editing ? "pointer" : "default",
                flexShrink: 0,
              }}
            />
            <TextField
              type="color"
              value={themeColor}
              onChange={onColorChange}
              disabled={!editing}
              sx={{
                width: 80,
                "& input": {
                  cursor: editing ? "pointer" : "default",
                  height: 40,
                  padding: 0.5,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {themeColor}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" color="text.secondary" textAlign="center" gutterBottom>
            Default Theme Mode
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mb={2}
          >
            Initial color scheme when users open this business
          </Typography>

          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", gap: 1, pt: 2 }}>
            <Button
              variant={themeMode === "light" ? "contained" : "outlined"}
              onClick={() => onModeChange("light")}
              disabled={!editing}
              size="small"
              startIcon={<LightModeOutlinedIcon fontSize="small" />}
              sx={{ borderRadius: 1, minWidth: 110 }}
            >
              Light
            </Button>
            <Button
              variant={themeMode === "dark" ? "contained" : "outlined"}
              onClick={() => onModeChange("dark")}
              disabled={!editing}
              size="small"
              startIcon={<DarkModeOutlinedIcon fontSize="small" />}
              sx={{ borderRadius: 1, minWidth: 110 }}
            >
              Dark
            </Button>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}