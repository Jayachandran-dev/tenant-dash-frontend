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
} from "@mui/material";

/**
 * Reusable List / Table component
 *
 * Props:
 * - title: string
 * - addButtonLabel: string (optional)
 * - onAdd: function (optional)
 * - columns: Array<{ id: string, label: string, render?: (row) => ReactNode }>
 * - rows: Array<object>
 * - loading: boolean
 * - emptyMessage: string
 * - getRowId: function (row) => string | number
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
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>

        {onAdd && (
          <Button variant="contained" onClick={onAdd}>
            {addButtonLabel}
          </Button>
        )}
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
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
    </Box>
  );
}





// To use the CommonList
// const columns = [
//   { id: "title", label: "Item Name" },
//   { 
//     id: "createdAt", 
//     label: "Created", 
//     render: (row) => new Date(row.createdAt).toLocaleDateString() 
//   },
// ];

// <CommonList
//   title="Items"
//   addButtonLabel="+ Add Item"
//   onAdd={() => setOpen(true)}
//   columns={columns}
//   rows={items}
//   loading={loading}
// />