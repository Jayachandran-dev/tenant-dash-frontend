import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function BusinessSwitcher({ open, onClose }) {
  const { user, tenants, currentTenant, selectTenant, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelect = (tenant) => {
    selectTenant(tenant);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const handleProfileSubmit = async (payload) => {
    setSaving(true);
    try {
      await updateProfile({
        name: payload.name,
        avatar: payload.avatar,
      });
      showToast("Profile updated successfully", "success");
      setEditOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "75vh",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Handle bar */}
          <Box
            sx={{
              width: 40,
              height: 5,
              bgcolor: "divider",
              borderRadius: 3,
              mx: "auto",
              mb: 2,
            }}
          />

          {/* Current User Profile */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mb: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}
          >
            <Avatar
              src={user?.avatar || undefined}
              sx={{ width: 52, height: 52 }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={600}>
                {user?.name || "No Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.mobile}
              </Typography>
            </Box>

            <IconButton size="small" onClick={() => setEditOpen(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography variant="h6" fontWeight={600} gutterBottom>
            <SwapHorizIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
            Switch Business
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a business to continue
          </Typography>

          <List>
            {tenants.map((tenant) => (
              <ListItemButton
                key={tenant.id}
                selected={currentTenant?.id === tenant.id}
                onClick={() => handleSelect(tenant)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  border: "1px solid",
                  borderColor:
                    currentTenant?.id === tenant.id ? "primary.main" : "divider",
                }}
              >
                <ListItemText
                  primary={tenant.name}
                  secondary={`Role: ${tenant.role}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Edit Profile Form */}
      <UserForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleProfileSubmit}
        mode="edit"
        initialData={{
          name: user?.name,
          mobile: user?.mobile,
          avatar: user?.avatar,
        }}
        loading={saving}
      />
    </>
  );
}