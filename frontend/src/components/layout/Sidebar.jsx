import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HiCube,
  HiHome,
  HiArchiveBox,
  HiTruck,
  HiClipboardDocumentList,
  HiChartBar,
  HiCog6Tooth,
  HiXMark,
  HiUsers,
} from "react-icons/hi2";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: HiHome },
  { path: "/inventory", label: "Inventory", icon: HiArchiveBox },
  { path: "/orders", label: "Orders", icon: HiClipboardDocumentList },
  { path: "/reports", label: "Reports", icon: HiChartBar },
  { path: "/settings", label: "Settings", icon: HiCog6Tooth },
];

const adminOnlyItems = [
  { path: "/suppliers", label: "Suppliers", icon: HiTruck, insertAt: 3 },
  { path: "/users", label: "Users", icon: HiUsers, insertAt: 1 },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Combine nav items based on role, inserting admin items at specific positions
  const displayedNavItems = isAdmin 
    ? [...navItems].reduce((acc, item, index) => {
        acc.push(item);
        // Insert admin items at their designated positions
        const adminItemsAtThisPosition = adminOnlyItems.filter(ai => ai.insertAt === index + 1);
        adminItemsAtThisPosition.forEach(ai => acc.push(ai));
        return acc;
      }, [])
    : navItems;
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/60
          transform transition-transform duration-300 ease-in-out flex flex-col
          lg:translate-x-0 lg:relative lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500">
              <HiCube className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Inventra
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {displayedNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom branding */}
        <div className="p-4 border-t border-slate-800/60 mt-auto">
          <div className="text-xs text-slate-500 text-center">
            Inventra v1.0.0
            <br />
            Intelligent Inventory Management
          </div>
        </div>
      </aside>
    </>
  );
}
