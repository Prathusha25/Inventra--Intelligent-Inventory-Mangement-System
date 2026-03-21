package com.infosys.inventra.controller;

import com.infosys.inventra.dto.SupplierDTO;
import com.infosys.inventra.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    /**
     * Get all suppliers (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupplierDTO>> getAllSuppliers() {
        List<SupplierDTO> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get supplier by ID (Admin only)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSupplierById(@PathVariable Long id) {
        Optional<SupplierDTO> supplier = supplierService.getSupplierById(id);

        if (supplier.isPresent()) {
            return ResponseEntity.ok(supplier.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Supplier not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get suppliers by status (Admin only)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupplierDTO>> getSuppliersByStatus(@PathVariable String status) {
        List<SupplierDTO> suppliers = supplierService.getSuppliersByStatus(status);
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Search suppliers (Admin only)
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupplierDTO>> searchSuppliers(@RequestParam String keyword) {
        List<SupplierDTO> suppliers = supplierService.searchSuppliers(keyword);
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get top rated suppliers (Admin only)
     */
    @GetMapping("/top-rated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupplierDTO>> getTopRatedSuppliers(@RequestParam(defaultValue = "4.0") Double minRating) {
        List<SupplierDTO> suppliers = supplierService.getTopRatedSuppliers(minRating);
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Create new supplier (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSupplier(@Valid @RequestBody SupplierDTO supplierDTO) {
        try {
            SupplierDTO createdSupplier = supplierService.createSupplier(supplierDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSupplier);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Update supplier (Admin only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @Valid @RequestBody SupplierDTO supplierDTO) {
        try {
            Optional<SupplierDTO> updatedSupplier = supplierService.updateSupplier(id, supplierDTO);

            if (updatedSupplier.isPresent()) {
                return ResponseEntity.ok(updatedSupplier.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Supplier not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Update supplier performance rating (Admin only)
     */
    @PatchMapping("/{id}/rating")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePerformanceRating(@PathVariable Long id, @RequestParam Double rating) {
        if (rating < 0 || rating > 5) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Rating must be between 0 and 5");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Optional<SupplierDTO> updatedSupplier = supplierService.updatePerformanceRating(id, rating);

        if (updatedSupplier.isPresent()) {
            return ResponseEntity.ok(updatedSupplier.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Supplier not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Delete supplier (Admin only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        boolean deleted = supplierService.deleteSupplier(id);

        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "Supplier deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Supplier not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
