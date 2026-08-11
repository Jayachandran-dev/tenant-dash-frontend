import { Card, CardContent, Box, Typography, Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Mobile list card for a single Item row.
 * Purpose-built layout (title + actions on one row, date below) instead of
 * the generic label/value stack CommonList falls back to when no custom
 * card is supplied.
 */
export default function ItemListCard({ item, onEdit, onDelete }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 1 }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} noWrap>
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(item.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(item)} aria-label="Edit item">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(item)}
                aria-label="Delete item"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}