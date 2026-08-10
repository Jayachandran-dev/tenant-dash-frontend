import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "./PageHeader";
import ListSkeleton from "./ListSkeleton";
import EmptyState from "./EmptyState";

/**
 * Reusable responsive List component
 * - Desktop: Table
 * - Mobile: Card list
 * - Header uses the shared PageHeader (same sticky offset + right-aligned
 *   actions as every other page — Business Profile, etc.)
 */
export default function CommonList({
  title,
  addButtonLabel = "Add",
  onAdd,
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = "No data found",
  emptyTitle = "Nothing here yet",
  getRowId = (row) => row.id,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
        <Box>
          {/* keep sticky header if you want title visible while loading */}
          <Box
            sx={{
              position: "sticky",
              top: { xs: 56, sm: 64 },
              zIndex: 10,
              bgcolor: "background.default",
              pb: 2,
              pt: 1,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                {title}
              </Typography>
              {onAdd && (
                <Button variant="contained" onClick={onAdd} disabled>
                  {addButtonLabel}
                </Button>
              )}
            </Stack>
          </Box>
          <ListSkeleton rows={6} />
        </Box>
      );
  }

  const headerActions = onAdd && (
    <Button
      variant="contained"
      onClick={onAdd}
      startIcon={<AddIcon />}
      sx={{ borderRadius: 1 }}
    >
      {addButtonLabel}
    </Button>
  );

  const EmptyState = (
    <Box sx={{ py: 6, textAlign: "center" }}>
      <InboxOutlinedIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
      <Typography color="text.secondary">{emptyMessage}</Typography>
    </Box>
  );

  return (
    <Box>
      <PageHeader title={title} actions={headerActions} />

      {/* ========== MOBILE VIEW (Cards) ========== */}
      {isMobile ? (
        rows.length === 0 ? (
        <EmptyState
            title={emptyTitle || "No data yet"}
            description={emptyMessage}
            actionLabel={onAdd ? addButtonLabel : undefined}
            onAction={onAdd}
          />
        ) : (
          <Stack spacing={1.5}>
            {rows.map((row) => (
              <Card key={getRowId(row)} variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  {columns.map((col, index) => (
                    <Box key={col.id} sx={{ mb: index === columns.length - 1 ? 0 : 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {col.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={index === 0 ? 600 : 400}>
                        {col.render ? col.render(row) : row[col.id]}
                      </Typography>
                      {index < columns.length - 1 && (
                        <Divider sx={{ mt: 1 }} />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      ) : (
        /* ========== DESKTOP VIEW (Table) ========== */
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ fontWeight: 600 }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ border: 0 }}>
                    {EmptyState}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={getRowId(row)} hover>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        {col.render ? col.render(row) : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}