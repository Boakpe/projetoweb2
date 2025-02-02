package com.gamestore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Game game;
    
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();
}