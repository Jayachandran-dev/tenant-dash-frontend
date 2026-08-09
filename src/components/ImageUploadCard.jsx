import { useRef } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

/**
 * Reusable image upload card — used for Business Logo and Visiting Card.
 *
 * Props:
 *  - title:        card heading, e.g. "Business Logo"
 *  - image:        current image URL (or "" if none)
 *  - aspectRatio:  e.g. "1 / 1" for logo, "1.75 / 1" for a card/banner
 *  - editing:      whether upload is currently allowed
 *  - uploading:    shows a spinner overlay while true
 *  - onUpload(file): called with the selected File
 *  - emptyLabel:   fallback text/initial shown when there's no image ("W")
 *  - helperText:   small hint under the box, e.g. "PNG or JPG, up to 5MB"
 */
export default function ImageUploadCard({
  title,
  image,
  aspectRatio = "1 / 1",
  editing = false,
  uploading = false,
  onUpload,
  emptyLabel,
  helperText = "PNG or JPG, up to 5MB",
}) {
  const inputRef = useRef(null);

  const hasImage = Boolean(image);
  const clickable = editing && !uploading;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>

      <Box
        component={clickable ? "label" : "div"}
        sx={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio,
          borderRadius: 1,
          overflow: "hidden",
          mt: 1,
          bgcolor: hasImage ? "transparent" : "action.hover",
          border: "1px dashed",
          borderColor: hasImage ? "transparent" : "divider",
          cursor: clickable ? "pointer" : "default",
          transition: "background-color 0.15s ease",
          "&:hover .upload-overlay": clickable
            ? { opacity: 1 }
            : { opacity: 0 },
        }}
      >
        {hasImage ? (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            {emptyLabel ? (
              <Typography variant="h4" fontWeight={600} color="text.disabled">
                {emptyLabel}
              </Typography>
            ) : (
              <CloudUploadOutlinedIcon fontSize="large" color="disabled" />
            )}
            <Typography variant="caption" color="text.secondary" textAlign="center" px={2}>
              {editing ? "Click to upload" : "No image yet"}
            </Typography>
          </Box>
        )}

        {/* Hover overlay — appears over an existing image when editing, standard "change photo" affordance */}
        {clickable && hasImage && (
          <Box
            className="upload-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "common.white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              opacity: 0,
              transition: "opacity 0.15s ease",
            }}
          >
            <PhotoCameraOutlinedIcon />
            <Typography variant="caption" fontWeight={500}>
              Change photo
            </Typography>
          </Box>
        )}

        {/* Uploading state — clearly visible spinner + label instead of a small caption below the box */}
        {uploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.55)",
              color: "common.white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={28} sx={{ color: "common.white" }} />
            <Typography variant="caption" fontWeight={500}>
              Uploading...
            </Typography>
          </Box>
        )}

        {clickable && (
          <input
            hidden
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
          />
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="center"
        mt={1}
      >
        {helperText}
      </Typography>
    </Paper>
  );
}