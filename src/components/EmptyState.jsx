import { Box, Typography, Button, Paper, Avatar, alpha, useTheme } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  actionLabel,
  onAction,
  icon,
}) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 1,
        borderStyle: "dashed",
      }}
    >
      <Avatar
        sx={{
          width: 56,
          height: 56,
          mx: "auto",
          mb: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.12),
          color: "primary.main",
        }}
      >
        {icon || <InboxIcon />}
      </Avatar>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ borderRadius: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
}