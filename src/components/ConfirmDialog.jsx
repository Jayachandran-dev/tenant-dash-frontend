import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * Reusable confirm dialog (delete / destructive actions)
 *
 * Props:
 * - open
 * - onClose
 * - onConfirm
 * - title
 * - message
 * - confirmLabel (default: "Delete")
 * - cancelLabel (default: "Cancel")
 * - loading
 * - confirmColor (default: "error")
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  confirmColor = "error",
}) {

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Please wait..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}