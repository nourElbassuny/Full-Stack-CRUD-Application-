import { Component } from '@angular/core';
import {ProductsListComponent} from './components/products-list/products-list.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component';
import {SearchComponent} from './components/search/search.component';
import {NgbAlert, NgbAlertModule, NgbModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {LoginStatusComponent} from './components/login-status/login-status.component';
@Component({
  selector: 'app-root',
  imports: [NgbAlert, NgbPaginationModule, NgbAlertModule, ProductsListComponent, HttpClientModule, RouterOutlet, RouterLink, RouterLinkActive, ProductCategoryMenuComponent, SearchComponent, CartStatusComponent, LoginStatusComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ecommerce';
}
