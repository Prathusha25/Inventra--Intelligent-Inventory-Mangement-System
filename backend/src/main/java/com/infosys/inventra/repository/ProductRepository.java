package com.infosys.inventra.repository;

import com.infosys.inventra.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find product by SKU
     */
    Optional<Product> findBySku(String sku);

    /**
     * Check if product exists by SKU
     */
    boolean existsBySku(String sku);

    /**
     * Find products by category
     */
    List<Product> findByCategory(String category);

    /**
     * Find products by status
     */
    List<Product> findByStatus(String status);

    /**
     * Search products by name or SKU
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByNameOrSku(@Param("keyword") String keyword);

    /**
     * Find products by category and status
     */
    List<Product> findByCategoryAndStatus(String category, String status);

    /**
     * Get all distinct categories
     */
    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findAllCategories();

    /**
     * Find products with low stock (quantity < threshold)
     */
    @Query("SELECT p FROM Product p WHERE p.quantity < :threshold AND p.quantity > 0")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    /**
     * Find products by quantity less than specified value
     */
    List<Product> findByQuantityLessThan(Integer quantity);

    /**
     * Find out of stock products
     */
    @Query("SELECT p FROM Product p WHERE p.quantity = 0")
    List<Product> findOutOfStockProducts();
}
