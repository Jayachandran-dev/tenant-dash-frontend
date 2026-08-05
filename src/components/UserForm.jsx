import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Alert,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { uploadImageToCloudinary } from "../utils/uploadImage";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
];

export default function UserForm({
  open,
  onClose,
  onSubmit,
  mode = "create",
  initialData = {},
  loading = false,
}) {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("employee");
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName(initialData.name || "");
      setAvatar(initialData.avatar || "");
      setPreview(initialData.avatar || "");
      setRole(initialData.role || "employee");
      setError("");

      if (initialData.mobile) {
        const mob = initialData.mobile;
        if (mob.startsWith("+91")) {
          setCountryCode("+91");
          setMobile(mob.slice(3));
        } else {
          setMobile(mob.replace(/\D/g, ""));
        }
      } else {
        setMobile("");
        setCountryCode("+91");
      }
    }
  }, [open, initialData]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    setError("");

    try {
      const url = await uploadImageToCloudinary(file);
      setAvatar(url);
    } catch (err) {
      setError("Failed to upload image");
      setPreview(initialData.avatar || "");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "create" && (!mobile || mobile.length < 10)) {
      setError("Please enter a valid mobile number");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      avatar: avatar || null,
    };

    if (mode === "create") {
      payload.mobile = `${countryCode}${mobile}`;
      payload.role = role;
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{mode === "create" ? "Add User" : "Edit Profile"}</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Avatar + Upload */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={preview || undefined}
              sx={{ width: 90, height: 90, fontSize: 32 }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <IconButton
              color="primary"
              component="label"
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                bgcolor: "background.paper",
                border: "1px solid #ddd",
                "&:hover": { bgcolor: "grey.100" },
              }}
              disabled={uploading || loading}
            >
              <PhotoCameraIcon fontSize="small" />
              <input
                hidden
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </IconButton>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {uploading ? "Uploading..." : "Click camera to upload"}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />

        {/* Mobile */}
        {mode === "create" ? (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              select
              label="Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              sx={{ width: 140 }}
            >
              {countryCodes.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 10 }}
            />
          </Stack>
        ) : (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Mobile Number
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {initialData.mobile}
            </Typography>
          </Box>
        )}

        {mode === "create" && (
          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
          </TextField>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || uploading}
        >
          {loading ? "Saving..." : mode === "create" ? "Add User" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}