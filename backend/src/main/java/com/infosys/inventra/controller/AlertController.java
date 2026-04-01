package com.infosys.inventra.controller;

import com.infosys.inventra.model.Alert;
import com.infosys.inventra.model.User;
import com.infosys.inventra.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping("/my")
    public ResponseEntity<List<Alert>> getMyAlerts(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(alertService.getAlertsForRole(user.getRole()));
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Alert>> getOpenAlerts() {
        return ResponseEntity.ok(alertService.getOpenAlerts());
    }

    @GetMapping("/open/count")
    public ResponseEntity<Map<String, Long>> getOpenAlertsCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", alertService.getOpenAlertCount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<?> acknowledgeAlert(@PathVariable Long id) {
        Optional<Alert> alertOpt = alertService.acknowledgeAlert(id);
        if (alertOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Alert not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        return ResponseEntity.ok(alertOpt.get());
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolveAlert(@PathVariable Long id) {
        Optional<Alert> alertOpt = alertService.resolveAlert(id);
        if (alertOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Alert not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        return ResponseEntity.ok(alertOpt.get());
    }
}
