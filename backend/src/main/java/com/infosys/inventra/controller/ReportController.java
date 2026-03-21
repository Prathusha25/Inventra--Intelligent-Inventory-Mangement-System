package com.infosys.inventra.controller;

import com.infosys.inventra.dto.ReportDTO;
import com.infosys.inventra.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Generate stock report (Admin can generate, Employee can view basic stock info)
     */
    @GetMapping("/stock")
    public ResponseEntity<ReportDTO> generateStockReport() {
        ReportDTO report = reportService.generateStockReport();
        return ResponseEntity.ok(report);
    }

    /**
     * Generate low stock alert report (All authenticated users can view)
     */
    @GetMapping("/low-stock")
    public ResponseEntity<ReportDTO> generateLowStockReport() {
        ReportDTO report = reportService.generateLowStockReport();
        return ResponseEntity.ok(report);
    }

    /**
     * Generate sales report (Admin only)
     */
    @GetMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportDTO> generateSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        ReportDTO report = reportService.generateSalesReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    /**
     * Generate order report (Admin only)
     */
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportDTO> generateOrderReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        ReportDTO report = reportService.generateOrderReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    /**
     * Generate comprehensive inventory report (Admin only)
     */
    @GetMapping("/inventory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportDTO> generateInventoryReport() {
        ReportDTO report = reportService.generateInventoryReport();
        return ResponseEntity.ok(report);
    }
}
