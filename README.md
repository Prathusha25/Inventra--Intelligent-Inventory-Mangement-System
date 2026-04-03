Inventra is a secure inventory authentication module developed as part of the internship milestone project. The system manages Admin and Employee access with authentication, account approval, and security mechanisms.

It demonstrates backend authentication logic, role-based access control, and secure login handling.

🚀 Features
🔐 Authentication
Employee/Admin login with Employee ID and Password
Session token generation with expiry
Secure authentication validation
👥 Role Based Access
Admin

Create employee accounts
Approve employee registrations
Manage system access
Employee

Login after admin approval
Access inventory system features
🛡️ Security Features
Account lock after 3 failed login attempts
Duplicate Employee ID prevention
Token expiry validation
Secure logout handling
🧠 Authentication Scenarios
Scenario	System Response
Employee ID does not exist	Login denied
Account not approved	Login blocked
Wrong password (1st/2nd attempt)	Warning message
Wrong password (3rd attempt)	Account locked
Admin creates duplicate empId	System rejects request
⚙️ Tech Stack
Frontend

HTML
CSS
JavaScript
For the Inventra Inventory Management System, the backend stack can be identified from the APIs, authentication method, and server configuration used in your project.

Based on your code and previous setup (running with mvn spring-boot:run, JWT token usage, and REST APIs), the backend technologies used are:

Backend Technologies Used in Inventra
1. Java
Primary programming language used to build the backend.
Used to implement business logic, controllers, services, and entities.
Typical usage:

Product management logic
User authentication
Transaction handling
Inventory processing
2. Spring Boot
Framework used to build the backend REST API.

Features used:

REST Controllers (@RestController)
Dependency Injection
Spring Security integration
API routing
Embedded Tomcat server
Example endpoints in your project:

/api/products
/api/products/transactions
/api/auth/pending
/api/auth/approve/{id}
/api/auth/locked
/api/reports/generate
Spring Boot allows the backend to run using:

mvn spring-boot:run
3. Spring Security
Used for authentication and authorization.

Evidence in your project:

Authorization: Bearer <token>
Login authentication
Protected APIs
Role-based access (ADMIN)
Purpose:

Secure APIs
Prevent unauthorized access
Manage login sessions
4. JWT (JSON Web Token) Authentication
Used for stateless authentication between frontend and backend.

Flow:

User logs in
Backend generates JWT token
Token stored in browser
Example in your code:

const token = localStorage.getItem("token");
Every API request sends:

Authorization: Bearer <token>
5. Spring Data JPA / Hibernate
Used for database communication and ORM mapping.

Features:

Object-Relational Mapping
Automatic SQL generation
Repository pattern
Example repository:

public interface ProductRepository extends JpaRepository<Product, Long> {
}
6. MySQL Database
Used to store system data.

Typical tables in Inventra:

Users Table
id
username
email
password
role
account_status
Products Table
id
name
stock_quantity
min_stock_level
Transactions Table
id
product_id
type
quantity
performed_by
timestamp
7. REST API Architecture
The backend follows RESTful API design.

Examples:

Method	Endpoint	Purpose
GET	/api/products	Get inventory
POST	/api/products	Add product
PUT	/api/products/{id}	Update product
DELETE	/api/products/{id}	Delete product
GET	/api/products/transactions	Get transactions
GET	/api/auth/pending	Pending users
Frontend Technologies (for context)
Even though you asked backend, your project also uses:

HTML
CSS
JavaScript
Chart.js (analytics)
jsPDF (PDF reports)
Final Backend Stack Summary
Layer	Technology
Backend Language	Java
Framework	Spring Boot
Security	Spring Security
Authentication	JWT
Database	MySQL
ORM	Hibernate / Spring Data JPA
API Architecture	REST API
Server	Embedded Tomcat
Tools

Git
GitHub
