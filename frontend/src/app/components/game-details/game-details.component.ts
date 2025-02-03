import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Game {
  gameId: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  widescreenImageUrl: string;
  squareImageUrl: string;
  copiesSold: number;
  releaseDate: string;
}

interface CartItem {
  gameId: string;
  title: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Rating {
  userId: number;
  gameId: number;
  rating: number;
  comment: string;
  rating_id: number;
  createdAt: string;
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './game-details.component.html'
})
export class GameDetailsComponent implements OnInit {
  gameId: string | null = null;
  game?: Game;
  isLoading = true;
  error: string | null = null;
  isInCart: boolean = false;
  isOwned: boolean = false;
  ratings: Rating[] = [];
  averageRating: number = 0;
  newRating = {
    rating: 5,
    comment: ''
  };
  ratingError: string | null = null;
  userId: number | null = null;
  hasAlreadyRated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.fetchGame(this.gameId);
      this.fetchRatings(this.gameId);
    }
    window.scrollTo(0, 0);
    this.checkGameOwnership();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.userId || null;
    if (this.userId && this.gameId) {
      this.checkIfUserRated();
    }
  }

  private fetchGame(id: string) {
    this.http.get<Game>(`${environment.apiUrl}/games/${id}`).subscribe({
      next: (data) => {
        this.game = data;
        this.isLoading = false;
        this.checkIfInCart();
      },
      error: (error) => {
        this.error = 'Failed to load game details';
        this.isLoading = false;
        console.error('Error fetching game:', error);
      }
    });
  }

  private fetchRatings(gameId: string) {
    this.http.get<Rating[]>(`${environment.apiUrl}/games/${gameId}/ratings`).subscribe({
      next: (data) => {
        this.ratings = data;
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error fetching ratings:', error);
      }
    });
  }

  private calculateAverageRating() {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    // Make the average rating an integer
    this.averageRating = Math.round(sum / this.ratings.length);
  }

  getStarsArray(rating: number): number[] {
    const roundedRating = Math.round(rating);
    return [1, 2, 3, 4, 5].map(i => i <= roundedRating ? 1 : 0);
  }

  private checkGameOwnership() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.userId && this.gameId) {
      this.http.get<{owns_game: boolean}>(`${environment.apiUrl}/purchases/verify/${user.userId}/${this.gameId}`).subscribe({
        next: (response) => {
          this.isOwned = response.owns_game;
        },
        error: (error) => {
          console.error('Error checking game ownership:', error);
        }
      });
    }
  }

  checkIfInCart(): boolean {
    if (!this.game) return false;
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    this.isInCart = cartItems.some(item => item.gameId === this.game!.gameId.toString());
    return this.isInCart;
  }

  addToCart() {
    if (!this.game || this.checkIfInCart() || this.isOwned) return;

    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItem: CartItem = {
      gameId: this.game.gameId.toString(),
      title: this.game.title,
      price: this.game.price * (1 - this.game.discountPercentage / 100),
      quantity: 1,
      image_url: this.game.widescreenImageUrl
    };

    cartItems.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    this.isInCart = true;
  }

  private checkIfUserRated() {
    if (!this.userId || !this.gameId) return;
    
    this.http.get<{has_rated: boolean}>(`${environment.apiUrl}/ratings/verify/${this.userId}/${this.gameId}`).subscribe({
      next: (response) => {
        this.hasAlreadyRated = response.has_rated;
      },
      error: (error) => {
        console.error('Error checking if user rated:', error);
      }
    });
  }

  submitRating() {
    if (!this.game || !this.userId || this.hasAlreadyRated) return;

    const ratingData = {
      userId: this.userId,
      gameId: this.game.gameId,
      rating: this.newRating.rating,
      comment: this.newRating.comment
    };

    this.http.post<Rating>(`${environment.apiUrl}/ratings`, ratingData).subscribe({
      next: (response) => {
        console.log('Rating submitted:', response);
        this.ratings.unshift(response);
        this.calculateAverageRating();
        this.newRating = { rating: 5, comment: '' };
        this.ratingError = null;
        this.hasAlreadyRated = true; // Add this line
      },
      error: (error) => {
        this.ratingError = error.error.detail || 'Failed to submit rating';
        console.error('Error submitting rating:', error);
      }
    });
  }
}