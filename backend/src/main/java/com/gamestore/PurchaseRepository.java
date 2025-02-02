package com.gamestore;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    boolean existsByUserAndGame(User user, Game game);
    List<Purchase> findByUser(User user);
}