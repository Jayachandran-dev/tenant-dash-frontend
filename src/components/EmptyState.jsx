import { Box, Typography, Button, Paper } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 3,
        borderStyle: "dashed",
      }}
    >
      <Box sx={{ color: "text.secondary", mb: 1 }}>
        {icon || <InboxIcon sx={{ fontSize: 48, opacity: 0.5 }} />}
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
}