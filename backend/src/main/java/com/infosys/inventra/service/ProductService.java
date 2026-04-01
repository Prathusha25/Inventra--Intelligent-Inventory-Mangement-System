package com.infosys.inventra.service;

import com.infosys.inventra.dto.CreateProductRequest;
import com.infosys.inventra.dto.ProductDTO;
import com.infosys.inventra.dto.UpdateProductRequest;
import com.infosys.inventra.model.Product;
import com.infosys.inventra.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AlertService alertService;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Get all products
     */
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get product by ID
     */
    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id).map(this::convertToDTO);
    }

    /**
     * Get product by SKU
     */
    public Optional<ProductDTO> getProductBySku(String sku) {
        return productRepository.findBySku(sku).map(this::convertToDTO);
    }

    /**
     * Create new product
     */
    public ProductDTO createProduct(CreateProductRequest request, Long actorUserId, String actorRole) {
        // Check if SKU already exists
        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with SKU '" + request.getSku() + "' already exists");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setMinThreshold(request.getMinThreshold() == null ? 10 : request.getMinThreshold());
        product.setPrice(request.getPrice());
        product.setSupplier(request.getSupplier());
        // Status will be set automatically in @PrePersist

        Product savedProduct = productRepository.save(product);
        alertService.evaluateLowStockAlert(savedProduct);
        auditLogService.log(
            "PRODUCT_CREATED",
            "PRODUCT",
            savedProduct.getId(),
            "Created product " + savedProduct.getName() + " (SKU: " + savedProduct.getSku() + ")",
            actorUserId,
            actorRole
        );
        return convertToDTO(savedProduct);
    }

    /**
     * Update product
     */
    public Optional<ProductDTO> updateProduct(Long id, UpdateProductRequest request, Long actorUserId, String actorRole) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            return Optional.empty();
        }

        Product product = productOpt.get();
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setMinThreshold(request.getMinThreshold() == null ? product.getMinThreshold() : request.getMinThreshold());
        product.setPrice(request.getPrice());
        product.setSupplier(request.getSupplier());
        // Status will be updated automatically in @PreUpdate

        Product updatedProduct = productRepository.save(product);
        alertService.evaluateLowStockAlert(updatedProduct);
        auditLogService.log(
            "PRODUCT_UPDATED",
            "PRODUCT",
            updatedProduct.getId(),
            "Updated product " + updatedProduct.getName() + " (SKU: " + updatedProduct.getSku() + ")",
            actorUserId,
            actorRole
        );
        return Optional.of(convertToDTO(updatedProduct));
    }

    /**
     * Delete product
     */
    public boolean deleteProduct(Long id, Long actorUserId, String actorRole) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            productRepository.deleteById(id);
            auditLogService.log(
                    "PRODUCT_DELETED",
                    "PRODUCT",
                    id,
                    "Deleted product " + product.getName() + " (SKU: " + product.getSku() + ")",
                    actorUserId,
                    actorRole
            );
            return true;
        }
        return false;
    }

    /**
     * Search products by keyword (name or SKU)
     */
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchByNameOrSku(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get products by category
     */
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get products by status
     */
    public List<ProductDTO> getProductsByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all categories
     */
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    /**
     * Get low stock products
     */
    public List<ProductDTO> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get out of stock products
     */
    public List<ProductDTO> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update product quantity
     */
    public Optional<ProductDTO> updateQuantity(Long id, Integer quantity, Long actorUserId, String actorRole) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            return Optional.empty();
        }

        Product product = productOpt.get();
        product.setQuantity(quantity);
        // Status will be updated automatically in @PreUpdate

        Product updatedProduct = productRepository.save(product);
        alertService.evaluateLowStockAlert(updatedProduct);
        auditLogService.log(
            "PRODUCT_QUANTITY_UPDATED",
            "PRODUCT",
            updatedProduct.getId(),
            "Updated quantity for " + updatedProduct.getName() + " to " + updatedProduct.getQuantity(),
            actorUserId,
            actorRole
        );
        return Optional.of(convertToDTO(updatedProduct));
    }

    /**
     * Convert Product entity to ProductDTO
     */
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setCategory(product.getCategory());
        dto.setQuantity(product.getQuantity());
        dto.setMinThreshold(product.getMinThreshold());
        dto.setPrice(product.getPrice());
        dto.setSupplier(product.getSupplier());
        dto.setStatus(product.getStatus());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
}
