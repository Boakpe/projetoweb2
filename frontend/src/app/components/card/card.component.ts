import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  host: {
    class: 'block min-w-[250px]'
  }
})
export class CardComponent {
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() price!: number;
  @Input() discountPercentage!: number;
  @Input() id!: string;

  constructor(private router: Router) {}

  navigateToGame() {
    this.router.navigate(['/game', this.id]);
  }

  get discountedPrice(): number {
    return this.price * (1 - this.discountPercentage / 100);
  }
}