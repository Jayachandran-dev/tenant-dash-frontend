import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, tenants, setTenants, selectTenant, loading: authLoading } =
    useAuth();
  const { showToast } = useToast();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/invites/${token}`);
        setInvite(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid invite");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleAccept = async () => {
    if (!user) {
      // save token and go login
      localStorage.setItem("pendingInviteToken", token);
      navigate("/login");
      return;
    }

    setAccepting(true);
    try {
      const res = await api.post(`/invites/${token}/accept`);
      const newTenant = res.data.tenant;

      const updatedTenants = [...(tenants || []), newTenant];
      setTenants(updatedTenants);
      localStorage.setItem("tenants", JSON.stringify(updatedTenants));
      selectTenant(newTenant);

      localStorage.removeItem("pendingInviteToken");
      showToast(`Joined ${newTenant.name}`, "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not accept invite", "error");
    } finally {
      setAccepting(false);
    }
  };

  // After login, auto-accept if pending
  useEffect(() => {
    if (authLoading || !user || !invite) return;

    const pending = localStorage.getItem("pendingInviteToken");
    if (pending && pending === token) {
      handleAccept();
    }
  }, [user, authLoading, invite, token]);

  if (loading || authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 2 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={invite.tenant.logo || undefined}
            sx={{ width: 64, height: 64 }}
          >
            {invite.tenant.name?.charAt(0)}
          </Avatar>
          <Typography variant="h6" fontWeight={600} textAlign="center">
            Join {invite.tenant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            You’ve been invited as{" "}
            <strong>{invite.role}</strong>. Link expires{" "}
            {new Date(invite.expiresAt).toLocaleDateString()}.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting
              ? "Joining..."
              : user
              ? "Accept invite"
              : "Login to accept"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}