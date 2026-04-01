import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Auth
import AuthLayout from "./components/auth/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#e2e8f0",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(12px)",
              fontSize: "14px",
              padding: "12px 16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#0f172a" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#0f172a" },
            },
          }}
          />
          <Routes>
          {/* Public auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Admin Only Routes */}
              <Route
                path="/suppliers"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <Suppliers />
                  </RoleGuard>
                }
              />
              <Route
                path="/users"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <Users />
                  </RoleGuard>
                }
              />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
