import {Component, OnInit} from '@angular/core';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart-details',
  imports: [
    NgForOf,
    CurrencyPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './cart-details.component.html',
  standalone: true,
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService,) {

  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  private listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data
      }, error => {
        alert(error);
      }
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
    this.cartService.computeTotal();
  }

  incrementQuantity(item: CartItem) {
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.decrementQuantity(item);
  }

  remove(item: CartItem) {
    this.cartService.remove(item);
  }
}
