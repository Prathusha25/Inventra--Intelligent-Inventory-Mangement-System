package com.infosys.inventra.controller;

import com.infosys.inventra.dto.*;
import com.infosys.inventra.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register new user (Signup)
     * @param request - SignupRequest with user details
     * @return AuthResponse with success/failure message
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse result = authService.registerUser(request);
        
        if (result.getMessage().contains("successful")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * Authenticate user (Signin/Login)
     * @param request - SigninRequest with username and password
     * @return AuthResponse with JWT token or error message
     */
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@Valid @RequestBody SigninRequest request) {
        AuthResponse result = authService.authenticate(request);
        
        if (result.getToken() != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    /**
     * Request password reset (Forgot Password)
     * @param request - ForgotPasswordRequest with email
     * @return AuthResponse with success/failure message
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        AuthResponse result = authService.processForgotPassword(request);
        
        if (result.getMessage().contains("sent")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * Reset password using token
     * @param request - ResetPasswordRequest with token and new password
     * @return AuthResponse with success/failure message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        AuthResponse result = authService.resetPassword(request);
        
        if (result.getMessage().contains("successful")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
}
