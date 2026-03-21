import { useAuth } from "../context/AuthContext";
import {
  HiCube,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiExclamationTriangle,
  HiShoppingCart,
} from "react-icons/hi2";

const stats = [
  {
    label: "Total Products",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: HiCube,
    color: "indigo",
  },
  {
    label: "Low Stock Items",
    value: "23",
    change: "-8.3%",
    trend: "down",
    icon: HiExclamationTriangle,
    color: "amber",
  },
  {
    label: "Pending Orders",
    value: "156",
    change: "+24.1%",
    trend: "up",
    icon: HiShoppingCart,
    color: "emerald",
  },
  {
    label: "Revenue (MTD)",
    value: "$48,290",
    change: "+18.7%",
    trend: "up",
    icon: HiArrowTrendingUp,
    color: "violet",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Product Added",
    item: "Wireless Mouse MX-200",
    user: "admin",
    time: "2 mins ago",
    type: "add",
  },
  {
    id: 2,
    action: "Stock Updated",
    item: "USB-C Hub 7-in-1",
    user: "admin",
    time: "15 mins ago",
    type: "update",
  },
  {
    id: 3,
    action: "Low Stock Alert",
    item: "Mechanical Keyboard K95",
    user: "system",
    time: "1 hour ago",
    type: "alert",
  },
  {
    id: 4,
    action: "Order Shipped",
    item: "Order #INV-2847",
    user: "admin",
    time: "2 hours ago",
    type: "ship",
  },
  {
    id: 5,
    action: "Supplier Added",
    item: "TechParts Global Ltd.",
    user: "admin",
    time: "3 hours ago",
    type: "add",
  },
];

const topProducts = [
  { name: "Wireless Mouse MX-200", stock: 342, sold: 1205, revenue: "$18,075" },
  { name: "USB-C Hub 7-in-1", stock: 156, sold: 890, revenue: "$22,250" },
  { name: "Mechanical Keyboard K95", stock: 8, sold: 652, revenue: "$45,640" },
  { name: '27" Monitor UltraWide', stock: 67, sold: 423, revenue: "$84,600" },
  { name: "Webcam HD Pro 1080p", stock: 234, sold: 378, revenue: "$11,340" },
];

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.username || "User"}
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s what&apos;s happening with your inventory today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5 hover:border-slate-700/60 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${colors.bg}`}>
                  <stat.icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${
                    stat.trend === "up" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <HiArrowTrendingUp className="h-3 w-3" />
                  ) : (
                    <HiArrowTrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 py-2.5 border-b border-slate-800/40 last:border-0"
              >
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === "add"
                      ? "bg-emerald-400"
                      : activity.type === "update"
                      ? "bg-indigo-400"
                      : activity.type === "alert"
                      ? "bg-amber-400"
                      : "bg-violet-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400 truncate">{activity.item}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products table */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left text-slate-400 font-medium pb-3">Product</th>
                  <th className="text-right text-slate-400 font-medium pb-3">Stock</th>
                  <th className="text-right text-slate-400 font-medium pb-3">Sold</th>
                  <th className="text-right text-slate-400 font-medium pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr
                    key={product.name}
                    className="border-b border-slate-800/40 last:border-0"
                  >
                    <td className="py-3 text-white">{product.name}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`${
                          product.stock < 20 ? "text-amber-400" : "text-slate-300"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-300">{product.sold}</td>
                    <td className="py-3 text-right text-emerald-400">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
