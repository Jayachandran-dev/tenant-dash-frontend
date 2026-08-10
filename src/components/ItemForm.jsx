import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function ItemForm({
  open,
  onClose,
  onSubmit,
  mode = "create", // create | edit
  initialData = {},
  loading = false,
}) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(initialData.title || "");
      setError("");
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    onSubmit({ title: title.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{mode === "create" ? "Add Item" : "Edit Item"}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          label="Item Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}