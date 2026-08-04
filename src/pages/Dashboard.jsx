import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ListItemButton,
  Stack,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const { user, tenants, currentTenant, selectTenant, logout, setTenants } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch dashboard data whenever currentTenant changes
  useEffect(() => {
    if (!currentTenant) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [currentTenant]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSwitchTenant = (tenant) => {
    selectTenant(tenant);
    setSwitchOpen(false);
  };

  const handleCreateBusiness = async () => {
    if (!newBusinessName.trim()) {
      setError("Business name is required");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await api.post("/tenants", { name: newBusinessName.trim() });
      const newTenant = res.data;

      // Update tenants list in context + localStorage
      const updatedTenants = [...tenants, newTenant];
      localStorage.setItem("tenants", JSON.stringify(updatedTenants));

      // If AuthContext has setTenants, use it. Otherwise we update manually.
      if (typeof setTenants === "function") {
        setTenants(updatedTenants);
      }

      // Auto switch to the new business
      selectTenant(newTenant);
      setCreateOpen(false);
      setNewBusinessName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create business");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">
            {currentTenant?.name || data?.tenant?.name || "Dashboard"}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => setSwitchOpen(true)}>
              Switch Business
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {data?.message || `Welcome to ${currentTenant?.name}`}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Logged in as: {user?.mobile}
        </Typography>

        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Items
          </Typography>
          <List>
            {data?.items?.length > 0 ? (
              data.items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText primary={item.title} />
                </ListItem>
              ))
            ) : (
              <Typography color="text.secondary">No items found</Typography>
            )}
          </List>
        </Paper>
      </Box>

      {/* ==================== Switch Business Dialog ==================== */}
      <Dialog open={switchOpen} onClose={() => setSwitchOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Select Business</DialogTitle>
        <DialogContent>
          <List>
            {tenants.map((tenant) => (
              <ListItemButton
                key={tenant.id}
                selected={currentTenant?.id === tenant.id}
                onClick={() => handleSwitchTenant(tenant)}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary={tenant.name}
                  secondary={`Role: ${tenant.role}`}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwitchOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}