import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CardListComponent } from '../../components/card-list/card-list.component';
import { Game } from '../../interfaces/game.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, CardListComponent],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchGames();
    window.scrollTo(0, 0);
  }

  private fetchGames() {
    this.http.get<Game[]>(`${environment.apiUrl}/games?limit=1000`)
      .subscribe({
        next: (games) => {
          this.games = games;
        },
        error: (error) => {
          console.error('Error fetching games:', error);
        }
      });
  }

  get formattedGames() {
    return this.games.map(game => ({
      id: game.gameId.toString(),
      name: game.title,
      price: game.price,
      imageUrl: game.squareImageUrl,
      discountPercentage: game.discountPercentage,
    }));
  }
}
