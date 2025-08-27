import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-article',
  imports: [MatCardModule],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  @Input() category_id!: number;
  @Input() subcategory_id!: number;
  @Input() title!: string;
  @Input() price!: number;
  @Input() img_src!: string;

  get formattedPrice(): string {
    return this.price.toFixed(2); // Formats the number to 2 decimal places
  }
}
