package com.infosys.inventra.service;

import com.infosys.inventra.dto.UserResponseDTO;
import com.infosys.inventra.dto.UserUpdateDTO;
import com.infosys.inventra.model.User;
import com.infosys.inventra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get all users
     * @return List of UserResponseDTO
     */
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     * @param id - User ID
     * @return UserResponseDTO
     */
    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::convertToDTO);
    }

    /**
     * Update user
     * @param id - User ID
     * @param updateDTO - User update data
     * @return Updated UserResponseDTO
     */
    public Optional<UserResponseDTO> updateUser(Long id, UserUpdateDTO updateDTO) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        
        User user = userOpt.get();
        
        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(updateDTO.getUsername())) {
            Optional<User> existingUser = userRepository.findByUsername(updateDTO.getUsername());
            if (existingUser.isPresent()) {
                throw new RuntimeException("Username already exists");
            }
        }
        
        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(updateDTO.getEmail())) {
            if (userRepository.existsByEmail(updateDTO.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
        }
        
        user.setUsername(updateDTO.getUsername());
        user.setEmail(updateDTO.getEmail());
        user.setRole(updateDTO.getRole());
        
        // Update password only if provided
        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return Optional.of(convertToDTO(updatedUser));
    }

    /**
     * Delete user
     * @param id - User ID
     * @return true if deleted, false if not found
     */
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Convert User entity to UserResponseDTO
     * @param user - User entity
     * @return UserResponseDTO
     */
    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
