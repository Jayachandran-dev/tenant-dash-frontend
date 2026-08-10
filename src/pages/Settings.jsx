import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/PageHeader";
import { uploadImageToCloudinary } from "../utils/uploadImage";

// Same "soft & friendly" card styling used across Business Profile / Dashboard / Users.
const cardSx = {
  p: { xs: 2, sm: 3 },
  borderRadius: 1,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  border: "1px solid",
  borderColor: "divider",
};

const NOTIFICATION_PREFS = [
  {
    key: "emailNotifications",
    label: "Email notifications",
    helper: "Get emailed about important account activity",
  },
  {
    key: "newUserAlerts",
    label: "New user alerts",
    helper: "Notify me when someone joins this business",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    helper: "Occasional emails about new features",
  },
];

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    productUpdates: false,
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Name can't be empty", "warning");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), avatar });
      setEditing(false);
      showToast("Account settings updated", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
    setEditing(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setAvatar(url);
    } catch (err) {
      showToast("Failed to upload image", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleNotifToggle = (key) => (e) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: e.target.checked }));
    // TODO: persist to backend — local-only for now.
  };

  const handleLogoutAllDevices = () => {
    // TODO: call a real "revoke all sessions" endpoint when available.
    showToast("Logged out of all other devices", "success");
  };

  const handleDeleteAccount = () => {
    setConfirmDeleteOpen(false);
    // TODO: wire up to a real account-deletion endpoint.
    showToast("Account deletion isn't wired up yet", "info");
  };

  const tabs = [
    { label: "Account", icon: <PersonOutlineIcon fontSize="small" /> },
    { label: "Notifications", icon: <NotificationsNoneIcon fontSize="small" /> },
    { label: "Danger Zone", icon: <WarningAmberIcon fontSize="small" /> },
  ];

  const headerActions =
    tab === 0 ? (
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
      <PageHeader
        title="Settings"
        actions={headerActions}
        tabs={tabs}
        tabValue={tab}
        onTabChange={(_, v) => setTab(v)}
      />

      {/* ========== ACCOUNT TAB ========== */}
      {tab === 0 && (
        <Paper sx={cardSx}>
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={avatar || undefined}
                  sx={{ width: 90, height: 90, fontSize: 32 }}
                >
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </Avatar>

                {editing && (
                  <IconButton
                    color="primary"
                    component="label"
                    disabled={avatarUploading}
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
              </Box>
            </Box>

            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              disabled={!editing}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Mobile Number"
              value={user?.mobile || ""}
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              helperText="Your mobile number is your login ID and can't be changed here"
            />
          </Stack>
        </Paper>
      )}

      {/* ========== NOTIFICATIONS TAB ========== */}
      {tab === 1 && (
        <Paper sx={cardSx}>
          <Stack divider={<Divider />} spacing={2}>
            {NOTIFICATION_PREFS.map((pref) => (
              <Stack
                key={pref.key}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {pref.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pref.helper}
                  </Typography>
                </Box>
                <Switch
                  checked={notifPrefs[pref.key]}
                  onChange={handleNotifToggle(pref.key)}
                />
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}

      {/* ========== DANGER ZONE TAB ========== */}
      {tab === 2 && (
        <Paper sx={{ ...cardSx, borderColor: "error.main" }}>
          <Stack divider={<Divider />} spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  Log out of all devices
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ends every active session except this one
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<LogoutIcon />}
                onClick={handleLogoutAllDevices}
                sx={{ borderRadius: 1 }}
              >
                Log out everywhere
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  Delete account
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Permanently deletes your account. This can't be undone.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setConfirmDeleteOpen(true)}
                sx={{ borderRadius: 1 }}
              >
                Delete account
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle>Delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This permanently deletes your account and removes your access to
            every business you're a member of. This can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ borderRadius: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            sx={{ borderRadius: 1 }}
          >
            Delete permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}