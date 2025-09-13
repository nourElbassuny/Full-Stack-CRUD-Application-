import {Routes, provideRouter, Router} from '@angular/router';
import {AppComponent} from './app.component';
import {ProductsListComponent} from './components/products-list/products-list.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG, OktaAuthGuard
} from '@okta/okta-angular';
import {LoginComponent} from './components/login/login.component';
import {importProvidersFrom, Injector} from '@angular/core';
import {MembersPageComponent} from './components/members-page/members-page.component';
import {OktaAuth} from '@okta/okta-auth-js';
import {OrderHistoryComponent} from './components/order-history/order-history.component';

function sendToLoginPage(oktaAuth: OktaAuth,injector:Injector) {
    const  router=injector.get(Router);
    router.navigate(['/login'])
}

export const routes: Routes = [
  {path:'members',component: MembersPageComponent,canActivate:[OktaAuthGuard],
      data:{onAuthRequired:sendToLoginPage}},
  {path:'order-history',component:OrderHistoryComponent},
  {path:'login/callback',component: OktaCallbackComponent},
  {path:'login',component:LoginComponent},
  {path: 'checkout', component: CheckoutComponent,canActivate:[OktaAuthGuard],
    data:{onAuthRequired:sendToLoginPage}},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductsListComponent},
  {path: 'category/:id', component: ProductsListComponent},
  {path: 'category', component: ProductsListComponent},
  {path: 'products', component: ProductsListComponent},

  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
];
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),importProvidersFrom(OktaAuthModule),
  ]
});
