-- ============================================
-- Inventory Management System - Updated Database Schema
-- With Role-Based Access Control Support
-- ============================================

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS users;

-- ============================================
-- Table: users
-- Description: Store user information with role-based access
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE', -- ADMIN or EMPLOYEE
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ============================================
-- Table: categories
-- Description: Product categories with hierarchical support
-- ============================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    parent_category_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    reorder_level INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_active (active)
);

-- ============================================
-- Table: suppliers
-- Description: Supplier information and performance tracking
-- ============================================
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    contract_terms TEXT,
    performance_rating DECIMAL(3,2), -- Rating from 0.00 to 5.00
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_rating (performance_rating)
);

-- ============================================
-- Table: products
-- Description: Product inventory with enhanced category management
-- ============================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    supplier VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'In Stock', -- In Stock, Low Stock, Out of Stock
    reorder_level INT DEFAULT 10, -- Threshold for reordering
    reorder_quantity INT DEFAULT 50, -- Quantity to reorder when below threshold
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sku (sku),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_quantity (quantity)
);

-- ============================================
-- Table: orders
-- Description: Order management (Purchase, Sales, Returns)
-- ============================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    supplier_id BIGINT,
    order_type VARCHAR(50) NOT NULL, -- PURCHASE, SALES, RETURN
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    total_amount DECIMAL(12, 2) NOT NULL,
    notes VARCHAR(1000),
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATETIME,
    actual_delivery_date DATETIME,
    approved_by BIGINT,
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_supplier_id (supplier_id),
    INDEX idx_status (status),
    INDEX idx_order_type (order_type),
    INDEX idx_order_date (order_date)
);

-- ============================================
-- Table: order_items
-- Description: Items in each order
-- ============================================
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- ============================================
-- Insert Default Admin User
-- Password: admin123 (BCrypt hashed)
-- ============================================
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@inventra.com', '$2a$10$YgZ8vZqZqZqZqZqZqZqZqOe7ZqZqZqZqZqZqZqZqZqZqZqZqZqZqZ', 'ADMIN');

-- Note: You should change the default password after first login
-- The actual BCrypt hash should be generated by the application

-- ============================================
-- Insert Sample Categories
-- ============================================
INSERT INTO categories (name, description, active, reorder_level) VALUES
('Electronics', 'Electronic devices and accessories', TRUE, 5),
('Furniture', 'Office and home furniture', TRUE, 10),
('Stationery', 'Office supplies and stationery items', TRUE, 20),
('Hardware', 'Tools and hardware equipment', TRUE, 15),
('Software', 'Software licenses and digital products', TRUE, 5);

-- ============================================
-- Insert Sample Suppliers
-- ============================================
INSERT INTO suppliers (name, contact_person, email, phone, address, city, state, country, status, performance_rating) VALUES
('TechSupply Inc.', 'John Smith', 'john@techsupply.com', '+1-555-0101', '123 Tech Street', 'San Francisco', 'CA', 'USA', 'ACTIVE', 4.5),
('Office Furniture Co.', 'Jane Doe', 'jane@officefurniture.com', '+1-555-0102', '456 Furniture Ave', 'New York', 'NY', 'USA', 'ACTIVE', 4.2),
('Global Stationery', 'Bob Johnson', 'bob@globalstationery.com', '+1-555-0103', '789 Paper Lane', 'Chicago', 'IL', 'USA', 'ACTIVE', 4.7);

-- ============================================
-- End of Database Schema
-- ============================================
