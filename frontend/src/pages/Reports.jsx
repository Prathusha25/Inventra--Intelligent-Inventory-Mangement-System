import { useEffect, useMemo, useState } from "react";
import {
  HiArrowDownTray,
  HiChartBar,
  HiCube,
  HiExclamationTriangle,
  HiTableCells,
  HiListBullet,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { alertService, reportService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const STATUS_COLORS = ["#38bdf8", "#f59e0b", "#f43f5e", "#22c55e", "#a78bfa"];

export default function Reports() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [stockReport, setStockReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [lowStockReport, setLowStockReport] = useState(null);
  const [auditLogReport, setAuditLogReport] = useState(null);
  const [openAlertCount, setOpenAlertCount] = useState(0);

  useEffect(() => {
    loadReports();
  }, [isAdmin]);

  const loadReports = async () => {
    try {
      setLoading(true);

      const requests = [
        reportService.getStockReport(),
        reportService.getLowStockReport(),
        alertService.getOpenCount(),
      ];

      if (isAdmin) {
        requests.push(reportService.getInventoryReport());
        requests.push(reportService.getAuditLogReport());
      }

      const responses = await Promise.all(requests);

      setStockReport(responses[0].data);
      setLowStockReport(responses[1].data);
      setOpenAlertCount(responses[2].data?.count || 0);

      if (isAdmin) {
        setInventoryReport(responses[3].data);
        setAuditLogReport(responses[4].data);
      }
    } catch (error) {
      toast.error("Failed to load reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockItems = useMemo(() => {
    return lowStockReport?.data?.lowStockProducts || [];
  }, [lowStockReport]);

  const categoryBreakdown = useMemo(() => {
    const map = stockReport?.data?.productsByCategory || {};
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [stockReport]);

  const stockStatusData = useMemo(
    () => [
      { name: "In Stock", value: stockReport?.data?.inStockCount || 0 },
      { name: "Low Stock", value: stockReport?.data?.lowStockCount || 0 },
      { name: "Out Of Stock", value: stockReport?.data?.outOfStockCount || 0 },
    ],
    [stockReport]
  );

  const auditActionsData = useMemo(() => {
    const map = auditLogReport?.data?.actionsByType || {};
    return Object.entries(map)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [auditLogReport]);

  const exportRows = useMemo(() => {
    const rows = [];

    rows.push(
      {
        section: "SUMMARY",
        metric: "Total Products",
        value: stockReport?.data?.totalProducts || 0,
      },
      {
        section: "SUMMARY",
        metric: "Low Stock Count",
        value: stockReport?.data?.lowStockCount || 0,
      },
      {
        section: "SUMMARY",
        metric: "Open Alerts",
        value: openAlertCount,
      }
    );

    categoryBreakdown.forEach((category) => {
      rows.push({
        section: "CATEGORY_BREAKDOWN",
        metric: category.name,
        value: category.count,
      });
    });

    lowStockItems.forEach((item) => {
      rows.push({
        section: "LOW_STOCK_PRODUCTS",
        metric: `${item.name} (${item.sku})`,
        value: item.quantity,
      });
    });

    (auditLogReport?.data?.logs || []).slice(0, 100).forEach((log) => {
      rows.push({
        section: "AUDIT_LOG",
        metric: `${log.action} - ${log.entityType}#${log.entityId}`,
        value: log.description,
        actorRole: log.actorRole,
        createdAt: log.createdAt,
      });
    });

    return rows;
  }, [auditLogReport, categoryBreakdown, lowStockItems, openAlertCount, stockReport]);

  const handleExportCsv = () => {
    if (exportRows.length === 0) {
      toast.error("No report data available to export");
      return;
    }

    const headers = Object.keys(exportRows[0]);
    const csvLines = [
      headers.join(","),
      ...exportRows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? "";
            const escaped = String(value).replaceAll('"', '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV report generated");
  };

  const handleExportExcel = () => {
    if (exportRows.length === 0) {
      toast.error("No report data available to export");
      return;
    }

    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([
      { metric: "Total Products", value: stockReport?.data?.totalProducts || 0 },
      { metric: "Low Stock Count", value: stockReport?.data?.lowStockCount || 0 },
      { metric: "Open Alerts", value: openAlertCount },
      {
        metric: "Total Inventory Value",
        value: inventoryReport?.summary?.totalInventoryValue || 0,
      },
    ]);

    const lowStockSheet = XLSX.utils.json_to_sheet(lowStockItems);
    const categorySheet = XLSX.utils.json_to_sheet(categoryBreakdown);
    const auditSheet = XLSX.utils.json_to_sheet((auditLogReport?.data?.logs || []).slice(0, 100));

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, lowStockSheet, "LowStock");
    XLSX.utils.book_append_sheet(workbook, categorySheet, "Categories");
    if (isAdmin) {
      XLSX.utils.book_append_sheet(workbook, auditSheet, "AuditLogs");
    }

    XLSX.writeFile(workbook, `inventory-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Excel report generated");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Logs</h1>
          <p className="text-slate-400 mt-1">Live inventory, alerts and audit visibility.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            <HiTableCells className="h-4 w-4" /> CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600"
          >
            <HiArrowDownTray className="h-4 w-4" /> Excel
          </button>
          <button
            onClick={loadReports}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard
          label="Total Products"
          value={stockReport?.data?.totalProducts || 0}
          icon={HiCube}
          color="text-indigo-400"
        />
        <ReportCard
          label="Low Stock"
          value={stockReport?.data?.lowStockCount || 0}
          icon={HiExclamationTriangle}
          color="text-amber-400"
        />
        <ReportCard
          label="Open Alerts"
          value={openAlertCount}
          icon={HiChartBar}
          color="text-rose-400"
        />
        <ReportCard
          label="Audit Events"
          value={auditLogReport?.data?.totalLogs || 0}
          icon={HiListBullet}
          color="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Stock Status Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={92}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Products By Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" angle={-20} textAnchor="end" height={52} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Low Stock Items</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {lowStockItems.length === 0 && <p className="text-slate-400">No low stock items.</p>}
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-xs text-slate-400">SKU: {item.sku}</p>
              <p className="text-sm text-amber-400 mt-1">
                Qty: {item.quantity} | Status: {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Top Audit Actions</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={auditActionsData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 24, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                  <YAxis type="category" dataKey="action" stroke="#94a3b8" width={160} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#a78bfa" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Audit Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="text-left text-slate-400 font-medium py-2">Time</th>
                    <th className="text-left text-slate-400 font-medium py-2">Action</th>
                    <th className="text-left text-slate-400 font-medium py-2">Entity</th>
                    <th className="text-left text-slate-400 font-medium py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditLogReport?.data?.logs || []).slice(0, 15).map((log) => (
                    <tr key={log.id} className="border-b border-slate-800/40">
                      <td className="py-2 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-2 text-indigo-400">{log.action}</td>
                      <td className="py-2 text-slate-300">{log.entityType} #{log.entityId}</td>
                      <td className="py-2 text-white">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isAdmin && inventoryReport?.summary?.totalInventoryValue != null && (
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
          <h2 className="text-lg font-semibold text-white mb-2">Inventory Value</h2>
          <p className="text-3xl font-bold text-emerald-400">
            ${Number(inventoryReport.summary.totalInventoryValue).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

function ReportCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}
