package com.infosys.inventra.controller;

import com.infosys.inventra.dto.OrderDTO;
import com.infosys.inventra.dto.CreateOrderRequest;
import com.infosys.inventra.model.User;
import com.infosys.inventra.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Get all orders (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Get order by ID
     * Admin can view any order, Employee can only view their own
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, Authentication authentication) {
        Optional<OrderDTO> order = orderService.getOrderById(id);

        if (order.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Order not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = (User) authentication.getPrincipal();
        OrderDTO orderDTO = order.get();

        // Check if employee is trying to access someone else's order
        if (!user.getRole().equals("ADMIN") && !orderDTO.getUserId().equals(user.getId())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Access denied");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        return ResponseEntity.ok(orderDTO);
    }

    /**
     * Get orders by user (Employee can view own orders, Admin can view any user's orders)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable Long userId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        // Check if employee is trying to access someone else's orders
        if (!user.getRole().equals("ADMIN") && !userId.equals(user.getId())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Access denied");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get my orders (for current logged-in user)
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<OrderDTO> orders = orderService.getOrdersByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }

    /**
     * Get orders by status (Admin only)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get orders by date range (Admin only)
     */
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<OrderDTO> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    /**
     * Create new order (All authenticated users)
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();

            // Employee workflow: allow stock-in request creation only as PURCHASE requests
            if (!"ADMIN".equals(user.getRole()) && !"PURCHASE".equalsIgnoreCase(request.getOrderType())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Employees can only create stock-in purchase requests");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            // Convert CreateOrderRequest to OrderDTO
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setUserId(user.getId());
            orderDTO.setOrderType(request.getOrderType().toUpperCase());
            orderDTO.setSupplierId(request.getSupplierId());
            orderDTO.setNotes(request.getNotes());
            orderDTO.setOrderItems(request.getOrderItems());
            orderDTO.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
            
            OrderDTO createdOrder = orderService.createOrder(orderDTO, user.getId(), user.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Update order
     * Admin can update any order, Employee can only update their own pending orders
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDTO orderDTO, 
                                        Authentication authentication) {
        try {
            Optional<OrderDTO> existingOrder = orderService.getOrderById(id);

            if (existingOrder.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            User user = (User) authentication.getPrincipal();
            OrderDTO existing = existingOrder.get();

            // Check if employee is trying to update someone else's order
            if (!user.getRole().equals("ADMIN") && !existing.getUserId().equals(user.getId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            // Employees can only update their pending orders
            if (!user.getRole().equals("ADMIN") && !"PENDING".equals(existing.getStatus())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Can only update pending orders");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            Optional<OrderDTO> updatedOrder = orderService.updateOrder(id, orderDTO, user.getId(), user.getRole());

            if (updatedOrder.isPresent()) {
                return ResponseEntity.ok(updatedOrder.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Approve order (Admin only)
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveOrder(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<OrderDTO> approvedOrder = orderService.approveOrder(id, user.getId());

            if (approvedOrder.isPresent()) {
                return ResponseEntity.ok(approvedOrder.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Cancel order
     * Admin can cancel any order, Employee can only cancel their own pending orders
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, Authentication authentication) {
        try {
            Optional<OrderDTO> existingOrder = orderService.getOrderById(id);

            if (existingOrder.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            User user = (User) authentication.getPrincipal();
            OrderDTO existing = existingOrder.get();

            // Check if employee is trying to cancel someone else's order
            if (!user.getRole().equals("ADMIN") && !existing.getUserId().equals(user.getId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            Optional<OrderDTO> cancelledOrder = orderService.cancelOrder(id, user.getId(), user.getRole());

            if (cancelledOrder.isPresent()) {
                return ResponseEntity.ok(cancelledOrder.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Order not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete order (Admin only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean deleted = orderService.deleteOrder(id, user.getId(), user.getRole());

        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "Order deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Order not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
