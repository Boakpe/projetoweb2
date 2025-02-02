package com.gamestore;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    boolean existsByUserAndGame(User user, Game game);
    List<Rating> findByGame(Game game);
}