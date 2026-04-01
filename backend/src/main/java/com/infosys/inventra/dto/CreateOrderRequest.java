package com.infosys.inventra.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    @NotBlank(message = "Order type is required")
    private String orderType; // PURCHASE, SALES, RETURN
    
    private Long supplierId;
    
    private String notes;
    
    private LocalDateTime expectedDeliveryDate;
    
    @NotNull(message = "Order items are required")
    private List<OrderItemDTO> orderItems;
}
