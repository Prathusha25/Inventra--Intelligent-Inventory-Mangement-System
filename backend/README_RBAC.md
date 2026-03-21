# Role-Based Access Control (RBAC) Implementation Guide

## Overview
The Inventory Management System implements a comprehensive Role-Based Access Control (RBAC) system with two distinct roles: **ADMIN** and **EMPLOYEE**. This document outlines the permissions, capabilities, and API endpoints available to each role.

---

## Roles

### 1. **ADMIN** - Full System Access
Administrators have complete control over the system with full CRUD operations on all entities.

### 2. **EMPLOYEE** - Limited Operational Access
Employees have restricted access focused on day-to-day operational tasks.

---

## Feature Access Matrix

| Feature | ADMIN | EMPLOYEE | Notes |
|---------|-------|----------|-------|
| **User Management** |
| View all users | ✅ | ❌ | |
| Create users | ✅ | ❌ | Via signup |
| Update user roles | ✅ | ❌ | |
| Delete users | ✅ | ❌ | |
| Update own profile | ✅ | ✅ | |
| **Product Management** |
| View products | ✅ | ✅ | |
| Add products | ✅ | ❌ | |
| Edit products | ✅ | ❌ | |
| Delete products | ✅ | ❌ | |
| Update stock quantity | ✅ | ✅ | Both can adjust inventory |
| Search products | ✅ | ✅ | |
| **Category Management** |
| View categories | ✅ | ✅ | |
| Add categories | ✅ | ❌ | |
| Edit categories | ✅ | ❌ | |
| Delete categories | ✅ | ❌ | |
| **Supplier Management** |
| View suppliers | ✅ | ❌ | |
| Add suppliers | ✅ | ❌ | |
| Edit suppliers | ✅ | ❌ | |
| Delete suppliers | ✅ | ❌ | |
| Update performance rating | ✅ | ❌ | |
| **Order Management** |
| View all orders | ✅ | ❌ | |
| View own orders | ✅ | ✅ | |
| Create orders | ✅ | ✅ | |
| Update orders | ✅ | ✅* | *Employee: Only own pending orders |
| Approve orders | ✅ | ❌ | |
| Cancel orders | ✅ | ✅* | *Employee: Only own orders |
| Delete orders | ✅ | ❌ | |
| **Reports & Analytics** |
| Stock reports | ✅ | ✅ | |
| Low stock alerts | ✅ | ✅ | |
| Sales reports | ✅ | ❌ | |
| Order reports | ✅ | ❌ | |
| Inventory reports | ✅ | ❌ | |

---

## API Endpoints by Role

### Authentication Endpoints (Public)
```
POST /api/auth/signup          - Register new user
POST /api/auth/signin          - Login
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password  - Reset password with token
```

---

### User Management Endpoints

#### Admin Only
```
GET    /api/users              - Get all users
GET    /api/users/{id}         - Get user by ID
PUT    /api/users/{id}         - Update user (including role assignment)
DELETE /api/users/{id}         - Delete user
```

---

### Product Management Endpoints

#### Admin and Employee (Read)
```
GET    /api/products                  - Get all products
GET    /api/products/{id}             - Get product by ID
GET    /api/products/search           - Search products
GET    /api/products/category/{cat}   - Get products by category
GET    /api/products/status/{status}  - Get products by status
GET    /api/products/categories       - Get all categories
GET    /api/products/low-stock        - Get low stock products
GET    /api/products/out-of-stock     - Get out of stock products
```

#### Admin and Employee (Write - Stock Updates)
```
PATCH  /api/products/{id}/quantity    - Update product quantity
```

#### Admin Only
```
POST   /api/products                  - Create new product
PUT    /api/products/{id}             - Update product details
DELETE /api/products/{id}             - Delete product
```

---

### Category Management Endpoints

#### Admin and Employee (Read)
```
GET    /api/categories                - Get all categories
GET    /api/categories/active         - Get active categories only
GET    /api/categories/{id}           - Get category by ID
GET    /api/categories/{id}/subcategories - Get subcategories
```

#### Admin Only
```
POST   /api/categories                - Create new category
PUT    /api/categories/{id}           - Update category
DELETE /api/categories/{id}           - Delete category
```

---

### Supplier Management Endpoints

#### Admin Only
```
GET    /api/suppliers                 - Get all suppliers
GET    /api/suppliers/{id}            - Get supplier by ID
GET    /api/suppliers/status/{status} - Get suppliers by status
GET    /api/suppliers/search          - Search suppliers
GET    /api/suppliers/top-rated       - Get top rated suppliers
POST   /api/suppliers                 - Create new supplier
PUT    /api/suppliers/{id}            - Update supplier
PATCH  /api/suppliers/{id}/rating     - Update performance rating
DELETE /api/suppliers/{id}            - Delete supplier
```

---

### Order Management Endpoints

#### Admin Only
```
GET    /api/orders                    - Get all orders
GET    /api/orders/status/{status}    - Get orders by status
GET    /api/orders/date-range         - Get orders by date range
POST   /api/orders/{id}/approve       - Approve order
DELETE /api/orders/{id}               - Delete order
```

