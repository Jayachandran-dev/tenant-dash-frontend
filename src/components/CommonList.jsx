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

/**
 * Reusable responsive List component
 * - Desktop: Table
 * - Mobile: Card list
 * - Sticky header (Title + Add button)
 */
export default function CommonList({
  title,
  addButtonLabel = "+ Add",
  onAdd,
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = "No data found",
  getRowId = (row) => row.id,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ========== STICKY HEADER ========== */}
      <Box
        sx={{
          position: "sticky",
          top: 57, // height of AppBar (adjust if needed)
          zIndex: 10,
          bgcolor: "background.default",
          pb: 2,
          pt: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography variant="h5" fontWeight={600}>
            {title}
          </Typography>

          {onAdd && (
            <Button variant="contained" onClick={onAdd} sx={{ ml: "auto", borderRadius: 0.5 }}>
              {addButtonLabel}
            </Button>
          )}
        </Stack>
      </Box>

      {/* ========== MOBILE VIEW (Cards) ========== */}
      {isMobile ? (
        <Stack spacing={1.5}>
          {rows.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </Paper>
          ) : (
            rows.map((row) => (
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
            ))
          )}
        </Stack>
      ) : (
        /* ========== DESKTOP VIEW (Table) ========== */
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
                  <TableCell colSpan={columns.length} align="center">
                    {emptyMessage}
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