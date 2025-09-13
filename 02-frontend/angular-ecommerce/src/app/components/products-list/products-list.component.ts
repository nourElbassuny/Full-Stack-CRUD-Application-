import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-products-list',
  imports: [
    CurrencyPipe, NgFor, NgIf, RouterLink, NgbPagination
  ],
  templateUrl: './products-list-grid.component.html',
  standalone: true,
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  public products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElement: number = 0;
  previousCategoryId: number = 1;
  previousKeyword: string = '';

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();

    }

  }

  private handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the id param string and convert it to number
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log('currentCategoryId', this.currentCategoryId + 'the page Number', this.currentCategoryId);
    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElement = data.page.totalElements;
      }, error => {
        alert(error.message);
      }
    );
  }

  private handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword
    console.log('previous keyword', this.previousKeyword)

    this.productService.searchProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());
  }

  updatePageSize(value: string) {
    this.thePageSize = +value;
    this.thePageNumber = 1;
    this.listProducts();
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElement = data.page.totalElements;
    };
  }

  addToCart(item: Product) {
    console.log(item);
    const theCartItem=new CartItem(item);
    this.cartService.addToCart(theCartItem);
  }

}
