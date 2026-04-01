package com.infosys.inventra.service;

import com.infosys.inventra.dto.ReportDTO;
import com.infosys.inventra.model.AuditLog;
import com.infosys.inventra.model.Order;
import com.infosys.inventra.model.Product;
import com.infosys.inventra.repository.OrderRepository;
import com.infosys.inventra.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

        @Autowired
        private AuditLogService auditLogService;

    /**
     * Generate inventory stock report
     */
    public ReportDTO generateStockReport() {
        List<Product> products = productRepository.findAll();

        Map<String, Object> data = new HashMap<>();
        data.put("totalProducts", products.size());
        data.put("inStockCount", products.stream().filter(p -> "In Stock".equals(p.getStatus())).count());
        data.put("lowStockCount", products.stream().filter(p -> "Low Stock".equals(p.getStatus())).count());
        data.put("outOfStockCount", products.stream().filter(p -> "Out of Stock".equals(p.getStatus())).count());
        
        // Products by category
        Map<String, Long> categoryCount = products.stream()
                .collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()));
        data.put("productsByCategory", categoryCount);

        // Total inventory value
        BigDecimal totalValue = products.stream()
                .map(p -> p.getPrice().multiply(new BigDecimal(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalInventoryValue", totalValue);

        ReportDTO report = new ReportDTO();
        report.setReportType("STOCK");
        report.setGeneratedAt(LocalDateTime.now());
        report.setData(data);
        report.setSummary(summary);

        return report;
    }

    /**
     * Generate low stock alert report
     */
    public ReportDTO generateLowStockReport() {
                List<Product> lowStockProducts = productRepository.findLowStockProducts();

        Map<String, Object> data = new HashMap<>();
        data.put("lowStockProducts", lowStockProducts.stream()
                .map(p -> {
                    Map<String, Object> productData = new HashMap<>();
                    productData.put("id", p.getId());
                    productData.put("name", p.getName());
                    productData.put("sku", p.getSku());
                    productData.put("quantity", p.getQuantity());
                    productData.put("status", p.getStatus());
                    return productData;
                })
                .collect(Collectors.toList()));

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("lowStockCount", new BigDecimal(lowStockProducts.size()));

        ReportDTO report = new ReportDTO();
        report.setReportType("LOW_STOCK");
        report.setGeneratedAt(LocalDateTime.now());
        report.setData(data);
        report.setSummary(summary);

        return report;
    }

    /**
     * Generate sales report
     */
    public ReportDTO generateSalesReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        
        // Filter for sales orders only
        List<Order> salesOrders = orders.stream()
                .filter(o -> "SALES".equals(o.getOrderType()))
                .collect(Collectors.toList());

        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", salesOrders.size());
        
        // Orders by status
        Map<String, Long> ordersByStatus = salesOrders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        data.put("ordersByStatus", ordersByStatus);

        // Total sales amount
        BigDecimal totalSales = salesOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Average order value
        BigDecimal avgOrderValue = salesOrders.isEmpty() ? BigDecimal.ZERO : 
                totalSales.divide(new BigDecimal(salesOrders.size()), 2, RoundingMode.HALF_UP);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalSales", totalSales);
        summary.put("averageOrderValue", avgOrderValue);

        ReportDTO report = new ReportDTO();
        report.setReportType("SALES");
        report.setGeneratedAt(LocalDateTime.now());
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setData(data);
        report.setSummary(summary);

        return report;
    }

    /**
     * Generate order report
     */
    public ReportDTO generateOrderReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate);

        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", orders.size());
        
        // Orders by type
        Map<String, Long> ordersByType = orders.stream()
                .collect(Collectors.groupingBy(Order::getOrderType, Collectors.counting()));
        data.put("ordersByType", ordersByType);

        // Orders by status
        Map<String, Long> ordersByStatus = orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        data.put("ordersByStatus", ordersByStatus);

        // Total order value
        BigDecimal totalOrderValue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalOrderValue", totalOrderValue);

        ReportDTO report = new ReportDTO();
        report.setReportType("ORDER");
        report.setGeneratedAt(LocalDateTime.now());
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setData(data);
        report.setSummary(summary);

        return report;
    }

    /**
     * Generate comprehensive inventory report
     */
    public ReportDTO generateInventoryReport() {
        List<Product> products = productRepository.findAll();

        Map<String, Object> data = new HashMap<>();
        
        // Product statistics
        data.put("totalProducts", products.size());
        data.put("totalQuantity", products.stream().mapToInt(Product::getQuantity).sum());
        
        // Stock status
        data.put("inStock", products.stream().filter(p -> "In Stock".equals(p.getStatus())).count());
        data.put("lowStock", products.stream().filter(p -> "Low Stock".equals(p.getStatus())).count());
        data.put("outOfStock", products.stream().filter(p -> "Out of Stock".equals(p.getStatus())).count());
        
        // Category breakdown
        Map<String, Map<String, Object>> categoryBreakdown = products.stream()
                .collect(Collectors.groupingBy(Product::getCategory))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            List<Product> categoryProducts = entry.getValue();
                            Map<String, Object> stats = new HashMap<>();
                            stats.put("count", categoryProducts.size());
                            stats.put("totalQuantity", categoryProducts.stream().mapToInt(Product::getQuantity).sum());
                            stats.put("totalValue", categoryProducts.stream()
                                    .map(p -> p.getPrice().multiply(new BigDecimal(p.getQuantity())))
                                    .reduce(BigDecimal.ZERO, BigDecimal::add));
                            return stats;
                        }
                ));
        data.put("categoryBreakdown", categoryBreakdown);

        // Total inventory value
        BigDecimal totalValue = products.stream()
                .map(p -> p.getPrice().multiply(new BigDecimal(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalInventoryValue", totalValue);

        ReportDTO report = new ReportDTO();
        report.setReportType("INVENTORY");
        report.setGeneratedAt(LocalDateTime.now());
        report.setData(data);
        report.setSummary(summary);

        return report;
    }

        /**
         * Generate audit log report (Admin only)
         */
        public ReportDTO generateAuditLogReport() {
                List<AuditLog> logs = auditLogService.getRecentLogs();

                Map<String, Object> data = new HashMap<>();
                data.put("totalLogs", logs.size());
                data.put("logs", logs.stream().map(log -> {
                        Map<String, Object> logData = new HashMap<>();
                        logData.put("id", log.getId());
                        logData.put("action", log.getAction());
                        logData.put("entityType", log.getEntityType());
                        logData.put("entityId", log.getEntityId());
                        logData.put("description", log.getDescription());
                        logData.put("actorUserId", log.getActorUserId());
                        logData.put("actorRole", log.getActorRole());
                        logData.put("createdAt", log.getCreatedAt());
                        return logData;
                }).collect(Collectors.toList()));

                Map<String, Long> actionsByType = logs.stream()
                                .collect(Collectors.groupingBy(AuditLog::getAction, Collectors.counting()));
                data.put("actionsByType", actionsByType);

                Map<String, BigDecimal> summary = new HashMap<>();
                summary.put("logCount", new BigDecimal(logs.size()));

                ReportDTO report = new ReportDTO();
                report.setReportType("AUDIT_LOG");
                report.setGeneratedAt(LocalDateTime.now());
                report.setData(data);
                report.setSummary(summary);
                return report;
        }
}
