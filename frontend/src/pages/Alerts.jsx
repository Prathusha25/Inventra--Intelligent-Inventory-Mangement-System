import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { alertService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const severityColor = {
  INFO: "text-indigo-400 bg-indigo-500/10",
  WARNING: "text-amber-400 bg-amber-500/10",
  CRITICAL: "text-rose-400 bg-rose-500/10",
};

export default function Alerts() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertService.getMyAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      toast.error("Failed to load alerts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => filterStatus === "ALL" || alert.status === filterStatus);
  }, [alerts, filterStatus]);

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledge(id);
      toast.success("Alert acknowledged");
      fetchAlerts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to acknowledge alert");
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolve(id);
      toast.success("Alert resolved");
      fetchAlerts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resolve alert");
    }
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
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-slate-400 mt-1">Track and handle low-stock and request alerts.</p>
        </div>
        <button
          onClick={fetchAlerts}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-2">
        {["ALL", "OPEN", "ACKNOWLEDGED", "RESOLVED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-2 rounded-xl text-sm border ${
              filterStatus === status
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                : "text-slate-400 border-slate-800/60"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="text-left text-slate-400 font-medium px-5 py-3">Title</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Severity</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Status</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Created</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-slate-800/40">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{alert.title}</p>
                    <p className="text-slate-400 text-xs mt-1">{alert.message}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${severityColor[alert.severity] || "text-slate-300 bg-slate-500/20"}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{alert.status}</td>
                  <td className="px-5 py-3.5 text-slate-400">{new Date(alert.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex gap-2">
                      {alert.status === "OPEN" && (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        >
                          Acknowledge
                        </button>
                      )}
                      {isAdmin && alert.status !== "RESOLVED" && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-10 text-slate-400">No alerts available.</div>
        )}
      </div>
    </div>
  );
}
