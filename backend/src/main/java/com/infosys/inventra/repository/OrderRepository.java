package com.infosys.inventra.repository;

import com.infosys.inventra.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByUserId(Long userId);
    
    List<Order> findBySupplierId(Long supplierId);
    
    List<Order> findByStatus(String status);
    
    List<Order> findByOrderType(String orderType);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByUserIdAndStatus(Long userId, String status);
    
    boolean existsByOrderNumber(String orderNumber);
}
