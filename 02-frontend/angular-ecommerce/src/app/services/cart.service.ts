import {Injectable} from '@angular/core';
import {CartItem} from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';
import {Product} from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new  BehaviorSubject<number>(0);
  storage:Storage = localStorage;
  constructor() {
    //convert string to object
    let data=JSON.parse(this.storage.getItem('cartItems')!);
    if (data!=null){
      this.cartItems = data
      this.computeTotal();
    }
  }
  persistCartItem() {
    //convert object to string
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem|undefined=undefined ;
    if (this.cartItems.length > 0) {
      existingCartItem= this.cartItems.find(item => item.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {

      // @ts-ignore
      existingCartItem.quantity++;
    }else {
      this.cartItems.push(theCartItem);
    }
    this.computeTotal();
  }

  public computeTotal() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;
    for (let item of this.cartItems) {
      totalPriceValue += item.quantity*item.unitPrice;
      totalQuantityValue += item.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue,totalQuantityValue);

    this.persistCartItem();
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contents of the cart');
    for (let item of this.cartItems) {
      const  subTotalPrice =item.quantity*item.unitPrice;
      console.log(`name ${item.name} subTotalPrice: ${subTotalPrice}`);
    }
    console.log('total price value is: ', totalPriceValue.toFixed(2));
    console.log(totalQuantityValue.toFixed(2));
    console.log('-------')
  }

  decrementQuantity(item: CartItem) {
    item.quantity--;
    if (item.quantity ===0){
      this.remove(item);
    }else {
      this.computeTotal();
    }
  }

  remove(item: CartItem) {
    const index = this.cartItems.findIndex(it => it.id === item.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeTotal();
    }
  }
}
