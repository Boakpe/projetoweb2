package com.gamestore.dto;

import java.time.LocalDateTime;

public class UserResponse {
    private String username;
    private String email;
    private boolean admin;
    private Long userId;
    private LocalDateTime createdAt;

    public UserResponse(String username, String email, boolean admin, Long userId, LocalDateTime createdAt) {
        this.username = username;
        this.email = email;
        this.admin = admin;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    // Getters
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public boolean isAdmin() { return admin; }
    public Long getUserId() { return userId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setAdmin(boolean admin) { this.admin = admin; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}