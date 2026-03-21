package com.infosys.inventra.model;

/**
 * Enum representing user roles in the inventory management system
 */
public enum Role {
    ADMIN("ADMIN", "Administrator with full system access"),
    EMPLOYEE("EMPLOYEE", "Employee with limited operational access");

    private final String name;
    private final String description;

    Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return name;
    }
}
