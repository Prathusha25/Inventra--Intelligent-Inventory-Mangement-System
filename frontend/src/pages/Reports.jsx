import {
  HiArrowTrendingUp,
  HiCube,
  HiShoppingCart,
  HiCurrencyDollar,
  HiUserGroup,
  HiExclamationTriangle,
} from "react-icons/hi2";

const summaryCards = [
  { label: "Total Revenue", value: "$148,290", change: "+18.7%", icon: HiCurrencyDollar, color: "emerald" },
  { label: "Products Sold", value: "3,548", change: "+12.3%", icon: HiShoppingCart, color: "indigo" },
  { label: "Active Suppliers", value: "24", change: "+2", icon: HiUserGroup, color: "violet" },
  { label: "Stock Alerts", value: "7", change: "-3", icon: HiExclamationTriangle, color: "amber" },
];

const monthlySales = [
  { month: "Sep", revenue: 32000 },
  { month: "Oct", revenue: 38000 },
  { month: "Nov", revenue: 42000 },
  { month: "Dec", revenue: 55000 },
  { month: "Jan", revenue: 48000 },
  { month: "Feb", revenue: 48290 },
];

const categoryBreakdown = [
  { name: "Peripherals", value: 42, color: "bg-indigo-400" },
  { name: "Accessories", value: 25, color: "bg-emerald-400" },
  { name: "Displays", value: 15, color: "bg-violet-400" },
  { name: "Storage", value: 12, color: "bg-amber-400" },
  { name: "Audio", value: 6, color: "bg-rose-400" },
];

const colorMap = {
  emerald: "bg-emerald-500/10 text-emerald-400",
  indigo: "bg-indigo-500/10 text-indigo-400",
  violet: "bg-violet-500/10 text-violet-400",
  amber: "bg-amber-500/10 text-amber-400",
};

export default function Reports() {
  const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-slate-400 mt-1">
          Overview of your inventory performance
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 rounded-xl ${colorMap[card.color].split(" ")[0]}`}
              >
                <card.icon
                  className={`h-5 w-5 ${colorMap[card.color].split(" ")[1]}`}
                />
              </div>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <HiArrowTrendingUp className="h-3 w-3" />
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart (simple bar chart) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5">
          <h2 className="text-lg font-semibold text-white mb-6">
            Monthly Revenue
          </h2>
          <div className="flex items-end gap-3 h-48">
            {monthlySales.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400">
                  ${(m.revenue / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600/80 to-indigo-400/80 transition-all duration-500 hover:from-indigo-500 hover:to-indigo-300"
                  style={{
                    height: `${(m.revenue / maxRevenue) * 100}%`,
                    minHeight: "8px",
                  }}
                />
                <span className="text-xs text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5">
          <h2 className="text-lg font-semibold text-white mb-6">
            Category Breakdown
          </h2>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300">{cat.name}</span>
                  <span className="text-sm text-slate-400">{cat.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory health summary */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Inventory Health Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-2">
              <HiCube className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Healthy Stock</span>
            </div>
            <p className="text-3xl font-bold text-white">2,412</p>
            <p className="text-sm text-slate-400 mt-1">items above threshold</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 mb-2">
              <HiExclamationTriangle className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Low Stock</span>
            </div>
            <p className="text-3xl font-bold text-white">23</p>
            <p className="text-sm text-slate-400 mt-1">items need reorder</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <div className="flex items-center gap-2 mb-2">
              <HiCube className="h-5 w-5 text-rose-400" />
              <span className="text-sm font-medium text-rose-400">Out of Stock</span>
            </div>
            <p className="text-3xl font-bold text-white">4</p>
            <p className="text-sm text-slate-400 mt-1">items unavailable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