#### Admin and Employee (Context-Aware)
```
GET    /api/orders/{id}               - Get order by ID (employee: own orders only)
GET    /api/orders/user/{userId}      - Get orders by user (employee: own only)
GET    /api/orders/my-orders          - Get current user's orders
POST   /api/orders                    - Create new order
PUT    /api/orders/{id}               - Update order (employee: own pending orders only)
POST   /api/orders/{id}/cancel        - Cancel order (employee: own orders only)
```

---

### Reports & Analytics Endpoints

#### Admin and Employee
```
GET    /api/reports/stock             - Generate stock report
GET    /api/reports/low-stock         - Generate low stock alert report
```

#### Admin Only
```
GET    /api/reports/sales             - Generate sales report (requires date range)
GET    /api/reports/orders            - Generate order report (requires date range)
GET    /api/reports/inventory         - Generate comprehensive inventory report
```

---

## Security Implementation

### 1. **JWT Authentication**
- All endpoints (except auth endpoints) require a valid JWT token
- Token must be included in the `Authorization` header: `Bearer <token>`
- Token contains user information including role

### 2. **Role-Based Authorization**
- Implemented using Spring Security's `@PreAuthorize` annotation
- SecurityConfig defines role-based URL patterns
- Controller methods have role-specific annotations

### 3. **Method-Level Security**
- `@PreAuthorize("hasRole('ADMIN')")` - Admin only
- `@PreAuthorize("hasRole('EMPLOYEE')")` - Employee only
- No annotation - All authenticated users

### 4. **Context-Aware Security**
- Some endpoints check ownership (e.g., employees can only view their own orders)
- Authentication object provides current user context
- Custom logic in controllers validates access rights

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### New Tables Added
- `categories` - Product category management
- `suppliers` - Supplier information and tracking
- `orders` - Order management (purchase, sales, returns)
- `order_items` - Line items for each order

---

## Usage Examples

### Admin Operations

#### 1. Create a New Product
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "category": "Electronics",
  "quantity": 100,
  "price": 29.99,
  "supplier": "TechSupply Inc."
}
```

#### 2. Approve an Order
```http
POST /api/orders/123/approve
Authorization: Bearer <admin-token>
```

#### 3. View All Users
```http
GET /api/users
Authorization: Bearer <admin-token>
```

#### 4. Generate Sales Report
```http
GET /api/reports/sales?startDate=2026-01-01T00:00:00&endDate=2026-01-31T23:59:59
Authorization: Bearer <admin-token>
```

---

### Employee Operations

#### 1. View Products
```http
GET /api/products
Authorization: Bearer <employee-token>
```

#### 2. Update Stock Quantity
```http
PATCH /api/products/5/quantity?quantity=150
Authorization: Bearer <employee-token>
```

#### 3. Create an Order
```http
POST /api/orders
Authorization: Bearer <employee-token>
Content-Type: application/json

{
  "orderType": "PURCHASE",
  "supplierId": 1,
  "notes": "Restocking electronics",
  "orderItems": [
    {
      "productId": 5,
      "quantity": 50,
      "unitPrice": 29.99
    }
  ]
}
```

#### 4. View My Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <employee-token>
```

#### 5. View Low Stock Report
```http
GET /api/reports/low-stock
Authorization: Bearer <employee-token>
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

---

## Testing RBAC

### 1. Create Test Users
```sql
-- Admin user
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@test.com', '<bcrypt-hash>', 'ADMIN');

-- Employee user
INSERT INTO users (username, email, password, role) 
VALUES ('employee', 'employee@test.com', '<bcrypt-hash>', 'EMPLOYEE');
```

### 2. Login as Each Role
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 3. Test Permission Restrictions
- Try accessing admin-only endpoints with employee token
- Verify 403 Forbidden response
- Test employee trying to view other users' orders

---

## Security Best Practices

1. **Password Security**
   - Passwords are BCrypt hashed
   - Minimum 6 characters required
   - Change default admin password immediately

2. **Token Management**
   - JWT tokens expire after configured time
   - Tokens should be stored securely in client
   - Never expose tokens in URLs

3. **Role Assignment**
   - Only admins can assign/change roles
   - Role is validated on every request
   - Default role is EMPLOYEE for new signups

4. **Audit Logging**
   - Critical operations (order approval, user deletion) are tracked
   - `created_at` and `updated_at` timestamps maintained
   - `approved_by` field tracks who approved orders

---

## Future Enhancements

1. **Additional Roles**
   - MANAGER - Mid-level permissions
   - VIEWER - Read-only access
   - WAREHOUSE_STAFF - Inventory focused

2. **Granular Permissions**
   - Permission-based access control
   - Custom permission sets
   - Dynamic role creation

3. **Audit Trail**
   - Comprehensive action logging
   - User activity tracking
   - Change history for entities

4. **Multi-tenancy**
   - Organization-level isolation
   - Shared infrastructure
   - Per-organization admin roles

---

## Support

For questions or issues related to RBAC implementation, please refer to:
- Main README: `README.md`
- Auth API Documentation: `README_AUTH.md`
- Products API Documentation: `README_PRODUCTS_API.md`
- Setup Guide: `SETUP_GUIDE.md`
