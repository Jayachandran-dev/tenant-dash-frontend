import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import usePermission from "../hooks/usePermission";

export default function Dashboard() {
  const { user, currentTenant, logout } = useAuth();
  const { isOwner, role } = usePermission();
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
  }, [currentTenant]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: "Business",
      value: currentTenant?.name || data?.tenant?.name || "—",
      icon: <BusinessIcon sx={{ fontSize: 32 }} />,
      color: "#1976d2",
    },
    {
      title: "Your Role",
      value: role ? role.charAt(0).toUpperCase() + role.slice(1) : "—",
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      color: "#2e7d32",
    },
    {
      title: "Items",
      value: data?.items?.length || 0,
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      color: "#ed6c02",
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user?.avatar || undefined}
            sx={{ width: 64, height: 64, border: "2px solid white" }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight={600}>
              Welcome back, {user?.name || "User"} 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {data?.message || `You're working in ${currentTenant?.name}`}
            </Typography>
            <Chip
              label={currentTenant?.name}
              size="small"
              sx={{
                mt: 1,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Items Section */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Items
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {data?.items?.length > 0 ? (
          <Stack spacing={1.5}>
            {data.items.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={500}>{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No items found in this business yet.
            </Typography>
            {isOwner && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can start adding data as you build more modules.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}