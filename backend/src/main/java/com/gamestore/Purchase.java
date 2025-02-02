package com.gamestore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseId;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Game game;
    
    private BigDecimal purchasePrice;
    private LocalDateTime purchaseDate = LocalDateTime.now();

    // Getters
    public Long getPurchaseId() { return purchaseId; }
    public User getUser() { return user; }
    public Game getGame() { return game; }
    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public LocalDateTime getPurchaseDate() { return purchaseDate; }

    // Setters
    public void setPurchaseId(Long purchaseId) { this.purchaseId = purchaseId; }
    public void setUser(User user) { this.user = user; }
    public void setGame(Game game) { this.game = game; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }
}