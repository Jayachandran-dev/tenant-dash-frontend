import { useAuth } from "../context/AuthContext";

export default function usePermission() {
  const { currentTenant } = useAuth();

  const role = currentTenant?.role || null;

  return {
    role,
    isOwner: role === "owner",
    isEmployee: role === "employee",
    canAddUser: role === "owner",
    canManageUsers: role === "owner",
  };
}