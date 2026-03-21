# Frontend RBAC Integration Guide

This guide explains how to integrate the Role-Based Access Control (RBAC) system into the React frontend.

---

## 🎯 Overview

The backend now supports two roles:
- **ADMIN** - Full system access
- **EMPLOYEE** - Limited operational access

The frontend needs to:
1. Store user role on login
2. Show/hide UI elements based on role
3. Protect routes based on role
4. Handle 403 Forbidden responses gracefully

---

## 📋 Step-by-Step Implementation

### Step 1: Update AuthContext

Update [src/context/AuthContext.jsx](../frontend/src/context/AuthContext.jsx) to include role:

```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData should include: { id, username, email, role, token }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isEmployee = () => user?.role === 'EMPLOYEE';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAdmin,
      isEmployee
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

### Step 2: Update SignIn Component

Update [src/pages/auth/SignIn.jsx](../frontend/src/pages/auth/SignIn.jsx) to handle role:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signin', formData);
      
      // Response includes: token, id, username, email, role
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role, // ADMIN or EMPLOYEE
        token: response.data.token
      };

      login(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your existing JSX
  );
}

export default SignIn;
```

---

### Step 3: Create RoleGuard Component

Create [src/components/auth/RoleGuard.jsx](../frontend/src/components/auth/RoleGuard.jsx):

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleGuard = ({ allowedRoles, children, redirectTo = '/dashboard' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

// Usage examples:
// Admin only: <RoleGuard allowedRoles={['ADMIN']}><Component /></RoleGuard>
// Both roles: <RoleGuard allowedRoles={['ADMIN', 'EMPLOYEE']}><Component /></RoleGuard>
```

---

### Step 4: Update App Routes

Update [src/App.jsx](../frontend/src/App.jsx) to protect routes:

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';

// Auth pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

// Main pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
          
          {/* All authenticated users */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Admin Only Routes */}
          <Route path="/users" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <Users />
              </RoleGuard>
            </ProtectedRoute>
          } />
          
          <Route path="/suppliers" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ADMIN']}>
                <Suppliers />
              </RoleGuard>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

### Step 5: Update Sidebar with Conditional Rendering

Update [src/components/layout/Sidebar.jsx](../frontend/src/components/layout/Sidebar.jsx):

```javascript
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { user, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/dashboard">
          📊 Dashboard
        </NavLink>
        
        <NavLink to="/inventory">
          📦 Inventory
        </NavLink>
        
        <NavLink to="/orders">
          🛒 Orders
        </NavLink>
        
        {/* Admin Only Links */}
        {isAdmin() && (
          <>
            <NavLink to="/suppliers">
              🏢 Suppliers
            </NavLink>
            
            <NavLink to="/users">
              👥 Users
            </NavLink>
          </>
        )}
        
        <NavLink to="/reports">
          📈 Reports
        </NavLink>
        
        <NavLink to="/settings">
          ⚙️ Settings
        </NavLink>
      </nav>
      
      {/* Show role badge */}
      <div className="user-info">
        <p>{user?.username}</p>
        <span className={`role-badge ${user?.role?.toLowerCase()}`}>
          {user?.role}
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
```

---

### Step 6: Create API Service Functions

Create [src/api/services.js](../frontend/src/api/services.js):

```javascript
import api from './axios';

// ============================================
// User Management (Admin Only)
// ============================================
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// ============================================
// Product Management
// ============================================
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data), // Admin only
  update: (id, data) => api.put(`/products/${id}`, data), // Admin only
  updateQuantity: (id, quantity) => api.patch(`/products/${id}/quantity?quantity=${quantity}`),
  delete: (id) => api.delete(`/products/${id}`), // Admin only
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getLowStock: () => api.get('/products/low-stock')
};

// ============================================
// Category Management
// ============================================
export const categoryService = {
  getAll: () => api.get('/categories'),
  getActive: () => api.get('/categories/active'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data), // Admin only
  update: (id, data) => api.put(`/categories/${id}`, data), // Admin only
  delete: (id) => api.delete(`/categories/${id}`) // Admin only
};

// ============================================
// Supplier Management (Admin Only)
// ============================================
export const supplierService = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
  updateRating: (id, rating) => api.patch(`/suppliers/${id}/rating?rating=${rating}`)
};

// ============================================
// Order Management
// ============================================
export const orderService = {
  getAll: () => api.get('/orders'), // Admin only
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  approve: (id) => api.post(`/orders/${id}/approve`), // Admin only
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  delete: (id) => api.delete(`/orders/${id}`) // Admin only
};

