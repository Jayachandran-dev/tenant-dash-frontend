import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Alert,
  Button,
} from "@mui/material";
import api from "../api/axios";
import CommonList from "../components/CommonList";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

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

  const handleAddUser = async () => {
    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const fullMobile = `${countryCode}${mobile}`;
      await api.post("/users", { mobile: fullMobile, role });
      setOpen(false);
      setMobile("");
      setRole("employee");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setAdding(false);
    }
  };

  // Column configuration
  const columns = [
    {
      id: "mobile",
      label: "Mobile",
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
        onAdd={() => setOpen(true)}
        columns={columns}
        rows={users}
        loading={loading}
        emptyMessage="No users found"
        getRowId={(row) => row.membershipId}
      />

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              select
              label="Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              sx={{ width: 140 }}
            >
              {countryCodes.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 10 }}
            />
          </Stack>

          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser} disabled={adding}>
            {adding ? "Adding..." : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}