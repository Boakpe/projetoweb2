import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

interface Product {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  discountPercentage?: number;
}

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class CardListComponent {
  @Input() title: string = '';
  @Input() products: Product[] = [];
  @Input() id: string = '';
}