package com.infosys.inventra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private Integer quantity;
    private BigDecimal price;
    private String supplier;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
