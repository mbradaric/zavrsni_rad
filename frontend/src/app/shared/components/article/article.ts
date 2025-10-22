import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../core/services/cart-service';
import { CATEGORIES } from '../../../core/models/article-categories';

@Component({
  selector: 'app-article',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  @Input() articleId!: number;
  @Input() category_id!: number;
  @Input() subcategory_id!: number;
  @Input() title!: string;
  @Input() price!: number;
  @Input() img_src!: string;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  get formattedPrice(): string {
    return this.price.toFixed(2);
  }

  getCategoryName(category_id: number): string {
    return CATEGORIES.find((cat) => cat.id === category_id)?.name || '';
  }

  getSubcategoryName(category_id: number, subcategory_id: number): string {
    const category = CATEGORIES.find((cat) => cat.id === category_id);
    return (
      category?.subcategories.find((sub) => sub.id === subcategory_id)?.name ||
      ''
    );
  }

  addToCart(): void {
    if (!this.articleId) {
      console.error('Article ID missing');
      this.snackBar.open('Došlo je do pogreške', 'Zatvori', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.cartService.addToCart({
      id: this.articleId,
      title: this.title,
      price: this.price,
      imgSrc: this.img_src,
    });

    this.snackBar.open(`Artikal ${this.title} dodan u korpu`, 'Zatvori', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });

    console.log(`Dodan artikal ${this.articleId} : ${this.title}`);
  }
}
