# 🚀 Quick Setup Guide - Inventra Authentication Module

## ✅ What Has Been Created

### Backend Components (All Complete!)

1. **Model Layer**
   - ✓ User.java - User entity with Spring Security integration

2. **Repository Layer**
   - ✓ UserRepository.java - Database operations for User

3. **DTO Layer**
   - ✓ SignupRequest.java
   - ✓ SigninRequest.java
   - ✓ ForgotPasswordRequest.java
   - ✓ ResetPasswordRequest.java
   - ✓ AuthResponse.java

4. **Service Layer**
   - ✓ AuthService.java - Authentication business logic
   - ✓ EmailService.java - Email sending for password reset

5. **Controller Layer**
   - ✓ AuthController.java - REST API endpoints

6. **Configuration Layer**
   - ✓ SecurityConfig.java - Spring Security setup
   - ✓ JWTUtility.java - JWT token management
   - ✓ JWTAuthenticationFilter.java - Request authentication

7. **Exception Handling**
   - ✓ GlobalExceptionHandler.java - Centralized error handling

8. **Configuration Files**
   - ✓ application.properties - Updated with all configurations

## 🔧 Setup Steps

### Step 1: Database Setup

1. **Start MySQL Server**
   ```bash
   # Windows: Start MySQL service
   net start MySQL80
   ```

2. **Run the database setup script**
   ```bash
   mysql -u root -p < database_setup.sql
   ```
   
   Or manually:
   ```sql
   CREATE DATABASE inventra_db;
   ```

### Step 2: Configure Application

Edit `backend/src/main/resources/application.properties`:

1. **Database credentials** (if different from root/root):
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

2. **Email configuration** (for forgot password feature):
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```

   **To get Gmail App Password:**
   - Enable 2-Step Verification in Google Account
   - Go to: Security → 2-Step Verification → App passwords
   - Generate password for "Mail" app
   - Use the 16-character password

### Step 3: Build and Run

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

🎉 **Server will start on http://localhost:8080**

## 🧪 Testing the API

### Option 1: Using Postman

1. Import the Postman collection:
   - File: `Inventra_Auth_Collection.postman_collection.json`
   - In Postman: Import → Upload Files

2. Test the endpoints in this order:
   - **Signup Admin** → Creates admin account
   - **Signin** → Gets JWT token (auto-saved to environment)
   - **Forgot Password** → Sends reset email
   - **Reset Password** → Changes password

### Option 2: Using cURL

**Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\",\"email\":\"admin@inventra.com\",\"role\":\"ADMIN\"}"
```

**Signin:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Save the token from response!

## 📋 Test Credentials

If you ran `database_setup.sql`, these users are already created:

| Username  | Password     | Role     |
|-----------|--------------|----------|
| admin     | admin123     | ADMIN    |
| employee  | employee123  | EMPLOYEE |

## 🔑 API Endpoints Summary

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/auth/signup` | POST | Register new user | No |
| `/api/auth/signin` | POST | Login user | No |
| `/api/auth/forgot-password` | POST | Request password reset | No |
| `/api/auth/reset-password` | POST | Reset password with token | No |

## 🛡️ Using JWT Token

For protected endpoints, include the token in the header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Example:
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure

```
backend/src/main/java/com/infosys/inventra/
├── config/
│   ├── JWTAuthenticationFilter.java
│   ├── JWTUtility.java
│   └── SecurityConfig.java
├── controller/
│   └── AuthController.java
├── dto/
│   ├── AuthResponse.java
│   ├── ForgotPasswordRequest.java
│   ├── ResetPasswordRequest.java
│   ├── SigninRequest.java
│   └── SignupRequest.java
├── exception/
│   └── GlobalExceptionHandler.java
├── model/
│   └── User.java
├── repository/
│   └── UserRepository.java
├── service/
│   ├── AuthService.java
│   └── EmailService.java
└── InventraApplication.java
```

## 🐛 Troubleshooting

### Issue: Database connection failed
**Solution:** Verify MySQL is running and credentials are correct in `application.properties`

### Issue: Email not sending
**Solution:** 
- Check Gmail credentials are correct
- Verify you're using App Password, not regular password
- Check internet connection

### Issue: JWT token invalid
**Solution:** 
- Token expires after 24 hours - login again
- Ensure token is properly formatted in Authorization header

### Issue: Port 8080 already in use
**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

## 📚 Additional Resources

- **Detailed Documentation:** See `README_AUTH.md`
- **Database Schema:** See `database_setup.sql`
- **Postman Collection:** See `Inventra_Auth_Collection.postman_collection.json`

## ✨ Features Implemented

✅ User Registration (Signup)  
✅ User Login with JWT (Signin)  
✅ Forgot Password with Email  
✅ Reset Password with Token  
✅ Password Encryption (BCrypt)  
✅ JWT Token Authentication  
✅ Role-based Access (ADMIN/EMPLOYEE)  
✅ Input Validation  
✅ Global Exception Handling  
✅ CORS Configuration  
✅ Stateless Session Management  

## 🎯 Next Steps

1. Test all endpoints using Postman or cURL
2. Implement role-based authorization for other endpoints
3. Create frontend integration
4. Add more user management features (update profile, change password, etc.)
5. Implement refresh token mechanism
6. Add rate limiting for security

---

**Need Help?** Check the detailed documentation in `README_AUTH.md`
