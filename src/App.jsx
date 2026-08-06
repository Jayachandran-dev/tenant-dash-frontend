import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SelectTenant from "./pages/SelectTenant";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import { ToastProvider } from "./context/ToastContext";
import BusinessProfile from "./pages/BusinessProfile";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
      />

      {/* Select tenant */}
      <Route
        path="/select-tenant"
        element={
          user ? <SelectTenant /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Only Owner can access Users */}
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["owner"]}>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all / Invalid routes */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/business-profile"
        element={
          <ProtectedRoute>
            <Layout>
              <BusinessProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;