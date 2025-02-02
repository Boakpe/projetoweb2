import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  game = {
    title: '',
    price: 0,
    description: '',
    widescreenImageUrl: '',
    squareImageUrl: '',
    releaseDate: '',
    discountPercentage: 0
  };

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    // Double-check admin status
    this.userService.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onSubmit() {
    this.http.post(`${environment.apiUrl}/games`, this.game)
      .subscribe({
        next: (response) => {
          alert('Game added successfully!');
          // Reset form
          this.game = {
            title: '',
            price: 0,
            description: '',
            widescreenImageUrl: '',
            squareImageUrl: '',
            releaseDate: '',
            discountPercentage: 0
          };
        },
        error: (error) => {
          alert('Error adding game: ' + error.message);
        }
      });
  }
}
