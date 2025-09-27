import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CartItem } from '../../core/models/cart-item';
import { CartService } from '../../core/services/cart-service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(
      (items) => (this.cartItems = items)
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item.id, item.quantity - 1);
    }
  }

  clearCart(): void {
    if (confirm('Jeste li sigurni da želite isprazniti korpu?')) {
      this.cartService.clearCart();
    }
  }

  checkout(): void {
    console.log('Nastavlja checkout sa artiklima:', this.cartItems);
    alert('TODO: dodati checkout funkcionalnost');
  }
}
