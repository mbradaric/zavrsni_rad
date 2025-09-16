import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  addToCart(item: {
    id: number;
    title: string;
    price: number;
    imgSrc: string;
  }): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      // if item exists, increase quantity
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      // add new item with quantity 1
      const newItem: CartItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        imgSrc: item.imgSrc,
        quantity: 1,
      };
      this.cartItems.next([...currentItems, newItem]);
    }

    this.saveCart();
  }

  removeFromCart(itemId: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter((item) => item.id !== itemId);
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentItems = this.cartItems.value;
    const item = currentItems.find((cartItem) => cartItem.id === itemId);

    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}
