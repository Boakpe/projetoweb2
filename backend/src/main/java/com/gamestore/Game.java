package com.gamestore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameId;
    
    private String title;
    private BigDecimal price;
    private String widescreenImageUrl;
    private String squareImageUrl;
    @Column(length = 1000)
    private String description;
    private LocalDateTime releaseDate;
    private Integer discountPercentage = 0;
    private Integer copiesSold = 0;
    private LocalDateTime createdAt = LocalDateTime.now();
}