// ============================================
// Reports
// ============================================
export const reportService = {
  getStockReport: () => api.get('/reports/stock'),
  getLowStockReport: () => api.get('/reports/low-stock'),
  getSalesReport: (startDate, endDate) => 
    api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`), // Admin only
  getOrderReport: (startDate, endDate) => 
    api.get(`/reports/orders?startDate=${startDate}&endDate=${endDate}`), // Admin only
  getInventoryReport: () => api.get('/reports/inventory') // Admin only
};
```

---

### Step 7: Handle 403 Forbidden Errors

Update [src/api/axios.js](../frontend/src/api/axios.js):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('user');
      window.location.href = '/signin';
    } else if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access denied: Insufficient permissions');
      // You can show a toast notification here
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Step 8: Conditional UI Elements in Components

Example for Inventory page with role-based buttons:

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../api/services';

function Inventory() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await productService.updateQuantity(productId, newQuantity);
      loadProducts(); // Reload
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!isAdmin()) return; // Extra check
    
    if (window.confirm('Are you sure?')) {
      try {
        await productService.delete(productId);
        loadProducts(); // Reload
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="inventory-page">
      <div className="header">
        <h1>Inventory Management</h1>
        
        {/* Admin Only: Add Product Button */}
        {isAdmin() && (
          <button onClick={() => navigate('/inventory/new')}>
            + Add Product
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleUpdateQuantity(product.id, e.target.value)}
                />
              </td>
              <td>${product.price}</td>
              <td>
                {/* Admin Only: Edit and Delete buttons */}
                {isAdmin() && (
                  <>
                    <button onClick={() => navigate(`/inventory/edit/${product.id}`)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
```

---

## 🎨 Styling Role Badges

Add to your CSS:

```css
/* Role Badge Styles */
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #dc3545;
  color: white;
}

.role-badge.employee {
  background-color: #17a2b8;
  color: white;
}

/* Disabled button style for non-admin users */
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 🧪 Testing Checklist

### Admin User
- [ ] Can see "Users" and "Suppliers" in sidebar
- [ ] Can access /users and /suppliers pages
- [ ] Can see "Add Product", "Edit", "Delete" buttons in inventory
- [ ] Can approve orders
- [ ] Can view all orders
- [ ] Can generate all types of reports

### Employee User
- [ ] Cannot see "Users" and "Suppliers" in sidebar
- [ ] Redirected when trying to access /users or /suppliers
- [ ] Can see products but no "Add Product", "Edit", "Delete" buttons
- [ ] Can update product quantities
- [ ] Can create orders
- [ ] Can view only own orders
- [ ] Can view basic reports only

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (if not already done)
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📝 New Pages to Create

1. **Users Page** (`src/pages/Users.jsx`) - Admin only
   - List all users
   - Edit user roles
   - Delete users

2. **Suppliers Page** (`src/pages/Suppliers.jsx`) - Admin only
   - List suppliers
   - Add/edit/delete suppliers
   - View performance ratings

3. **Orders Page Updates** (`src/pages/Orders.jsx`)
   - Show all orders for admin
   - Show only own orders for employees
   - Add approve button for admin

4. **Reports Page Updates** (`src/pages/Reports.jsx`)
   - Show all reports for admin
   - Show limited reports for employees
   - Add date range pickers

---

## 🔧 Troubleshooting

### Issue: Role not persisting after refresh
**Solution:** Check localStorage and axios interceptor setup in AuthContext

### Issue: 403 errors even with correct role
**Solution:** Verify JWT token is being sent in Authorization header

### Issue: Sidebar links showing for wrong role
**Solution:** Check isAdmin() function is working correctly

### Issue: User redirected to signin after role-based navigation
**Solution:** Ensure RoleGuard checks loading state before redirecting

---

## 📚 Resources

- Backend RBAC Documentation: `backend/README_RBAC.md`
- Backend Implementation Summary: `backend/IMPLEMENTATION_SUMMARY.md`
- API Endpoints: See backend documentation
- Authentication Guide: `backend/README_AUTH.md`

---

## ✨ Summary

To integrate RBAC in frontend:
1. ✅ Update AuthContext with role support
2. ✅ Create RoleGuard component
3. ✅ Protect routes in App.jsx
4. ✅ Update Sidebar with conditional rendering
5. ✅ Create API service functions
6. ✅ Add role-based UI elements in components
7. ✅ Handle 403 errors gracefully
8. ✅ Test with both admin and employee users

**The frontend is now ready to support the RBAC system! 🎉**
