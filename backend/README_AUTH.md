# Authentication Module - Inventra

## Overview
This authentication module implements a complete JWT-based authentication system with the following features:
- User Registration (Signup)
- User Login (Signin)
- Forgot Password
- Reset Password

## Components Created

### 1. Models
- **User** (`model/User.java`) - User entity with Spring Security UserDetails implementation

### 2. Repositories
- **UserRepository** (`repository/UserRepository.java`) - JPA repository for User entity

### 3. DTOs
- **SignupRequest** - Registration request DTO
- **SigninRequest** - Login request DTO
- **ForgotPasswordRequest** - Forgot password request DTO
- **ResetPasswordRequest** - Reset password request DTO
- **AuthResponse** - Unified authentication response DTO

### 4. Services
- **AuthService** (`service/AuthService.java`) - Core authentication business logic
- **EmailService** (`service/EmailService.java`) - Email service for password reset

### 5. Controllers
- **AuthController** (`controller/AuthController.java`) - REST API endpoints for authentication

### 6. Configuration
- **SecurityConfig** (`config/SecurityConfig.java`) - Spring Security configuration
- **JWTUtility** (`config/JWTUtility.java`) - JWT token generation and validation
- **JWTAuthenticationFilter** (`config/JWTAuthenticationFilter.java`) - JWT filter for request authentication

### 7. Exception Handling
- **GlobalExceptionHandler** (`exception/GlobalExceptionHandler.java`) - Centralized exception handling

## API Endpoints

### 1. Signup (Register User)
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "role": "ADMIN"
}
```

**Response (Success - 201):**
```json
{
  "message": "Signup successful",
  "token": null,
  "username": null,
  "role": null
}
```

### 2. Signin (Login)
```
POST /api/auth/signin
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "role": "ADMIN"
}
```

### 3. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset link sent to your email",
  "token": null,
  "username": null,
  "role": null
}
```

### 4. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123-reset-token-xyz789",
  "newPassword": "newPassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset successful",
  "token": null,
  "username": null,
  "role": null
}
```

## Configuration Required

### 1. Database Setup
Create MySQL database:
```sql
CREATE DATABASE inventra_db;
```

### 2. Update `application.properties`
Update the following properties in `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# Email Configuration (for Gmail)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3. Gmail App Password Setup
To send password reset emails:
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Generate and copy the password
3. Use this app password in `spring.mail.password`

## Testing the API

### Using cURL:

**1. Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@inventra.com",
    "role": "ADMIN"
  }'
```

**2. Signin:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**3. Forgot Password:**
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inventra.com"
  }'
```

**4. Access Protected Endpoint:**
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman:

1. **Create a new collection** named "Inventra Auth"
2. **Add requests** for each endpoint listed above
3. **For protected endpoints**: Add header `Authorization: Bearer {token}`

## Security Features

1. **Password Encryption**: BCrypt password encoding
2. **JWT Tokens**: Secure token-based authentication (24-hour expiry)
3. **Stateless Sessions**: No session storage on server
4. **CORS Enabled**: Cross-origin requests allowed
5. **Token Expiry**: Reset tokens expire in 1 hour
6. **Input Validation**: Bean validation on all request DTOs

## User Roles

- **ADMIN**: Full system access (can register employees)
- **EMPLOYEE**: Limited access (normal user)

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200 OK**: Successful operation
- **201 Created**: Resource created (signup)
- **400 Bad Request**: Invalid input or business logic error
- **401 Unauthorized**: Invalid credentials
- **500 Internal Server Error**: Server-side error

## Running the Application

1. **Start MySQL server**
2. **Update application.properties** with your configurations
3. **Run the Spring Boot application:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. **Application will start on** `http://localhost:8080`

## Database Schema

The `users` table will be automatically created with the following structure:
- `id` (Primary Key)
- `username` (Unique)
- `password` (Encrypted)
- `email` (Unique)
- `role`
- `reset_token`
- `reset_token_expiry`
- `created_at`
- `updated_at`

## Notes

- Remember to update email credentials in `application.properties` for forgot password functionality
- JWT secret key is configurable in `application.properties`
- Token expiration time is set to 24 hours (configurable)
- Reset token expiration is 1 hour (hardcoded, can be made configurable)
