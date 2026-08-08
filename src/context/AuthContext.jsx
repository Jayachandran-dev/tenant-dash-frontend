import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { socket } from "../socket";   // ← add this

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Restore session ----------
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

      // Connect socket after restoring session
      if (!socket.connected) {
        socket.connect();
      }
    }
    setLoading(false);
  }, []);

  // ---------- Join / Leave tenant room + listen for updates ----------
  useEffect(() => {
    if (!currentTenant?.id) return;

    // Join new tenant room
    socket.emit("join-tenant", currentTenant.id);

    // Listen for business profile updates
    const handleBusinessUpdated = (updatedTenant) => {
      console.log("Business updated via socket:", updatedTenant);

      // Update currentTenant
      setCurrentTenant((prev) => {
        if (prev?.id === updatedTenant.id) {
          return {
            ...prev,
            name: updatedTenant.name,
            themeColor: updatedTenant.themeColor,
            themeMode: updatedTenant.themeMode,
            logo: updatedTenant.logo,
            // add other fields you need
          };
        }
        return prev;
      });

      // Also update in tenants list
      setTenants((prev) =>
        prev.map((t) =>
          t.id === updatedTenant.id
            ? {
                ...t,
                name: updatedTenant.name,
                themeColor: updatedTenant.themeColor,
                themeMode: updatedTenant.themeMode,
              }
            : t
        )
      );

      // Keep localStorage in sync
      const storedTenants = JSON.parse(localStorage.getItem("tenants") || "[]");
      const updatedList = storedTenants.map((t) =>
        t.id === updatedTenant.id
          ? {
              ...t,
              name: updatedTenant.name,
              themeColor: updatedTenant.themeColor,
              themeMode: updatedTenant.themeMode,
            }
          : t
      );
      localStorage.setItem("tenants", JSON.stringify(updatedList));
    };

    socket.on("business:updated", handleBusinessUpdated);

    // Cleanup: leave room + remove listener when tenant changes or unmounts
    return () => {
      socket.emit("leave-tenant", currentTenant.id);
      socket.off("business:updated", handleBusinessUpdated);
    };
  }, [currentTenant?.id]);

  // ---------- Auth methods ----------
  const sendOtp = async (mobile) => {
    const res = await api.post("/auth/send-otp", { mobile });
    return res.data;
  };

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

    // Connect socket after login
    if (!socket.connected) {
      socket.connect();
    }

    return { user, tenants };
  };

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

    if (!socket.connected) {
      socket.connect();
    }

    return { user, tenants };
  };

  const selectTenant = (tenant) => {
    // Leave previous room is handled by the useEffect cleanup
    localStorage.setItem("tenantId", tenant.id);
    setCurrentTenant(tenant);
  };

  const updateProfile = async (data) => {
    const res = await api.patch("/users/me", data);
    const updatedUser = res.data;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return updatedUser;
  };

  const logout = () => {
    if (currentTenant?.id) {
      socket.emit("leave-tenant", currentTenant.id);
    }
    socket.disconnect();

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
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);