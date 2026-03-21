-- ============================================
-- Inventra Database Setup Script
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS inventra_db;
USE inventra_db;

-- The users table will be automatically created by Hibernate
-- But if you want to create it manually, here's the schema:

-- DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_reset_token (reset_token)
);

-- ============================================
-- Insert Sample Data (Optional)
-- ============================================

-- Insert an admin user for testing
-- Password: admin123 (BCrypt encrypted)
INSERT INTO users (username, password, email, role, created_at, updated_at) VALUES
('admin', '$2a$10$xvW4.QVHDXDqKJ5K9IqOh.V7bX0I.xQyH3L9zA/UpYvLqBKJvk3Gi', 'admin@inventra.com', 'ADMIN', NOW(), NOW());

-- Insert an employee user for testing
-- Password: employee123 (BCrypt encrypted)
INSERT INTO users (username, password, email, role, created_at, updated_at) VALUES
('employee', '$2a$10$Q7vJHH4Kd8aTdyV4WYQYUeP3mBQYJK7I.Bp0h6XVQB5Hp5h3PJl9q', 'employee@inventra.com', 'EMPLOYEE', NOW(), NOW());

-- ============================================
-- Products Table
-- ============================================

CREATE TABLE IF NOT EXISTS products (
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

-- Insert sample products for testing
INSERT INTO products (name, sku, category, quantity, price, supplier, status, created_at, updated_at) VALUES
-- Peripherals
('Wireless Mouse MX-200', 'WM-200', 'Peripherals', 342, 15.00, 'TechParts Global', 'In Stock', NOW(), NOW()),
('Mechanical Keyboard K95', 'MK-095', 'Peripherals', 8, 70.00, 'KeyTech Solutions', 'Low Stock', NOW(), NOW()),
('Webcam HD Pro 1080p', 'WC-108', 'Peripherals', 234, 30.00, 'VisionTech', 'In Stock', NOW(), NOW()),
('Wireless Gaming Mouse RGB', 'WGM-350', 'Peripherals', 145, 45.99, 'GamerTech Inc', 'In Stock', NOW(), NOW()),
('Ergonomic Keyboard Split', 'EKS-400', 'Peripherals', 5, 120.00, 'ErgoTech Solutions', 'Low Stock', NOW(), NOW()),
('Vertical Mouse Wireless', 'VMW-250', 'Peripherals', 89, 35.00, 'ComfortTech', 'In Stock', NOW(), NOW()),
('Gaming Mousepad XXL', 'GMP-XXL', 'Peripherals', 0, 19.99, 'GamerGear Co', 'Out of Stock', NOW(), NOW()),

-- Accessories
('USB-C Hub 7-in-1', 'UC-701', 'Accessories', 156, 25.00, 'GadgetWorld Inc', 'In Stock', NOW(), NOW()),
('Laptop Stand Aluminium', 'LS-ALU', 'Accessories', 0, 35.00, 'ErgoDesk Corp', 'Out of Stock', NOW(), NOW()),
('Cable Organizer Set', 'COS-100', 'Accessories', 278, 12.99, 'OrganizeIT Inc', 'In Stock', NOW(), NOW()),
('USB Extension Cable 10ft', 'UEC-10F', 'Accessories', 167, 8.99, 'CableMaster', 'In Stock', NOW(), NOW()),
('Laptop Cooling Pad', 'LCP-300', 'Accessories', 7, 29.99, 'CoolTech Systems', 'Low Stock', NOW(), NOW()),
('Screen Cleaning Kit', 'SCK-001', 'Accessories', 345, 9.99, 'CleanScreen Pro', 'In Stock', NOW(), NOW()),
('Wireless Presenter Remote', 'WPR-200', 'Accessories', 45, 22.50, 'PresentPro', 'In Stock', NOW(), NOW()),

-- Displays
('27" Monitor UltraWide', 'MN-270', 'Displays', 67, 200.00, 'DisplayPro Ltd', 'In Stock', NOW(), NOW()),
('24" Gaming Monitor 144Hz', 'GM-244', 'Displays', 34, 299.99, 'GamerDisplay Inc', 'In Stock', NOW(), NOW()),
('32" 4K Monitor Professional', 'PM-324K', 'Displays', 12, 599.00, 'ProDisplay Corp', 'In Stock', NOW(), NOW()),
('Portable Monitor 15.6"', 'PMN-156', 'Displays', 89, 179.99, 'MobileTech', 'In Stock', NOW(), NOW()),
('Monitor Arm Dual Mount', 'MAD-002', 'Displays', 3, 79.99, 'MountMaster', 'Low Stock', NOW(), NOW()),
('Privacy Screen Filter 24"', 'PSF-240', 'Displays', 156, 34.99, 'PrivacyTech', 'In Stock', NOW(), NOW()),

-- Audio
('Noise Cancelling Headphones', 'NC-H50', 'Audio', 12, 89.99, 'SoundWave Audio', 'In Stock', NOW(), NOW()),
('Wireless Earbuds Pro', 'WEP-300', 'Audio', 234, 79.99, 'AudioTech Inc', 'In Stock', NOW(), NOW()),
('USB Microphone Studio', 'USM-500', 'Audio', 6, 129.99, 'StudioSound Pro', 'Low Stock', NOW(), NOW()),
('Bluetooth Speaker Portable', 'BSP-250', 'Audio', 178, 45.00, 'SoundBlast', 'In Stock', NOW(), NOW()),
('Gaming Headset RGB', 'GHS-700', 'Audio', 145, 99.99, 'GamerAudio', 'In Stock', NOW(), NOW()),
('Desk Speakers 2.1', 'DS-210', 'Audio', 8, 149.99, 'DeskSound Inc', 'Low Stock', NOW(), NOW()),

-- Storage
('Portable SSD 1TB', 'PS-1TB', 'Storage', 189, 59.99, 'DataStore Inc', 'In Stock', NOW(), NOW()),
('External HDD 4TB', 'EHD-4TB', 'Storage', 123, 89.99, 'StoragePro', 'In Stock', NOW(), NOW()),
('USB Flash Drive 128GB', 'UFD-128', 'Storage', 456, 15.99, 'QuickStore', 'In Stock', NOW(), NOW()),
('SD Card 256GB', 'SDC-256', 'Storage', 289, 29.99, 'MemoryTech', 'In Stock', NOW(), NOW()),
('NVMe SSD 2TB Internal', 'NVM-2TB', 'Storage', 45, 199.99, 'SpeedDrive Co', 'In Stock', NOW(), NOW()),
('Card Reader USB-C', 'CRU-001', 'Storage', 267, 12.99, 'ReadTech', 'In Stock', NOW(), NOW()),

-- Networking
('WiFi 6 Router Dual-Band', 'W6R-DB', 'Networking', 67, 89.99, 'NetGear Plus', 'In Stock', NOW(), NOW()),
('Ethernet Cable Cat8 10ft', 'EC8-10F', 'Networking', 234, 14.99, 'CableNet', 'In Stock', NOW(), NOW()),
('USB WiFi Adapter AC1200', 'UWA-AC12', 'Networking', 178, 24.99, 'WirelessTech', 'In Stock', NOW(), NOW()),
('Network Switch 8-Port', 'NS-08P', 'Networking', 4, 39.99, 'SwitchMaster', 'Low Stock', NOW(), NOW()),
('Mesh WiFi System 3-Pack', 'MWS-3PK', 'Networking', 23, 279.99, 'MeshNet Pro', 'In Stock', NOW(), NOW()),

-- Power
('Surge Protector 12 Outlet', 'SP-12O', 'Power', 145, 34.99, 'PowerSafe Inc', 'In Stock', NOW(), NOW()),
('UPS Battery Backup 1500VA', 'UPS-1500', 'Power', 34, 159.99, 'PowerProtect', 'In Stock', NOW(), NOW()),
('USB Charging Station 10-Port', 'UCS-10P', 'Power', 89, 49.99, 'ChargeMaster', 'In Stock', NOW(), NOW()),
('Wireless Charging Pad', 'WCP-150', 'Power', 0, 19.99, 'ChargeTech', 'Out of Stock', NOW(), NOW()),
('Power Bank 20000mAh', 'PB-20K', 'Power', 267, 29.99, 'PortablePower', 'In Stock', NOW(), NOW()),

-- Office Supplies
('Writing Desk Pad Large', 'WDP-LRG', 'Office Supplies', 123, 24.99, 'DeskEssentials', 'In Stock', NOW(), NOW()),
('Desk Organizer Bamboo', 'DOB-001', 'Office Supplies', 78, 34.99, 'OrganizeDesk', 'In Stock', NOW(), NOW()),
('LED Desk Lamp USB', 'LDL-USB', 'Office Supplies', 156, 39.99, 'LightWorks', 'In Stock', NOW(), NOW()),
('Monitor Stand with Drawer', 'MSD-001', 'Office Supplies', 6, 44.99, 'DeskRise', 'Low Stock', NOW(), NOW()),
('Wireless Charging Mouse Pad', 'WCMP-01', 'Office Supplies', 89, 29.99, 'TechDesk Inc', 'In Stock', NOW(), NOW());

-- ============================================
-- Verify Data
-- ============================================

SELECT * FROM users;
SELECT * FROM products;

-- ============================================
-- Notes:
-- ============================================
-- Default credentials:
-- Admin:    username: admin,    password: admin123
-- Employee: username: employee, password: employee123
--
-- These are for testing purposes only.
-- Change passwords after first login in production!
-- ============================================
