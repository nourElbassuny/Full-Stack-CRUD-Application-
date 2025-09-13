import {Component, OnInit} from '@angular/core';
import {ProductCategory} from '../../common/product-category';
import {ProductService} from '../../services/product.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-product-category-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './product-category-menu.component.html',
  standalone: true,
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {
    productCategories: ProductCategory[]=[];

    constructor(private productService: ProductService,) {

    }

    ngOnInit() {
      this.listProductCategories();
    }

  private listProductCategories() {
    this.productService.getProductCategories().subscribe(
      response => {
        this.productCategories = response;
      }
    );
  }
}
