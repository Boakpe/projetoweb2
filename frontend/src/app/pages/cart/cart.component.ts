import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

interface CartItem {
  gameId: string;
  title: string;
  price: number;
  quantity: number;
  image_url: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  isLoggedIn = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    window.scrollTo(0, 0);
    this.userService.isLoggedIn$.subscribe(
      status => this.isLoggedIn = status
    );
  }

  loadCart() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.gameId !== item.gameId);
    this.updateLocalStorage();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  async handleCheckout() {
    if (!this.isLoggedIn) {
      alert('Please log in or register to complete your purchase');
      this.router.navigate(['/register']);
      return;
    }

    try {
      this.isLoading = true;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Create purchases for each game in cart
      const purchases = this.cartItems.map(item => ({
        userId: user.userId,
        gameId: parseInt(item.gameId),
        purchasePrice: item.price
      }));

      // Send all purchase requests
      await Promise.all(
        purchases.map(purchase => {
          this.http.post(`${environment.apiUrl}/purchases`, purchase).toPromise()
        }
        )
      );

      // Clear cart after successful purchase
      this.cartItems = [];
      this.updateLocalStorage();
      alert('Purchase completed successfully!');
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }
}
