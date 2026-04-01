package com.infosys.inventra.repository;

import com.infosys.inventra.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByStatusOrderByCreatedAtDesc(String status);

    List<Alert> findByForRoleOrForRoleOrderByCreatedAtDesc(String role, String allRole);

    List<Alert> findByProductIdAndStatus(Long productId, String status);

    boolean existsByProductIdAndStatus(Long productId, String status);

    long countByStatus(String status);
}
