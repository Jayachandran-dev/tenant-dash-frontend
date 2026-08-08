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
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        themeMode: res.data.themeMode || "light",
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

      selectTenant({
        ...currentTenant,
        name: res.data.name,
        themeColor: res.data.themeColor,
        themeMode: res.data.themeMode,
      });

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
      themeMode: profile?.themeMode || "light",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const glassCardSx = {
    p: { xs: 2, md: 2.5 },
    borderRadius: 1,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
  };

  return (
    <Box>
      {/* ========== COMPACT STICKY HEADER ========== */}
      <Box
        sx={{
          position: "sticky",
          top: 64, // under AppBar
          zIndex: 20,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 1.5,
          mb: 3,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              Business Profile
            </Typography>
          </Box>

          {isOwner && (
            <Box>
              {editing ? (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ borderRadius: 999, px: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 999, px: 2.5 }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {/* ========== MAIN CONTENT ========== */}
      <Grid container spacing={3}>
        {/* LEFT - Forms */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={2.5}>
            {/* Business Details */}
            <Paper sx={glassCardSx}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Business Details
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Business Name *"
                  value={form.name}
                  onChange={handleChange("name")}
                  fullWidth
                  size="small"
                  disabled={!editing}
                  required
                />
                <TextField
                  label="Service Tagline"
                  value={form.tagline}
                  onChange={handleChange("tagline")}
                  fullWidth
                  size="small"
                  disabled={!editing}
                  placeholder="e.g. Quality services at affordable prices"
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Business Phone"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    fullWidth
                    size="small"
                    disabled={!editing}
                  />
                  <TextField
                    label="Business Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    fullWidth
                    size="small"
                    disabled={!editing}
                  />
                </Stack>
                <TextField
                  label="Website"
                  value={form.website}
                  onChange={handleChange("website")}
                  fullWidth
                  size="small"
                  disabled={!editing}
                  placeholder="https://example.com"
                />
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={handleChange("address")}
                  fullWidth
                  size="small"
                  disabled={!editing}
                  multiline
                  rows={2}
                />
                <TextField
                  label="About / Description"
                  value={form.description}
                  onChange={handleChange("description")}
                  fullWidth
                  size="small"
                  disabled={!editing}
                  multiline
                  rows={3}
                  placeholder="Describe your business..."
                />
              </Stack>
            </Paper>

            {/* Theme Settings */}
            {isOwner && (
              <Paper sx={glassCardSx}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Theme Settings
                </Typography>

                <Stack spacing={2.5}>
                  {/* Theme Color */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1.5}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Business Theme Color
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Primary accent color for your dashboard
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: form.themeColor,
                          border: "2px solid",
                          borderColor: "divider",
                        }}
                      />
                      <TextField
                        type="color"
                        value={form.themeColor}
                        onChange={handleChange("themeColor")}
                        disabled={!editing}
                        size="small"
                        sx={{
                          width: 56,
                          "& input": {
                            cursor: editing ? "pointer" : "default",
                            height: 28,
                            p: 0.4,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{ textTransform: "uppercase", minWidth: 64 }}
                      >
                        {form.themeColor}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  {/* Theme Mode */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1.5}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Default Theme Mode
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Initial color scheme when users open this business
                      </Typography>
                    </Box>

                    <ToggleButtonGroup
                      value={form.themeMode}
                      exclusive
                      onChange={(_, value) => {
                        if (value && editing) {
                          setForm((prev) => ({ ...prev, themeMode: value }));
                        }
                      }}
                      size="small"
                      sx={{
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        p: 0.4,
                        "& .MuiToggleButton-root": {
                          border: 0,
                          borderRadius: "6px !important",
                          px: 2,
                          py: 0.5,
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: 13,
                        },
                      }}
                    >
                      <ToggleButton value="light" disabled={!editing}>
                        Light
                      </ToggleButton>
                      <ToggleButton value="dark" disabled={!editing}>
                        Dark
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Grid>

        {/* RIGHT - Media Assets */}
        <Grid item xs={12} lg={5}>
          <Stack spacing={2.5}>
            {/* Logo */}
            <Paper sx={{ ...glassCardSx, textAlign: "center" }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Business Logo
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 200,
                  aspectRatio: "1 / 1",
                  mx: "auto",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "2px dashed",
                  borderColor: editing ? "primary.main" : "divider",
                  bgcolor: "action.hover",
                  cursor: editing ? "pointer" : "default",
                  "&:hover .overlay": { opacity: editing ? 1 : 0 },
                }}
                onClick={() => editing && logoInputRef.current?.click()}
              >
                {form.logo ? (
                  <Box
                    component="img"
                    src={form.logo}
                    alt="Logo"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: "100%",
                      fontSize: 42,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    {form.name?.charAt(0)?.toUpperCase() || "B"}
                  </Avatar>
                )}

                {editing && (
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 28, mb: 0.5 }} />
                    <Typography variant="caption" fontWeight={600}>
                      {uploading.logo ? "Uploading..." : "Change Logo"}
                    </Typography>
                  </Box>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={logoInputRef}
                  onChange={(e) => handleImageUpload("logo", e.target.files?.[0])}
                />
              </Box>
            </Paper>

            {/* Visiting Card */}
            <Paper sx={{ ...glassCardSx, textAlign: "center" }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Visiting Card
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1.75 / 1",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                  cursor: editing ? "pointer" : "default",
                  "&:hover .overlay": { opacity: editing ? 1 : 0 },
                }}
                onClick={() => editing && cardInputRef.current?.click()}
              >
                {form.visitingCard ? (
                  <Box
                    component="img"
                    src={form.visitingCard}
                    alt="Visiting Card"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%", color: "text.secondary" }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 32, mb: 0.5, opacity: 0.5 }} />
                    <Typography variant="caption">No visiting card</Typography>
                  </Stack>
                )}

                {editing && (
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      gap: 1,
                    }}
                  >
                    <EditIcon fontSize="small" />
                    <Typography variant="caption" fontWeight={600}>
                      {uploading.visitingCard ? "Uploading..." : "Edit Design"}
                    </Typography>
                  </Box>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={cardInputRef}
                  onChange={(e) =>
                    handleImageUpload("visitingCard", e.target.files?.[0])
                  }
                />
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}