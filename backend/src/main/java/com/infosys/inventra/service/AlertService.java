package com.infosys.inventra.service;

import com.infosys.inventra.model.Alert;
import com.infosys.inventra.model.Order;
import com.infosys.inventra.model.Product;
import com.infosys.inventra.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAlertsForRole(String role) {
        return alertRepository.findByForRoleOrForRoleOrderByCreatedAtDesc(role, "ALL");
    }

    public List<Alert> getOpenAlerts() {
        return alertRepository.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    public long getOpenAlertCount() {
        return alertRepository.countByStatus("OPEN");
    }

    public Optional<Alert> acknowledgeAlert(Long id) {
        Optional<Alert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isEmpty()) {
            return Optional.empty();
        }

        Alert alert = alertOpt.get();
        if ("OPEN".equals(alert.getStatus())) {
            alert.setStatus("ACKNOWLEDGED");
        }

        return Optional.of(alertRepository.save(alert));
    }

    public Optional<Alert> resolveAlert(Long id) {
        Optional<Alert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isEmpty()) {
            return Optional.empty();
        }

        Alert alert = alertOpt.get();
        alert.setStatus("RESOLVED");
        return Optional.of(alertRepository.save(alert));
    }

    public void evaluateLowStockAlert(Product product) {
        boolean isLowOrOut = product.getQuantity() <= product.getMinThreshold();

        if (isLowOrOut) {
            if (!alertRepository.existsByProductIdAndStatus(product.getId(), "OPEN")) {
                Alert alert = new Alert();
                alert.setProductId(product.getId());
                alert.setTitle("Stock Alert: " + product.getName());
                alert.setMessage("Product " + product.getSku() + " is at " + product.getQuantity()
                        + " units (threshold: " + product.getMinThreshold() + ").");
                alert.setSeverity(product.getQuantity() == 0 ? "CRITICAL" : "WARNING");
                alert.setStatus("OPEN");
                alert.setForRole("ADMIN");
                alertRepository.save(alert);
            }
            return;
        }

        List<Alert> openProductAlerts = alertRepository.findByProductIdAndStatus(product.getId(), "OPEN");
        for (Alert alert : openProductAlerts) {
            alert.setStatus("RESOLVED");
            alertRepository.save(alert);
        }
    }

    public void createStockRequestAlert(Order order) {
        Alert alert = new Alert();
        alert.setOrderId(order.getId());
        alert.setTitle("New Stock-In Request");
        alert.setMessage("Order " + order.getOrderNumber() + " is pending admin approval.");
        alert.setSeverity("INFO");
        alert.setStatus("OPEN");
        alert.setForRole("ADMIN");
        alertRepository.save(alert);
    }

    public void createApprovalAlert(Order order) {
        Alert alert = new Alert();
        alert.setOrderId(order.getId());
        alert.setTitle("Stock-In Request Approved");
        alert.setMessage("Order " + order.getOrderNumber() + " has been approved and stock was updated.");
        alert.setSeverity("INFO");
        alert.setStatus("OPEN");
        alert.setForRole("ALL");
        alertRepository.save(alert);
    }
}
