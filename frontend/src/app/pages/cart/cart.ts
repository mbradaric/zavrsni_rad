import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CartItem } from '../../core/models/cart-item';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartItems: CartItem[] = [
    {
      title: 'Modern Kitchen Desk',
      price: 199.99,
      quantity: 1,
      imgSrc: 'assets/images/kitchen-desk.jpg',
    },
    {
      title: 'Comfortable Living Room Sofa',
      price: 399.99,
      quantity: 2,
      imgSrc: 'assets/images/living-room-sofa.jpg',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
