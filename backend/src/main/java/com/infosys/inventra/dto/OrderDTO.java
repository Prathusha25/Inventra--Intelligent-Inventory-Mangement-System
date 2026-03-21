package com.infosys.inventra.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private Long supplierId;
    
    @NotBlank(message = "Order type is required")
    private String orderType; // PURCHASE, SALES, RETURN
    
    @NotBlank(message = "Status is required")
    private String status; // PENDING, APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount must be greater than or equal to 0")
    private BigDecimal totalAmount;
    
    private String notes;
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    private Long approvedBy;
    private LocalDateTime approvedAt;
    
    private List<OrderItemDTO> orderItems;
}
