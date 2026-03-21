import { useState } from "react";
import {
  HiMagnifyingGlass,
  HiEye,
  HiTruck,
  HiCheck,
  HiClock,
  HiXMark,
} from "react-icons/hi2";

const mockOrders = [
  { id: "INV-2847", customer: "Acme Corp", items: 5, total: "$1,250.00", date: "2026-02-13", status: "Processing" },
  { id: "INV-2846", customer: "Global Tech", items: 3, total: "$890.00", date: "2026-02-12", status: "Shipped" },
  { id: "INV-2845", customer: "RetailMax", items: 12, total: "$3,450.00", date: "2026-02-12", status: "Delivered" },
  { id: "INV-2844", customer: "DataFlow Inc", items: 2, total: "$420.00", date: "2026-02-11", status: "Processing" },
  { id: "INV-2843", customer: "SmartBuy LLC", items: 8, total: "$2,100.00", date: "2026-02-11", status: "Delivered" },
  { id: "INV-2842", customer: "TechHub", items: 1, total: "$200.00", date: "2026-02-10", status: "Cancelled" },
  { id: "INV-2841", customer: "OfficeTree", items: 6, total: "$1,680.00", date: "2026-02-10", status: "Shipped" },
  { id: "INV-2840", customer: "Nexus Corp", items: 4, total: "$960.00", date: "2026-02-09", status: "Delivered" },
];

const statusConfig = {
  Processing: { color: "bg-amber-500/10 text-amber-400", icon: HiClock },
  Shipped: { color: "bg-indigo-500/10 text-indigo-400", icon: HiTruck },
  Delivered: { color: "bg-emerald-500/10 text-emerald-400", icon: HiCheck },
  Cancelled: { color: "bg-rose-500/10 text-rose-400", icon: HiXMark },
};

export default function Orders() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filtered = mockOrders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const orderStats = {
    total: mockOrders.length,
    processing: mockOrders.filter((o) => o.status === "Processing").length,
    shipped: mockOrders.filter((o) => o.status === "Shipped").length,
    delivered: mockOrders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 mt-1">Track and manage customer orders</p>
      </div>

      {/* Order stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orderStats.total, color: "text-white" },
          { label: "Processing", value: orderStats.processing, color: "text-amber-400" },
          { label: "Shipped", value: orderStats.shipped, color: "text-indigo-400" },
          { label: "Delivered", value: orderStats.delivered, color: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white placeholder-slate-500 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === status
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 border border-slate-800/60 hover:border-slate-700/60 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/60">
                <th className="text-left text-slate-400 font-medium px-5 py-3">Order ID</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Customer</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Items</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Total</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Date</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Status</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-indigo-400 font-mono text-xs font-medium">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5 text-white">{order.customer}</td>
                    <td className="px-5 py-3.5 text-right text-slate-300">{order.items}</td>
                    <td className="px-5 py-3.5 text-right text-white font-medium">
                      {order.total}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{order.date}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all">
                        <HiEye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No orders found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
