import { useEffect, useState } from "react";
import { Avatar, Stack, Typography, Chip, Box, CircularProgress, alpha, useTheme } from "@mui/material";
import api from "../api/axios";
import CommonList from "../components/CommonList";
import UserForm from "../components/UserForm";
import usePermission from "../hooks/usePermission";
import { useToast } from "../context/ToastContext";
import { useCallback } from "react";
import usePullToRefresh from "../hooks/usePullToRefresh";

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

  const { showToast } = useToast();

  const { canAddUser } = usePermission();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { pulling, refreshing } = usePullToRefresh(fetchUsers, {
    enabled: true, // or only on mobile
  });

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
          label={row.role ? row.role.charAt(0).toUpperCase() + row.role.slice(1) : "—"}
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
        title="Users"
        addButtonLabel="Add User"
        onAdd={canAddUser ? handleAddClick : undefined}  // ← only owner sees the button
        columns={columns}
        rows={users}
        loading={loading}
        emptyMessage="No users found"
        getRowId={(row) => row.membershipId}
      />

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialData={selectedUser || {}}
        loading={saving}
      />
    </>
  );
}