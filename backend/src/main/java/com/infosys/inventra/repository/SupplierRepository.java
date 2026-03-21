package com.infosys.inventra.repository;

import com.infosys.inventra.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    Optional<Supplier> findByEmail(String email);
    
    List<Supplier> findByStatus(String status);
    
    List<Supplier> findByNameContainingIgnoreCase(String name);
    
    List<Supplier> findByPerformanceRatingGreaterThanEqual(Double rating);
    
    boolean existsByEmail(String email);
}
