import { useEffect, useMemo, useState } from "react";
import {
  HiCheck,
  HiClock,
  HiMagnifyingGlass,
  HiPlus,
  HiXMark,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { orderService, productService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const statusStyles = {
  PENDING: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-emerald-500/10 text-emerald-400",
  CANCELLED: "bg-rose-500/10 text-rose-400",
};

export default function Orders() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [requestForm, setRequestForm] = useState({
    productId: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        isAdmin ? orderService.getAll() : orderService.getMyOrders(),
        productService.getAll(),
      ]);

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      toast.error("Failed to load orders data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();
      const matchSearch =
        order.orderNumber?.toLowerCase().includes(q) ||
        String(order.userId || "").includes(q);
      const matchStatus = filterStatus === "ALL" || order.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      approved: orders.filter((o) => o.status === "APPROVED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    const selectedProduct = products.find((p) => String(p.id) === String(requestForm.productId));
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (requestForm.quantity < 1) {
      toast.error("Quantity should be at least 1");
      return;
    }

    const payload = {
      userId: user?.id,
      orderType: "PURCHASE",
      status: "PENDING",
      totalAmount: 0,
      notes: requestForm.notes,
      orderItems: [
        {
          productId: selectedProduct.id,
          quantity: Number(requestForm.quantity),
          unitPrice: selectedProduct.price,
        },
      ],
    };

    try {
      setSubmitting(true);
      await orderService.create(payload);
      toast.success("Stock-in request submitted");
      setRequestForm({ productId: "", quantity: 1, notes: "" });
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await orderService.approve(orderId);
      toast.success("Request approved and stock updated");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancel(orderId);
      toast.success("Request cancelled");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
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
      <div>
        <h1 className="text-2xl font-bold text-white">Stock Requests</h1>
        <p className="text-slate-400 mt-1">
          Employees can request stock-in. Admins can approve and update inventory.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={orderStats.total} className="text-white" />
        <StatCard label="Pending" value={orderStats.pending} className="text-amber-400" />
        <StatCard label="Approved" value={orderStats.approved} className="text-emerald-400" />
        <StatCard label="Cancelled" value={orderStats.cancelled} className="text-rose-400" />
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Create Stock-In Request</h2>
        <form onSubmit={handleCreateRequest} className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <select
            value={requestForm.productId}
            onChange={(e) => setRequestForm({ ...requestForm, productId: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white"
            required
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={requestForm.quantity}
            onChange={(e) => setRequestForm({ ...requestForm, quantity: Number(e.target.value) })}
            className="px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white"
            placeholder="Quantity"
            required
          />

          <input
            type="text"
            value={requestForm.notes}
            onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white"
            placeholder="Optional note"
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
          >
            <HiPlus className="h-5 w-5" />
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or employee id"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/60">
                <th className="text-left text-slate-400 font-medium px-5 py-3">Order</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Type</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Requested By</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Items</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Total</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Status</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Date</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/40">
                  <td className="px-5 py-3.5 text-indigo-400 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-5 py-3.5 text-white">{order.orderType}</td>
                  <td className="px-5 py-3.5 text-slate-300">User #{order.userId}</td>
                  <td className="px-5 py-3.5 text-right text-slate-300">{order.orderItems?.length || 0}</td>
                  <td className="px-5 py-3.5 text-right text-slate-300">${Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status] || "bg-slate-500/20 text-slate-300"}`}>
                      {order.status === "PENDING" ? <HiClock className="h-3 w-3" /> : order.status === "APPROVED" ? <HiCheck className="h-3 w-3" /> : <HiXMark className="h-3 w-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{new Date(order.orderDate).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex gap-2">
                      {isAdmin && order.status === "PENDING" && (
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        >
                          Approve
                        </button>
                      )}
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-slate-400">No stock requests found.</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, className }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-4">
      <p className={`text-2xl font-bold ${className}`}>{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
