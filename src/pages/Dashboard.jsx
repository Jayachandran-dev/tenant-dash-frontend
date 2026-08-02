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
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
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
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">
            {data?.tenant?.name || "Dashboard"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {data?.message}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Logged in as: {user?.email}
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
    </Box>
  );
}