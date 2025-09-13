import {Component, OnInit} from '@angular/core';
import {ProductsListComponent} from '../products-list/products-list.component';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../services/cart.service';
import {CurrencyPipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart-status',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './cart-status.component.html',
  standalone: true,
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit{
  totalPrice:number = 0;
  totalQuantity:number = 0;
  constructor( private cartService: CartService,) {
  }
  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus() {
    this.cartService.totalPrice.subscribe(
      data =>{
        this.totalPrice=data;
      }
    )
    this.cartService.totalQuantity.subscribe(
      data =>{
        this.totalQuantity=data;
      }
    )
  }
}
