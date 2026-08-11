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
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddIcon from "@mui/icons-material/Add";
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
  const theme = useTheme();

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

  const itemCount = data?.items?.length || 0;

  // Unified color system: every stat icon uses the theme's primary color
  // (alpha-tinted background, solid icon) instead of a different hardcoded
  // hex per card — matches the "one consistent accent" principle from the
  // design system, and means these automatically follow a tenant's chosen
  // theme color instead of being stuck on blue/green/orange.
  const statIconSx = {
    width: 44,
    height: 44,
    borderRadius: 1,
    bgcolor: alpha(theme.palette.primary.main, 0.15),
    color: "primary.main",
  };

  return (
    <Box>
      {/* Welcome Section — gradient now derives from the theme's primary
          color instead of a hardcoded blue, so it follows the tenant's
          chosen accent color automatically. */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "primary.contrastText",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user?.avatar || undefined}
            sx={{ width: 64, height: 64, border: "2px solid", borderColor: "rgba(255,255,255,0.5)" }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight={600}>
              Welcome back, {user?.name || "User"} 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {data?.message || "Here's your business overview."}
            </Typography>
            <Chip
              label={currentTenant?.name}
              size="small"
              sx={{
                mt: 1,
                borderRadius: 1,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "inherit",
                fontWeight: 500,
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Overview label */}
      <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1 }}>
        Overview
      </Typography>

      {/* Stat grid: Business + Your Role side by side (even on mobile),
          Total Items full-width below — matches the compact 2-col layout
          from the design mockup instead of 3 equal-width cards stacking
          full-width on small screens. */}
      <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderRadius: 1, height: "100%", boxShadow: "none" }}>
            <CardContent>
              <Avatar sx={statIconSx}>
                <BusinessIcon fontSize="small" />
              </Avatar>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Business
              </Typography>
              <Typography variant="h6" fontWeight={600} noWrap>
                {currentTenant?.name || data?.tenant?.name || "—"}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Your Business
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card variant="outlined" sx={{ borderRadius: 1, height: "100%", boxShadow: "none" }}>
            <CardContent>
              <Avatar sx={statIconSx}>
                <PersonOutlineIcon fontSize="small" />
              </Avatar>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Your Role
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "—"}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Account Role
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 1, boxShadow: "none" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={statIconSx}>
                  <Inventory2OutlinedIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {itemCount}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Items in your business
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Items */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
        elevation={0}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Recent Items
          </Typography>
          {itemCount > 0 && (
            <Button size="small" onClick={() => navigate("/items")} sx={{ borderRadius: 1 }}>
              View all
            </Button>
          )}
        </Stack>
        <Divider sx={{ mb: 2 }} />

        {itemCount > 0 ? (
          <Stack spacing={1.5}>
            {data.items.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 1,
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
          // Actionable empty state — icon + heading + description + a real
          // CTA that takes the user straight to where they can add an item,
          // instead of just stating that the list is empty.
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                mb: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
              }}
            >
              <Inventory2OutlinedIcon />
            </Avatar>
            <Typography fontWeight={600}>No items yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add your first item to get started.
            </Typography>
            {isOwner && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/items")}
                sx={{ borderRadius: 1 }}
              >
                Add Item
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}