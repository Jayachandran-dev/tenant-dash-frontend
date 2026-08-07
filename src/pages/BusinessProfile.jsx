import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
  Grid,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePermission from "../hooks/usePermission";
import { uploadImageToCloudinary } from "../utils/uploadImage";

export default function BusinessProfile() {
  const { currentTenant, selectTenant } = useAuth();
  const { isOwner } = usePermission();
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ logo: false, visitingCard: false });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    tagline: "",
    address: "",
    website: "",
    description: "",
    logo: "",
    visitingCard: "",
    themeColor: "#0D9488",
    themeMode: "light",
  });

  const logoInputRef = useRef(null);
  const cardInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/business/profile");
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        tagline: res.data.tagline || "",
        address: res.data.address || "",
        website: res.data.website || "",
        description: res.data.description || "",
        logo: res.data.logo || "",
        visitingCard: res.data.visitingCard || "",
        themeColor: res.data.themeColor || "#0D9488",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentTenant]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = async (type, file) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, [type]: url }));
      showToast(
        `${type === "logo" ? "Logo" : "Visiting card"} uploaded`,
        "success"
      );
    } catch (err) {
      showToast("Image upload failed", "error");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Business name is required", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/business/profile", form);
      setProfile(res.data);

      if (currentTenant && res.data.name !== currentTenant.name) {
        selectTenant({ ...currentTenant, name: res.data.name });
      }

      setEditing(false);
      showToast("Business profile updated successfully", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      tagline: profile?.tagline || "",
      address: profile?.address || "",
      website: profile?.website || "",
      description: profile?.description || "",
      logo: profile?.logo || "",
      visitingCard: profile?.visitingCard || "",
      themeColor: profile?.themeColor || "#0D9488",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ========== STICKY HEADER ========== */}
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 10,
          bgcolor: "background.default",
          pb: 2,
          pt: 1,
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="h5" fontWeight={600}>
            Business Profile
          </Typography>

          {isOwner && (
            <Box>
              {editing ? (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    startIcon={<CloseIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size={isMobile ? "small" : "medium"}
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {/* ========== CONTENT ========== */}
      <Grid container spacing={2}>
        {/* Images Section */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Logo - Square ratio */}
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Business Logo
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  maxWidth: 220,
                  mx: "auto",
                  mt: 1,
                }}
              >
                <Avatar
                  src={form.logo || undefined}
                  variant="rounded"
                  sx={{
                    width: "100%",
                    height: "100%",
                    fontSize: 40,
                  }}
                >
                  {form.name?.charAt(0) || "B"}
                </Avatar>

                {editing && (
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      border: "1px solid #ddd",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                    disabled={uploading.logo}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      ref={logoInputRef}
                      onChange={(e) =>
                        handleImageUpload("logo", e.target.files?.[0])
                      }
                    />
                  </IconButton>
                )}
              </Box>

              {uploading.logo && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="center"
                  mt={1}
                >
                  Uploading...
                </Typography>
              )}
            </Paper>

            {/* Visiting Card - 1.75:1 ratio */}
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Visiting Card
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1.75 / 1",
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  overflow: "hidden",
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {form.visitingCard ? (
                  <Box
                    component="img"
                    src={form.visitingCard}
                    alt="Visiting Card"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    No visiting card
                  </Typography>
                )}

                {editing && (
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      border: "1px solid #ddd",
                    }}
                    disabled={uploading.visitingCard}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      ref={cardInputRef}
                      onChange={(e) =>
                        handleImageUpload("visitingCard", e.target.files?.[0])
                      }
                    />
                  </IconButton>
                )}
              </Box>

              {uploading.visitingCard && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="center"
                  mt={1}
                >
                  Uploading...
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>

        {/* Details Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                label="Business Name"
                value={form.name}
                onChange={handleChange("name")}
                fullWidth
                disabled={!editing}
                required
              />

              <TextField
                label="Service Tagline"
                value={form.tagline}
                onChange={handleChange("tagline")}
                fullWidth
                disabled={!editing}
                placeholder="e.g. Quality services at affordable prices"
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Business Phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  fullWidth
                  disabled={!editing}
                />
                <TextField
                  label="Business Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  fullWidth
                  disabled={!editing}
                />
              </Stack>

              <TextField
                label="Website"
                value={form.website}
                onChange={handleChange("website")}
                fullWidth
                disabled={!editing}
                placeholder="https://example.com"
              />

              <TextField
                label="Address"
                value={form.address}
                onChange={handleChange("address")}
                fullWidth
                disabled={!editing}
                multiline
                rows={2}
              />

              <TextField
                label="About / Description"
                value={form.description}
                onChange={handleChange("description")}
                fullWidth
                disabled={!editing}
                multiline
                rows={4}
              />

              {/* Theme Color */}
              {isOwner && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Business Theme Color
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: form.themeColor,
                        border: "2px solid",
                        borderColor: "divider",
                        cursor: editing ? "pointer" : "default",
                      }}
                    />
                    <TextField
                      type="color"
                      value={form.themeColor}
                      onChange={handleChange("themeColor")}
                      disabled={!editing}
                      sx={{
                        width: 80,
                        "& input": {
                          cursor: editing ? "pointer" : "default",
                          height: 40,
                          padding: 0.5,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {form.themeColor}
                    </Typography>
                  </Stack>
                </Box>
              )}

               {/* Theme Mode */}
              {isOwner && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Default Theme Mode
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={form.themeMode === "light" ? "contained" : "outlined"}
                      onClick={() => setForm(prev => ({ ...prev, themeMode: "light" }))}
                      disabled={!editing}
                      size="small"
                    >
                      Light
                    </Button>
                    <Button
                      variant={form.themeMode === "dark" ? "contained" : "outlined"}
                      onClick={() => setForm(prev => ({ ...prev, themeMode: "dark" }))}
                      disabled={!editing}
                      size="small"
                    >
                      Dark
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}