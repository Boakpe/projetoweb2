package com.gamestore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.gamestore.dto.LoginRequest;
import com.gamestore.dto.UserResponse;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class MainController {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private PurchaseRepository purchaseRepo;
    @Autowired
    private RatingRepository ratingRepo;

    // Users endpoints
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userRepo.existsByUsername(user.getUsername()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username exists");
        if (userRepo.existsByEmail(user.getEmail()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email exists");
        user.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(userRepo.save(user));
    }

    @PostMapping("/games")
    public ResponseEntity<Game> createGame(@RequestBody Game game) {
        game.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(gameRepo.save(game));
    }

    @GetMapping("/games")
    public List<Game> getGames(
            @RequestParam(defaultValue = "newest") String order,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "5") int limit) {
        List<Game> games = switch (order.toLowerCase()) {
            case "most_sold" -> gameRepo.findAll(Sort.by(Sort.Direction.DESC, "copiesSold"));
            case "biggest_discount" -> gameRepo.findAll(Sort.by(Sort.Direction.DESC, "discountPercentage"));
            default -> gameRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        };

        int endIndex = Math.min(skip + limit, games.size());
        return skip >= games.size() ? Collections.emptyList()
                : games.subList(skip, endIndex);
    }

    @GetMapping("/games/{id}")
    public Game getGame(@PathVariable Long id) {
        return gameRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));
    }

    // Purchases endpoints
    @PostMapping("/purchases")
    public ResponseEntity<Map<String, Object>> createPurchase(@RequestBody Map<String, Object> purchaseRequest) {
        // Validate required fields
        if (!purchaseRequest.containsKey("userId") || !purchaseRequest.containsKey("gameId") || !purchaseRequest.containsKey("purchasePrice")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }

        Object userIdObj = purchaseRequest.get("userId");
        Object gameIdObj = purchaseRequest.get("gameId");
        Object priceObj = purchaseRequest.get("purchasePrice");

        if (userIdObj == null || gameIdObj == null || priceObj == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Required fields cannot be null");
        }

        Long userId = ((Number) userIdObj).longValue();
        Long gameId = ((Number) gameIdObj).longValue();
        BigDecimal purchasePrice = BigDecimal.valueOf(((Number) priceObj).doubleValue());

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        if (purchaseRepo.existsByUserAndGame(user, game))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already purchased");

        game.setCopiesSold(game.getCopiesSold() + 1);
        gameRepo.save(game);

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setGame(game);
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setPurchasePrice(purchasePrice);
        purchaseRepo.save(purchase);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("gameId", gameId);
        response.put("purchasePrice", purchase.getPurchasePrice());
        response.put("purchaseId", purchase.getPurchaseId());
        response.put("purchaseDate", purchase.getPurchaseDate());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/purchases/verify/{userId}/{gameId}")
    public Map<String, Boolean> verifyPurchase(@PathVariable Long userId, @PathVariable Long gameId) {
        User user = userRepo.findById(userId).orElse(null);
        Game game = gameRepo.findById(gameId).orElse(null);
        boolean exists = user != null && game != null && purchaseRepo.existsByUserAndGame(user, game);
        return Collections.singletonMap("owns_game", exists);
    }

    // Ratings endpoints
    @PostMapping("/ratings")
    public ResponseEntity<Rating> createRating(@RequestBody Map<String, Object> ratingRequest) {
        // Validate required fields
        if (!ratingRequest.containsKey("userId") || !ratingRequest.containsKey("gameId") 
            || !ratingRequest.containsKey("rating") || !ratingRequest.containsKey("comment")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }

        // Safely convert input values
        Object userIdObj = ratingRequest.get("userId");
        Long userId = (userIdObj instanceof Number) ? ((Number) userIdObj).longValue() : Long.parseLong(userIdObj.toString());

        Object gameIdObj = ratingRequest.get("gameId");
        Long gameId = (gameIdObj instanceof Number) ? ((Number) gameIdObj).longValue() : Long.parseLong(gameIdObj.toString());

        Object ratingObj = ratingRequest.get("rating");
        Integer ratingValue = (ratingObj instanceof Number) ? ((Number) ratingObj).intValue() : Integer.parseInt(ratingObj.toString());

        String comment = (String) ratingRequest.get("comment");

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        if (ratingRepo.existsByUserAndGame(user, game))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already rated");

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setGame(game);
        rating.setRating(ratingValue);
        rating.setComment(comment);
        rating.setCreatedAt(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(ratingRepo.save(rating));
    }

    @GetMapping("/games/{gameId}/ratings")
    public List<Rating> getGameRatings(@PathVariable Long gameId) {
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return ratingRepo.findByGame(game);
    }

    @GetMapping("/ratings/verify/{userId}/{gameId}")
    public Map<String, Boolean> verifyRating(@PathVariable Long userId, @PathVariable Long gameId) {
        User user = userRepo.findById(userId).orElse(null);
        Game game = gameRepo.findById(gameId).orElse(null);
        boolean exists = user != null && game != null && ratingRepo.existsByUserAndGame(user, game);
        return Collections.singletonMap("has_rated", exists);
    }

    // Login endpoint
    @PostMapping("/login/")
    public UserResponse login(@RequestBody LoginRequest credentials) {
        User user = userRepo.findByUsername(credentials.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (!user.getPassword().equals(credentials.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        return new UserResponse(
                user.getUsername(),
                user.getEmail(),
                user.isAdmin(),
                user.getUserId(),
                user.getCreatedAt());
    }

    // Games endpoints
    @GetMapping("/users/{userId}/games")
    public List<Game> getUserGames(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return purchaseRepo.findByUser(user).stream()
                .map(Purchase::getGame)
                .toList();
    }
}