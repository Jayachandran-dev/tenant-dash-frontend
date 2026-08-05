import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePermission from "../hooks/usePermission";

/**
 * ProtectedRoute
 * 
 * props:
 * - children
 * - roles?: string[]   → example: ["owner"]
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, currentTenant } = useAuth();
  const { role } = usePermission();

  // Still loading auth state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no tenant selected yet
  if (!currentTenant) {
    return <Navigate to="/select-tenant" replace />;
  }

  // Role-based restriction
  if (roles.length > 0 && !roles.includes(role)) {
    // User is logged in but not allowed → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}