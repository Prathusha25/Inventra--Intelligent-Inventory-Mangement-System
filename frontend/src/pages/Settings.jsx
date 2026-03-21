import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { HiUser, HiEnvelope, HiShieldCheck, HiBell, HiPaintBrush, HiCheck } from "react-icons/hi2";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    lowStock: true,
    orderUpdates: true,
    newSupplier: false,
    reports: true,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile section */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <HiUser className="h-5 w-5 text-indigo-400" />
          Profile Information
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white font-medium text-lg">{user?.username || "User"}</p>
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <HiShieldCheck className="h-4 w-4" />
                {user?.role || "EMPLOYEE"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ""}
                readOnly
                className="w-full rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Role
              </label>
              <input
                type="text"
                value={user?.role || ""}
                readOnly
                className="w-full rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications section */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <HiBell className="h-5 w-5 text-indigo-400" />
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            { key: "lowStock", label: "Low Stock Alerts", desc: "Get notified when items fall below threshold" },
            { key: "orderUpdates", label: "Order Updates", desc: "Receive updates on order status changes" },
            { key: "newSupplier", label: "New Supplier Activity", desc: "Notifications for new supplier registrations" },
            { key: "reports", label: "Weekly Reports", desc: "Receive weekly inventory summary reports" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key],
                  }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  notifications[item.key] ? "bg-indigo-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    notifications[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <HiPaintBrush className="h-5 w-5 text-indigo-400" />
          Appearance
        </h2>
        <p className="text-slate-400 text-sm mb-4">Choose your preferred theme</p>
        <div className="flex gap-3">
          <button 
            onClick={() => setTheme("dark")}
            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              theme === "dark" 
                ? "border-2 border-indigo-500 bg-indigo-500/10 text-white" 
                : "border border-slate-800/60 bg-slate-900/40 text-slate-400 hover:border-slate-700/60"
            }`}
          >
            {theme === "dark" && (
              <HiCheck className="inline-block h-4 w-4 mr-1.5" />
            )}
            Dark
          </button>
          <button 
            onClick={() => setTheme("light")}
            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              theme === "light" 
                ? "border-2 border-indigo-500 bg-indigo-500/10 text-white" 
                : "border border-slate-800/60 bg-slate-900/40 text-slate-400 hover:border-slate-700/60"
            }`}
          >
            {theme === "light" && (
              <HiCheck className="inline-block h-4 w-4 mr-1.5" />
            )}
            Light
          </button>
          <button 
            onClick={() => setTheme("system")}
            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              theme === "system" 
                ? "border-2 border-indigo-500 bg-indigo-500/10 text-white" 
                : "border border-slate-800/60 bg-slate-900/40 text-slate-400 hover:border-slate-700/60"
            }`}
          >
            {theme === "system" && (
              <HiCheck className="inline-block h-4 w-4 mr-1.5" />
            )}
            System
          </button>
        </div>
        <p className="text-slate-500 text-xs mt-3">
          {theme === "system" 
            ? "Theme will match your system preferences" 
            : `Current theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`
          }
        </p>
      </div>
    </div>
  );
}
