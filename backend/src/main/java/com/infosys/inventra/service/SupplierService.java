package com.infosys.inventra.service;

import com.infosys.inventra.dto.SupplierDTO;
import com.infosys.inventra.model.Supplier;
import com.infosys.inventra.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    /**
     * Get all suppliers
     */
    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get supplier by ID
     */
    public Optional<SupplierDTO> getSupplierById(Long id) {
        return supplierRepository.findById(id).map(this::convertToDTO);
    }

    /**
     * Get suppliers by status
     */
    public List<SupplierDTO> getSuppliersByStatus(String status) {
        return supplierRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search suppliers by name
     */
    public List<SupplierDTO> searchSuppliers(String keyword) {
        return supplierRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get top rated suppliers
     */
    public List<SupplierDTO> getTopRatedSuppliers(Double minRating) {
        return supplierRepository.findByPerformanceRatingGreaterThanEqual(minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create new supplier
     */
    public SupplierDTO createSupplier(SupplierDTO supplierDTO) {
        if (supplierRepository.existsByEmail(supplierDTO.getEmail())) {
            throw new RuntimeException("Supplier with this email already exists");
        }

        Supplier supplier = convertToEntity(supplierDTO);
        supplier = supplierRepository.save(supplier);
        return convertToDTO(supplier);
    }

    /**
     * Update supplier
     */
    public Optional<SupplierDTO> updateSupplier(Long id, SupplierDTO supplierDTO) {
        Optional<Supplier> supplierOpt = supplierRepository.findById(id);

        if (supplierOpt.isEmpty()) {
            return Optional.empty();
        }

        Supplier supplier = supplierOpt.get();

        // Check if email is being changed and if it's already taken
        if (!supplier.getEmail().equals(supplierDTO.getEmail())) {
            if (supplierRepository.existsByEmail(supplierDTO.getEmail())) {
                throw new RuntimeException("Supplier with this email already exists");
            }
        }

        updateSupplierFromDTO(supplier, supplierDTO);
        supplier = supplierRepository.save(supplier);
        return Optional.of(convertToDTO(supplier));
    }

    /**
     * Delete supplier
     */
    public boolean deleteSupplier(Long id) {
        if (supplierRepository.existsById(id)) {
            supplierRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Update supplier performance rating
     */
    public Optional<SupplierDTO> updatePerformanceRating(Long id, Double rating) {
        Optional<Supplier> supplierOpt = supplierRepository.findById(id);

        if (supplierOpt.isEmpty()) {
            return Optional.empty();
        }

        Supplier supplier = supplierOpt.get();
        supplier.setPerformanceRating(rating);
        supplier = supplierRepository.save(supplier);
        return Optional.of(convertToDTO(supplier));
    }

    /**
     * Convert Supplier entity to DTO
     */
    private SupplierDTO convertToDTO(Supplier supplier) {
        SupplierDTO dto = new SupplierDTO();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setContactPerson(supplier.getContactPerson());
        dto.setEmail(supplier.getEmail());
        dto.setPhone(supplier.getPhone());
        dto.setAddress(supplier.getAddress());
        dto.setCity(supplier.getCity());
        dto.setState(supplier.getState());
        dto.setPostalCode(supplier.getPostalCode());
        dto.setCountry(supplier.getCountry());
        dto.setContractTerms(supplier.getContractTerms());
        dto.setPerformanceRating(supplier.getPerformanceRating());
        dto.setStatus(supplier.getStatus());
        return dto;
    }

    /**
     * Convert DTO to Supplier entity
     */
    private Supplier convertToEntity(SupplierDTO dto) {
        Supplier supplier = new Supplier();
        updateSupplierFromDTO(supplier, dto);
        return supplier;
    }

    /**
     * Update Supplier entity from DTO
     */
    private void updateSupplierFromDTO(Supplier supplier, SupplierDTO dto) {
        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setCity(dto.getCity());
        supplier.setState(dto.getState());
        supplier.setPostalCode(dto.getPostalCode());
        supplier.setCountry(dto.getCountry());
        supplier.setContractTerms(dto.getContractTerms());
        supplier.setPerformanceRating(dto.getPerformanceRating());
        if (dto.getStatus() != null) {
            supplier.setStatus(dto.getStatus());
        }
    }
}
