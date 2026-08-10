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

export default function Login() {
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState(""); // OTP shown in Alert — see note below
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const fullMobile = `${countryCode}${mobile}`;

  const handleSendOtp = async () => {
    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await sendOtp(fullMobile);
      setOtpSent(true);
      setDevOtp(data.otp); // show in Alert
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyOtp(fullMobile, otp);

      if (result.tenants.length > 1) {
        navigate("/select-tenant");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Development OTP Alert — showing the OTP in the UI is convenient for
          testing, but make sure this is gated off (e.g. behind an env check)
          before this ships to real users. */}
      {devOtp && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your OTP is: <strong>{devOtp}</strong>
        </Alert>
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <TextField
          select
          label="Code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          sx={{ width: 140 }}
          disabled={otpSent}
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
          disabled={otpSent}
          required
        />
      </Stack>

      {!otpSent ? (
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, borderRadius: 1 }}
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            inputProps={{ maxLength: 6 }}
            margin="normal"
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, borderRadius: 1 }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1, borderRadius: 1 }}
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setDevOtp("");
            }}
          >
            Change Number
          </Button>
        </form>
      )}

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have a business?{" "}
        <Link to="/signup" style={{ textDecoration: "none" }}>
          Create Business
        </Link>
      </Typography>
    </AuthLayout>
  );
}