package com.infosys.inventra.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "order_id")
    private Long orderId;

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank(message = "Message is required")
    @Column(nullable = false, length = 1000)
    private String message;

    @NotBlank(message = "Severity is required")
    @Column(nullable = false, length = 50)
    private String severity; // INFO, WARNING, CRITICAL

    @NotBlank(message = "Status is required")
    @Column(nullable = false, length = 50)
    private String status; // OPEN, ACKNOWLEDGED, RESOLVED

    @NotBlank(message = "Target role is required")
    @Column(name = "for_role", nullable = false, length = 50)
    private String forRole; // ADMIN, EMPLOYEE, ALL

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) {
            status = "OPEN";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if ("RESOLVED".equals(status) && resolvedAt == null) {
            resolvedAt = LocalDateTime.now();
        }
    }
}
