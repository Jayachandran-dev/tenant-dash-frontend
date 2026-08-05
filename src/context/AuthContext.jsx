import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTenants = localStorage.getItem("tenants");
    const storedTenantId = localStorage.getItem("tenantId");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      const parsedTenants = storedTenants ? JSON.parse(storedTenants) : [];

      setUser(parsedUser);
      setTenants(parsedTenants);

      if (storedTenantId && parsedTenants.length > 0) {
        const found = parsedTenants.find(
          (t) => t.id === parseInt(storedTenantId)
        );
        setCurrentTenant(found || parsedTenants[0] || null);
      } else if (parsedTenants.length === 1) {
        setCurrentTenant(parsedTenants[0]);
        localStorage.setItem("tenantId", parsedTenants[0].id);
      }
    }
    setLoading(false);
  }, []);

  // Send OTP
  const sendOtp = async (mobile) => {
    const res = await api.post("/auth/send-otp", { mobile });
    return res.data; // contains { message, otp }
  };

  // Verify OTP (Login)
  const verifyOtp = async (mobile, otp) => {
    const res = await api.post("/auth/verify-otp", { mobile, otp });
    const { token, user, tenants } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tenants", JSON.stringify(tenants));

    setUser(user);
    setTenants(tenants);

    if (tenants.length === 1) {
      localStorage.setItem("tenantId", tenants[0].id);
      setCurrentTenant(tenants[0]);
    } else {
      localStorage.removeItem("tenantId");
      setCurrentTenant(null);
    }

    return { user, tenants };
  };

  const updateProfile = async (data) => {
  const res = await api.patch("/users/me", data);
      const updatedUser = res.data;

      // Update local state + localStorage
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      return updatedUser;
    };

  // Signup
  const signup = async (tenantName, mobile) => {
    const res = await api.post("/auth/signup", { tenantName, mobile });
    const { token, user, tenants } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tenants", JSON.stringify(tenants));
    localStorage.setItem("tenantId", tenants[0].id);

    setUser(user);
    setTenants(tenants);
    setCurrentTenant(tenants[0]);

    return { user, tenants };
  };

  const selectTenant = (tenant) => {
    localStorage.setItem("tenantId", tenant.id);
    setCurrentTenant(tenant);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenants");
    localStorage.removeItem("tenantId");
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenants,
        setTenants,
        currentTenant,
        sendOtp,
        verifyOtp,
        signup,
        selectTenant,
        logout,
        loading,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);