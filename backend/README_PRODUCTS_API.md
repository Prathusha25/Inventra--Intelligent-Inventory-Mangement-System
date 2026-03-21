# Product API Documentation

## Overview
The Product API provides endpoints for managing inventory products in the Inventra system.

## Base URL
```
http://localhost:8080/api/products
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Products
**GET** `/api/products`

Returns a list of all products in the inventory.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Wireless Mouse MX-200",
    "sku": "WM-200",
    "category": "Peripherals",
    "quantity": 342,
    "price": 15.00,
    "supplier": "TechParts Global",
    "status": "In Stock",
    "createdAt": "2026-02-23T10:00:00",
    "updatedAt": "2026-02-23T10:00:00"
  }
]
```

### 2. Get Product by ID
**GET** `/api/products/{id}`

Returns a specific product by ID.

**Response:** Same as single product object above.

### 3. Search Products
**GET** `/api/products/search?keyword={keyword}`

Search products by name or SKU.

**Parameters:**
- `keyword` (query parameter): Search term

### 4. Get Products by Category
**GET** `/api/products/category/{category}`

Returns all products in a specific category.

### 5. Get Products by Status
**GET** `/api/products/status/{status}`

Returns all products with a specific status.

**Status values:** "In Stock", "Low Stock", "Out of Stock"

### 6. Get All Categories
**GET** `/api/products/categories`

Returns a list of all unique product categories.

**Response:**
```json
["Peripherals", "Accessories", "Displays", "Audio", "Storage"]
```

### 7. Get Low Stock Products
**GET** `/api/products/low-stock`

Returns all products with quantity less than 10.

### 8. Get Out of Stock Products
**GET** `/api/products/out-of-stock`

Returns all products with quantity equal to 0.

### 9. Create Product (Admin Only)
**POST** `/api/products`

Creates a new product.

**Request Body:**
```json
{
  "name": "Wireless Mouse MX-200",
  "sku": "WM-200",
  "category": "Peripherals",
  "quantity": 342,
  "price": 15.00,
  "supplier": "TechParts Global"
}
```

**Validation:**
- `name`: Required, max 255 characters
- `sku`: Required, unique, max 50 characters
- `category`: Required, max 100 characters
- `quantity`: Required, minimum 0
- `price`: Required, minimum 0.0
- `supplier`: Optional, max 255 characters

**Note:** Status is automatically calculated based on quantity:
- quantity = 0 → "Out of Stock"
- quantity < 10 → "Low Stock"
- quantity >= 10 → "In Stock"

### 10. Update Product (Admin Only)
**PUT** `/api/products/{id}`

Updates an existing product.

**Request Body:**
```json
{
  "name": "Wireless Mouse MX-200",
  "category": "Peripherals",
  "quantity": 342,
  "price": 15.00,
  "supplier": "TechParts Global"
}
```

**Note:** SKU cannot be changed after creation.

### 11. Update Product Quantity (Admin Only)
**PATCH** `/api/products/{id}/quantity?quantity={quantity}`

Updates only the quantity of a product.

**Parameters:**
- `quantity` (query parameter): New quantity value

### 12. Delete Product (Admin Only)
**DELETE** `/api/products/{id}`

Deletes a product.

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Product with SKU 'WM-200' already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

## Status Codes
- `200 OK`: Successful GET, PUT, PATCH requests
- `201 Created`: Successful POST request
- `400 Bad Request`: Validation error or business logic error
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions (non-admin trying admin operation)
- `404 Not Found`: Resource not found

## Admin-Only Operations
The following operations require ADMIN role:
- Create product (POST)
- Update product (PUT)
- Update quantity (PATCH)
- Delete product (DELETE)

All users (ADMIN and EMPLOYEE) can:
- View all products (GET)
- Search products
- Filter by category/status
- View categories

## Database Schema

```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    supplier VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_sku (sku),
    INDEX idx_category (category),
    INDEX idx_status (status)
);
```

## Sample Usage (JavaScript/React)

```javascript
import { productAPI } from "../api/axios";

// Get all products
const products = await productAPI.getAll();

// Search products
const results = await productAPI.search("mouse");

// Create product (admin only)
const newProduct = await productAPI.create({
  name: "New Product",
  sku: "NP-001",
  category: "Electronics",
  quantity: 100,
  price: 29.99,
  supplier: "Supplier Inc"
});

// Update product (admin only)
const updated = await productAPI.update(1, {
  name: "Updated Product",
  category: "Electronics",
  quantity: 150,
  price: 24.99,
  supplier: "New Supplier"
});

// Delete product (admin only)
await productAPI.delete(1);
```
