import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * RoleGuard Component - Protects routes based on user roles
 * @param {Array} allowedRoles - Array of roles that can access the route (e.g., ['ADMIN'])
 * @param {ReactNode} children - The component to render if access is granted
 * @param {string} redirectTo - Where to redirect if access is denied
 */
export default function RoleGuard({ allowedRoles, children, redirectTo = "/dashboard" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
