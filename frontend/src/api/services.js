import api from "./axios";

// ============================================
// User Management (Admin Only)
// ============================================
export const userService = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ============================================
// Product Management
// ============================================
export const productService = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data), // Admin only
  update: (id, data) => api.put(`/products/${id}`, data), // Admin only
  updateQuantity: (id, quantity) => api.patch(`/products/${id}/quantity?quantity=${quantity}`),
  delete: (id) => api.delete(`/products/${id}`), // Admin only
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getByStatus: (status) => api.get(`/products/status/${status}`),
  getCategories: () => api.get("/products/categories"),
  getLowStock: () => api.get("/products/low-stock"),
  getOutOfStock: () => api.get("/products/out-of-stock"),
};

// ============================================
// Category Management
// ============================================
export const categoryService = {
  getAll: () => api.get("/categories"),
  getActive: () => api.get("/categories/active"),
  getById: (id) => api.get(`/categories/${id}`),
  getSubcategories: (id) => api.get(`/categories/${id}/subcategories`),
  create: (data) => api.post("/categories", data), // Admin only
  update: (id, data) => api.put(`/categories/${id}`, data), // Admin only
  delete: (id) => api.delete(`/categories/${id}`), // Admin only
};

// ============================================
// Supplier Management (Admin Only)
// ============================================
export const supplierService = {
  getAll: () => api.get("/suppliers"),
  getById: (id) => api.get(`/suppliers/${id}`),
  getByStatus: (status) => api.get(`/suppliers/status/${status}`),
  search: (keyword) => api.get(`/suppliers/search?keyword=${keyword}`),
  getTopRated: (minRating = 4.0) => api.get(`/suppliers/top-rated?minRating=${minRating}`),
  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  updateRating: (id, rating) => api.patch(`/suppliers/${id}/rating?rating=${rating}`),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// ============================================
// Order Management
// ============================================
export const orderService = {
  getAll: () => api.get("/orders"), // Admin only
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getByUserId: (userId) => api.get(`/orders/user/${userId}`),
  getByStatus: (status) => api.get(`/orders/status/${status}`), // Admin only
  getByDateRange: (startDate, endDate) =>
    api.get(`/orders/date-range?startDate=${startDate}&endDate=${endDate}`), // Admin only
  create: (data) => api.post("/orders", data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  approve: (id) => api.post(`/orders/${id}/approve`), // Admin only
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  delete: (id) => api.delete(`/orders/${id}`), // Admin only
};

// ============================================
// Reports
// ============================================
export const reportService = {
  getStockReport: () => api.get("/reports/stock"),
  getLowStockReport: () => api.get("/reports/low-stock"),
  getSalesReport: (startDate, endDate) =>
    api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`), // Admin only
  getOrderReport: (startDate, endDate) =>
    api.get(`/reports/orders?startDate=${startDate}&endDate=${endDate}`), // Admin only
  getInventoryReport: () => api.get("/reports/inventory"), // Admin only
  getAuditLogReport: () => api.get("/reports/audit-logs"), // Admin only
};

// ============================================
// Alert Management
// ============================================
export const alertService = {
  getMyAlerts: () => api.get("/alerts/my"),
  getOpenAlerts: () => api.get("/alerts/open"), // Admin only
  getOpenCount: () => api.get("/alerts/open/count"),
  acknowledge: (id) => api.post(`/alerts/${id}/acknowledge`),
  resolve: (id) => api.post(`/alerts/${id}/resolve`), // Admin only
};

// ============================================
// Audit Logs (Admin Only)
// ============================================
export const auditLogService = {
  getRecent: () => api.get("/audit-logs"),
  getByEntityType: (entityType) => api.get(`/audit-logs/entity/${entityType}`),
};

// Export default object with all services
const apiServices = {
  users: userService,
  products: productService,
  categories: categoryService,
  suppliers: supplierService,
  orders: orderService,
  reports: reportService,
  alerts: alertService,
  auditLogs: auditLogService,
};

export default apiServices;
