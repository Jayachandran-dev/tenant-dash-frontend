import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePermission from "../hooks/usePermission";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { socket } from "../socket";
import ImageUploadCard from "../components/ImageUploadCard";
import AppearanceSection from "../components/AppearanceSection";
import PageHeader from "../components/PageHeader";

// Shared "soft & friendly" card styling — one place to tune the whole design system.
const cardSx = {
  p: { xs: 2, sm: 3 },
  borderRadius: 1,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  border: "1px solid",
  borderColor: "divider",
};

// Fixed compact width for the logo / visiting card row on wider screens —
// keeps them side by side and sized sensibly instead of stretching to
// fill half of a very wide content column.
const COMPACT_CARD_WIDTH = { xs: "100%", sm: 300 };

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
  const [tab, setTab] = useState(0);

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
    themeColor: "#8B5CF6",
    themeMode: "light",
  });

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
        themeColor: res.data.themeColor || "#8B5CF6",
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

  useEffect(() => {
    const handleUpdate = (updated) => {
      if (updated.id === currentTenant?.id) {
        setProfile(updated);
        setForm((prev) => ({
          ...prev,
          name: updated.name || "",
          phone: updated.phone || "",
          email: updated.email || "",
          tagline: updated.tagline || "",
          address: updated.address || "",
          website: updated.website || "",
          description: updated.description || "",
          logo: updated.logo || "",
          visitingCard: updated.visitingCard || "",
          themeColor: updated.themeColor || "#8B5CF6",
          themeMode: updated.themeMode || "light",
        }));
      }
    };

    socket.on("business:updated", handleUpdate);
    return () => socket.off("business:updated", handleUpdate);
  }, [currentTenant?.id]);

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

      // IMPORTANT: update the currentTenant so the theme reacts immediately
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
      themeColor: profile?.themeColor || "#8B5CF6",
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

  const tabs = [
    { label: "Details", icon: <BadgeOutlinedIcon fontSize="small" /> },
    { label: "Branding", icon: <ImageOutlinedIcon fontSize="small" /> },
    ...(isOwner
      ? [{ label: "Appearance", icon: <PaletteOutlinedIcon fontSize="small" /> }]
      : []),
  ];

  const headerActions = isOwner ? (
    editing ? (
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          startIcon={<CloseIcon />}
          onClick={handleCancel}
          disabled={saving}
          sx={{ borderRadius: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size={isMobile ? "small" : "medium"}
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ borderRadius: 1 }}
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
        sx={{ borderRadius: 1 }}
      >
        Edit
      </Button>
    )
  ) : null;

  return (
    <Box>
      {/* Standard page header — title left, actions pinned right, tabs below.
          Reuse this same PageHeader on every future page for a consistent layout. */}
      <PageHeader
        title="Business Profile"
        actions={headerActions}
        tabs={tabs}
        tabValue={tab}
        onTabChange={(_, v) => setTab(v)}
      />

      {/* ========== DETAILS TAB ========== */}
      {tab === 0 && (
        <Paper sx={cardSx}>
          <Stack spacing={2.5}>
            <TextField
              label="Business Name"
              InputLabelProps={{ shrink: true }}
              value={form.name}
              onChange={handleChange("name")}
              fullWidth
              disabled={!editing}
              required
            />

            <TextField
              label="Service Tagline"
              InputLabelProps={{ shrink: true }}
              value={form.tagline}
              onChange={handleChange("tagline")}
              fullWidth
              disabled={!editing}
              placeholder="e.g. Quality services at affordable prices"
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Business Phone"
                InputLabelProps={{ shrink: true }}
                value={form.phone}
                onChange={handleChange("phone")}
                fullWidth
                disabled={!editing}
                placeholder={!editing ? "Not set" : ""}
              />
              <TextField
                label="Business Email"
                InputLabelProps={{ shrink: true }}
                value={form.email}
                onChange={handleChange("email")}
                fullWidth
                disabled={!editing}
                placeholder={!editing ? "Not set" : ""}
              />
            </Stack>

            <TextField
              label="Website"
              InputLabelProps={{ shrink: true }}
              value={form.website}
              onChange={handleChange("website")}
              fullWidth
              disabled={!editing}
              placeholder={editing ? "https://example.com" : "Not set"}
            />

            <TextField
              label="Address"
              InputLabelProps={{ shrink: true }}
              value={form.address}
              onChange={handleChange("address")}
              fullWidth
              disabled={!editing}
              placeholder={!editing ? "Not set" : ""}
              multiline
              rows={2}
            />

            <TextField
              label="About / Description"
              InputLabelProps={{ shrink: true }}
              value={form.description}
              onChange={handleChange("description")}
              fullWidth
              disabled={!editing}
              placeholder={!editing ? "Not set" : ""}
              multiline
              rows={4}
            />
          </Stack>
        </Paper>
      )}

      {/* ========== BRANDING TAB ========== */}
      {tab === 1 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ width: COMPACT_CARD_WIDTH }}>
            <ImageUploadCard
              title="Business Logo"
              image={form.logo}
              aspectRatio="1 / 1"
              editing={editing}
              uploading={uploading.logo}
              onUpload={(file) => handleImageUpload("logo", file)}
              emptyLabel={form.name?.charAt(0)?.toUpperCase()}
              helperText="Square image works best · PNG or JPG, up to 5MB"
            />
          </Box>

          <Box sx={{ width: COMPACT_CARD_WIDTH }}>
            <ImageUploadCard
              title="Visiting Card"
              image={form.visitingCard}
              aspectRatio="1.75 / 1"
              editing={editing}
              uploading={uploading.visitingCard}
              onUpload={(file) => handleImageUpload("visitingCard", file)}
              helperText="Landscape image works best · PNG or JPG, up to 5MB"
            />
          </Box>
        </Box>
      )}

      {/* ========== APPEARANCE TAB (owner only) ========== */}
      {tab === 2 && isOwner && (
        <AppearanceSection
          themeColor={form.themeColor}
          themeMode={form.themeMode}
          editing={editing}
          onColorChange={handleChange("themeColor")}
          onModeChange={(mode) => setForm((prev) => ({ ...prev, themeMode: mode }))}
        />
      )}
    </Box>
  );
}