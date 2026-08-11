import { Card, CardContent, Box, Typography, Stack, Avatar, Chip, IconButton, alpha, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ROLE_COLORS = {
  owner: "primary",
  employee: "default",
};

/**
 * Mobile list card for a single User row.
 * Purpose-built layout — avatar/name/phone as the header, role + joined
 * date + remove action grouped in a footer row — instead of the generic
 * label/value stack CommonList falls back to when no custom card is
 * supplied.
 */
export default function UserListCard({ user, isSelf, onRemove }) {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ borderRadius: 1 }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={user.avatar || undefined}
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: "primary.main",
              fontWeight: 500,
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {user.name || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.mobile}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={
                user.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "—"
              }
              size="small"
              color={ROLE_COLORS[user.role] || "default"}
              variant={user.role === "owner" ? "filled" : "outlined"}
              sx={{ borderRadius: 1, fontWeight: 500 }}
            />
            <Typography variant="caption" color="text.secondary">
              Joined {new Date(user.joinedAt).toLocaleDateString()}
            </Typography>
          </Stack>

          {onRemove && !isSelf && (
            <IconButton
              size="small"
              color="error"
              onClick={() => onRemove(user)}
              aria-label="Remove member"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}