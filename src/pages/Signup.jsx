import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
];

export default function Signup() {
  const [tenantName, setTenantName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fullMobile = `${countryCode}${mobile}`;
      await signup(tenantName, fullMobile);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
        Create Your Business
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Business Name"
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          margin="normal"
          required
        />

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
            required
          />
        </Stack>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, borderRadius: 1 }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Business"}
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ textDecoration: "none" }}>
          Login with OTP
        </Link>
      </Typography>
    </AuthLayout>
  );
}