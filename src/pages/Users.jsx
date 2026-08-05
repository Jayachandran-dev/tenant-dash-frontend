import { useEffect, useState } from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import api from "../api/axios";
import CommonList from "../components/CommonList";
import UserForm from "../components/UserForm";
import usePermission from "../hooks/usePermission";
import { useToast } from "../context/ToastContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const { canAddUser } = usePermission();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <Avatar src={row.avatar || undefined} sx={{ width: 36, height: 36 }}>
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
        <span style={{ textTransform: "capitalize" }}>{row.role}</span>
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
      <CommonList
        title="Users"
        addButtonLabel="+ Add User"
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