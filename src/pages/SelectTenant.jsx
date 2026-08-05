import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SelectTenant() {
  const { tenants, selectTenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (tenant) => {
    selectTenant(tenant);
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
          Select Business
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          You have access to multiple businesses
        </Typography>

        <List>
          {tenants.map((tenant) => (
            <ListItemButton
              key={tenant.id}
              onClick={() => handleSelect(tenant)}
              sx={{ border: "1px solid #eee", borderRadius: 1, mb: 1 }}
            >
              <ListItemText
                primary={tenant.name}
                secondary={`Role: ${tenant.role}`}
              />
            </ListItemButton>
          ))}
        </List>

        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={logout}>
          Logout
        </Button>
      </Paper>
    </Box>
  );
}