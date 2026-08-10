import { useEffect, useState } from "react";
import { IconButton, Stack, Typography, Box, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/axios";
import CommonList from "../components/CommonList";
import ItemForm from "../components/ItemForm";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";
import usePullToRefresh from "../hooks/usePullToRefresh";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();
  const { currentTenant } = useAuth();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchItems();
  }, [currentTenant?.id, fetchItems]);

  const { pulling, refreshing } = usePullToRefresh(fetchItems, {
    enabled: true, // or only on mobile
  });

  const handleAdd = () => {
    setFormMode("create");
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    try {
      await api.delete(`/items/${item.id}`);
      showToast("Item deleted", "success");
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleFormSubmit = async (payload) => {
    setSaving(true);
    try {
      if (formMode === "create") {
        await api.post("/items", payload);
        showToast("Item added", "success");
      } else {
        await api.patch(`/items/${selectedItem.id}`, payload);
        showToast("Item updated", "success");
      }
      setFormOpen(false);
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      id: "title",
      label: "Title",
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.title}
        </Typography>
      ),
    },
    {
      id: "createdAt",
      label: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => handleEdit(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      {(pulling || refreshing) && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <CircularProgress size={22} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {refreshing ? "Refreshing..." : "Release to refresh"}
          </Typography>
        </Box>
      )}

      <CommonList
        title="Items"
        addButtonLabel="+ Add Item"
        onAdd={handleAdd}
        columns={columns}
        rows={items}
        loading={loading && !refreshing}
        emptyTitle="No items yet"
        emptyMessage="Add your first item to get started."
        getRowId={(row) => row.id}
      />

      <ItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialData={selectedItem || {}}
        loading={saving}
      />
    </>
  );
}