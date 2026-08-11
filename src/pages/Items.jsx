import { useEffect, useState } from "react";
import { IconButton, Stack, Typography, Box, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import api from "../api/axios";
import CommonList from "../components/CommonList";
import ItemForm from "../components/ItemForm";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import ItemListCard from "../components/ItemListCard";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();
  const { currentTenant } = useAuth();

  // state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  // open dialog
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  // confirm delete
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/items/${itemToDelete.id}`);
      showToast("Item deleted", "success");
      setDeleteOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
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
          <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>

      <CommonList
        title="Items"
        addButtonLabel="+ Add Item"
        onAdd={handleAdd}
        columns={columns}
        rows={items}
        loading={loading}
        emptyTitle="No items yet"
        emptyMessage="Add your first item to get started."
        emptyIcon={<Inventory2OutlinedIcon />}
        getRowId={(row) => row.id}
        renderCard={(row) => (
          <ItemListCard item={row} onEdit={handleEdit} onDelete={handleDeleteClick} />
        )}
      />

      <ItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialData={selectedItem || {}}
        loading={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setItemToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete item?"
        message={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.title}"? This cannot be undone.`
            : "Are you sure?"
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
}