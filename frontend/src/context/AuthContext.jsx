import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signin = async (username, password) => {
    try {
      const response = await authAPI.signin({ username, password });
      const data = response.data;

      if (data.token) {
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(data.token);
        setUser(userData);
        toast.success("Welcome back, " + data.username + "!");
        return { success: true };
      } else {
        const msg = data.message || "Login failed";
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid username or password";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const signup = async (username, email, password, role) => {
    try {
      const response = await authAPI.signup({ username, email, password, role });
      const data = response.data;

      if (data.message?.includes("successful")) {
        toast.success("Account created successfully! Please sign in.");
        return { success: true };
      } else {
        const msg = data.message || "Signup failed";
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed. Please try again.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword({ email });
      const data = response.data;

      if (data.message?.includes("sent")) {
        toast.success("Reset link sent to your email!");
        return { success: true };
      } else {
        const msg = data.message || "Failed to send reset link";
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await authAPI.resetPassword({
        token: resetToken,
        newPassword,
      });
      const data = response.data;

      if (data.message?.includes("successful")) {
        toast.success("Password reset successful! Please sign in.");
        return { success: true };
      } else {
        const msg = data.message || "Password reset failed";
        toast.error(msg);
        return { success: false, message: msg };
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Password reset failed.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/signin", { replace: true });
  };

  // Helper methods for role checking
  const isAdmin = () => user?.role === "ADMIN";
  const isEmployee = () => user?.role === "EMPLOYEE";
  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin,
    isEmployee,
    hasRole,
    signin,
    signup,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
