import {Component, OnInit} from '@angular/core';
import {Product} from '../../common/product';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './product-details.component.html',
  standalone: true,
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product |any;
  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService,) {
  }
  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetail();
    })
  }

  private handleProductDetail() {
    // @ts-ignore
    const theProductId:number= +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(theProductId).subscribe(
      data =>{
        this.product = data;
      }
    )
  }

  addToCart() {
    console.log(this.product);
    const theCartItem=new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
