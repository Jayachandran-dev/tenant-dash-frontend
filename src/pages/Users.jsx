import { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  Stack,
  Typography,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/axios";
import CommonList from "../components/CommonList";
import UserForm from "../components/UserForm";
import ConfirmDialog from "../components/ConfirmDialog";
import UserListCard from "../components/UserListCard";
import usePermission from "../hooks/usePermission";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const ROLE_COLORS = {
  owner: "primary",
  employee: "default",
};

export default function Users() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const { canAddUser, isOwner } = usePermission();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddClick = () => {
    setFormMode("create");
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setSaving(true);
    try {
      if (formMode === "create") {
        await api.post("/users", payload);
        showToast("User added successfully", "success");
      }
      setFormOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveClick = (row) => {
    setUserToRemove(row);
    setDeleteOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!userToRemove) return;

    setRemoving(true);
    try {
      await api.delete(`/users/${userToRemove.membershipId}`);
      showToast("Member removed", "success");
      setDeleteOpen(false);
      setUserToRemove(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove member", "error");
    } finally {
      setRemoving(false);
    }
  };

  const handleInvite = async () => {
    try {
      const res = await api.post("/invites", { role: "employee" });
      const link = `${window.location.origin}/invite/${res.data.token}`;
      await navigator.clipboard.writeText(link);
      showToast("Invite link copied to clipboard", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create invite", "error");
    }
  };

  const columns = [
    {
      id: "user",
      label: "User",
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={row.avatar || undefined}
            sx={{
              width: 36,
              height: 36,
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: "primary.main",
              fontWeight: 500,
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <div>
            <Typography variant="body2" fontWeight={500}>
              {row.name || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.mobile}
            </Typography>
          </div>
        </Stack>
      ),
    },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <Chip
          label={
            row.role
              ? row.role.charAt(0).toUpperCase() + row.role.slice(1)
              : "—"
          }
          size="small"
          color={ROLE_COLORS[row.role] || "default"}
          variant={row.role === "owner" ? "filled" : "outlined"}
          sx={{ borderRadius: 1, fontWeight: 500 }}
        />
      ),
    },
    {
      id: "joinedAt",
      label: "Joined At",
      render: (row) => new Date(row.joinedAt).toLocaleDateString(),
    },
    ...(isOwner
      ? [
          {
            id: "actions",
            label: "Actions",
            render: (row) => {
              const isSelf = row.id === currentUser?.id;
              if (isSelf) return null;

              return (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveClick(row)}
                  aria-label="Remove member"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <>

      <CommonList
        title="Users"
        addButtonLabel="Add User"
        onAdd={canAddUser ? handleAddClick : undefined}
        actions={
          canAddUser ? (
            <Button variant="outlined" onClick={handleInvite}>
              Invite
            </Button>
          ) : null
        }
        columns={columns}
        rows={users}
        loading={loading}
        emptyMessage="No users found"
        getRowId={(row) => row.membershipId}
        renderCard={(row) => (
          <UserListCard
            user={row}
            isSelf={row.id === currentUser?.id}
            onRemove={isOwner ? handleRemoveClick : undefined}
          />
        )}
      />

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialData={selectedUser || {}}
        loading={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          if (!removing) {
            setDeleteOpen(false);
            setUserToRemove(null);
          }
        }}
        onConfirm={handleRemoveConfirm}
        title="Remove member?"
        message={
          userToRemove
            ? `Remove ${userToRemove.name || userToRemove.mobile} from this business? They will lose access until added again.`
            : "Are you sure?"
        }
        confirmLabel="Remove"
        loading={removing}
      />
    </>
  );
}