import {Customer} from './customer';
import {Address} from './address';
import {Order} from './order';
import {OrderItem} from './order-item';

export class Purchase {
  customer:Customer|undefined;

  shippingAddress: Address =new Address();
  pillingAddress:Address=new Address();
  order:Order|undefined;
  orderItems:OrderItem[]|undefined;
}
