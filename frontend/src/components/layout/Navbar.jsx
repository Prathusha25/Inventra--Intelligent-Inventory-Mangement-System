import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { alertService } from "../../api/services";
import {
  HiBars3,
  HiBell,
  HiArrowRightOnRectangle,
  HiUser,
  HiChevronDown,
} from "react-icons/hi2";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openAlertCount, setOpenAlertCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await alertService.getOpenCount();
        setOpenAlertCount(response.data?.count || 0);
      } catch (error) {
        console.error("Failed to fetch open alerts count", error);
      }
    };

    fetchAlertCount();
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 relative z-50">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <HiBars3 className="h-5 w-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          onClick={() => navigate("/alerts")}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <HiBell className="h-5 w-5" />
          {openAlertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center">
              {openAlertCount > 9 ? "9+" : openAlertCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-none">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.role || "Employee"}</p>
            </div>
            <HiChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800/60 bg-slate-950/95 backdrop-blur-xl shadow-xl py-1 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-800/60">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-slate-800/60 transition-colors"
              >
                <HiArrowRightOnRectangle className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
