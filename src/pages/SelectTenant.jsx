import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function SelectTenant() {
  const { tenants, selectTenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (tenant) => {
    selectTenant(tenant);
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
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
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={tenant.name}
              secondary={`Role: ${tenant.role}`}
            />
          </ListItemButton>
        ))}
      </List>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2, borderRadius: 1 }}
        onClick={logout}
      >
        Logout
      </Button>
    </AuthLayout>
  );
}