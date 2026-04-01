import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiFunnel,
  HiPencilSquare,
  HiTrash,
  HiArrowPath,
  HiXMark,
  HiExclamationTriangle,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { productAPI } from "../api/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const statusColors = {
  "In Stock": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "Low Stock": "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "Out of Stock": "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

export default function Inventory() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    minThreshold: 10,
    price: 0,
    supplier: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Cleanup: restore body scroll on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(["All", ...response.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        minThreshold: product.minThreshold ?? 10,
        price: product.price,
        supplier: product.supplier || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        minThreshold: 10,
        price: 0,
        supplier: "",
      });
    }
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      quantity: 0,
      minThreshold: 10,
      price: 0,
      supplier: "",
    });
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'unset';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update product
        const updateData = {
          name: formData.name,
          category: formData.category,
          quantity: parseInt(formData.quantity),
          minThreshold: parseInt(formData.minThreshold),
          price: parseFloat(formData.price),
          supplier: formData.supplier,
        };
        await productAPI.update(editingProduct.id, updateData);
        toast.success("Product updated successfully");
      } else {
        // Create product
        const createData = {
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          quantity: parseInt(formData.quantity),
          minThreshold: parseInt(formData.minThreshold),
          price: parseFloat(formData.price),
          supplier: formData.supplier,
        };
        await productAPI.create(createData);
        toast.success("Product created successfully");
      }
      fetchProducts();
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.delete(id);
      toast.success("Product deleted successfully");
      fetchProducts();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 mt-1">Manage your products and stock levels</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          onClick={() => handleOpenModal()}
          disabled={!isAdmin}
          title={!isAdmin ? "Only admins can add products" : "Add new product"}
        >
          <HiPlus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white placeholder-slate-500 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-white focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button className="p-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700/60 transition-all"
          onClick={fetchProducts}
          title="Refresh products"
        >
          <HiArrowPath className="h-5 w-5" />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/60">
                <th className="text-left text-slate-400 font-medium px-5 py-3">Product</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">SKU</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Category</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Qty</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Threshold</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Price</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Supplier</th>
                <th className="text-left text-slate-400 font-medium px-5 py-3">Status</th>
                <th className="text-right text-slate-400 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-white font-medium">{product.name}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                    {product.sku}
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{product.category}</td>
                  <td className="px-5 py-3.5 text-right text-slate-300">
                    {product.quantity}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-300">
                    {product.minThreshold}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-300">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{product.supplier}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[product.status]
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                        onClick={() => handleOpenModal(product)}
                        disabled={!isAdmin}
                        title={!isAdmin ? "Only admins can edit" : "Edit product"}
                      >
                        <HiPencilSquare className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                        onClick={() => setDeleteConfirm(product.id)}
                        disabled={!isAdmin}
                        title={!isAdmin ? "Only admins can delete" : "Delete product"}
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full my-auto shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <HiXMark className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    disabled={!!editingProduct}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter SKU"
                  />
                  {editingProduct && (
                    <p className="text-xs text-slate-500 mt-1">SKU cannot be changed</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter category"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Min Threshold *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Stock alert threshold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full my-auto shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <HiExclamationTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Product</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
