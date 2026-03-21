package com.infosys.inventra.service;

import com.infosys.inventra.config.JWTUtility;
import com.infosys.inventra.dto.*;
import com.infosys.inventra.model.User;
import com.infosys.inventra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtility jwtUtility;

    @Autowired
    private EmailService emailService;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    /**
     * Register new user
     * @param request - Signup request containing user details
     * @return AuthResponse with success/failure message
     */
    public AuthResponse registerUser(SignupRequest request) {
        
        // Check if username already exists
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            return new AuthResponse("User already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("Email already registered");
        }

        // Encrypt password
        String encryptedPassword = passwordEncoder.encode(request.getPassword());

        // Create new user
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(encryptedPassword);
        newUser.setRole(request.getRole());
        newUser.setEmail(request.getEmail());

        // Save user in database
        userRepository.save(newUser);

        return new AuthResponse("Signup successful");
    }

    /**
     * Authenticate user and generate JWT token
     * @param request - Signin request with username and password
     * @return AuthResponse with token or error message
     */
    public AuthResponse authenticate(SigninRequest request) {
        
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // Get user details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Find user to get role
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Generate token
            String token = jwtUtility.generateToken(userDetails);

            // Return response with token
            AuthResponse response = new AuthResponse("Login successful", token);
            response.setUsername(user.getUsername());
            response.setRole(user.getRole());
            
            return response;

        } catch (BadCredentialsException e) {
            return new AuthResponse("Invalid username or password");
        } catch (Exception e) {
            return new AuthResponse("Authentication failed: " + e.getMessage());
        }
    }

    /**
     * Process forgot password request
     * @param request - Forgot password request with email
     * @return AuthResponse with success/failure message
     */
    public AuthResponse processForgotPassword(ForgotPasswordRequest request) {
        
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return new AuthResponse("Email not registered");
        }

        User user = userOptional.get();

        // Generate reset token
        String resetToken = generateResetToken();
        
        // Set token expiry (1 hour from now)
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);
        
        // Save reset token with user
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiry);
        userRepository.save(user);

        // Send reset email
        try {
            emailService.sendResetLink(user.getEmail(), resetToken);
            return new AuthResponse("Password reset link sent to your email");
        } catch (Exception e) {
            return new AuthResponse("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Reset password using token
     * @param request - Reset password request with token and new password
     * @return AuthResponse with success/failure message
     */
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        
        // Find user by reset token
        Optional<User> userOptional = userRepository.findByResetToken(request.getToken());
        
        if (userOptional.isEmpty()) {
            return new AuthResponse("Invalid token");
        }

        User user = userOptional.get();

        // Check if token is expired
        if (user.getResetTokenExpiry() == null || 
            LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return new AuthResponse("Token has expired");
        }

        // Encrypt new password
        String encryptedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encryptedPassword);

        // Clear reset token
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        // Save user
        userRepository.save(user);

        return new AuthResponse("Password reset successful");
    }

    /**
     * Generate random reset token
     * @return Random UUID as reset token
     */
    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    /**
     * Load user by username for Spring Security
     * @param username - Username to load
     * @return UserDetails object
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
