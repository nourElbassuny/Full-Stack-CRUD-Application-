import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Luv2ShopFormService} from '../../services/luv2-shop-form.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';
import {ShopValidators} from '../../validators/shop-validators';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service';
import {Router} from '@angular/router';
import {Order} from '../../commmon/order';
import {OrderItem} from '../../commmon/order-item';
import {Purchase} from '../../commmon/purchase';


@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './checkout.component.html',
  standalone: true,
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutFromGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];
  countries: Country[] = [];
  shippingAddressSates: State[] = [];
  billingAddressSates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router,) {
  }

  ngOnInit() {

    this.reviewCartDetails();


    this.validators();

    const startMonth: number = new Date().getMonth() + 1;
    console.log(startMonth);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month" + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    )

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card year" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries for country " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  onSubmit() {
    if (this.checkoutFromGroup.invalid) {
      console.log("Form is invalid. Errors:");

      Object.keys(this.checkoutFromGroup.controls).forEach((key) => {
        const control = this.checkoutFromGroup.get(key);

        if (control && control.invalid) {
          console.log(`- ${key} has errors:`, control.errors);
        }
      });

      this.checkoutFromGroup.markAllAsTouched();
      return;
    }
    // set up order
    console.log("handling the submit button");

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems;
    //create orderItems from cartItems

    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    console.log(orderItems.length);
    // for (let i=0; i<cartItems.length;i++){
    //   orderItems[i]=new OrderItem(cartItems[i]);
    // }


    //set up purchase
    let purchase = new Purchase();
    //populate purchase - customer
    purchase.customer = this.checkoutFromGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFromGroup.controls['shippingAddress'].value || {};
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    console.log(shippingCountry);
    console.log(shippingState);
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry;

    //populate purchase - pilling address
    purchase.pillingAddress = this.checkoutFromGroup.controls['shippingAddress'].value;
    const pillingState: State = JSON.parse(JSON.stringify(purchase.pillingAddress?.state));
    const pillingCountry: Country = JSON.parse(JSON.stringify(purchase.pillingAddress?.country));

    purchase.pillingAddress.state = shippingState.name;

    purchase.pillingAddress.country = shippingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    //call rest API via the CheckoutService

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert('Your order has been successfully placed');
          this.resetCart();
        },
        error: error => {
          alert(error.message)
        }
      }
    );
  }

  get firstName() {
    return this.checkoutFromGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFromGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFromGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFromGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFromGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFromGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutFromGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutFromGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFromGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFromGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFromGroup.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutFromGroup.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFromGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFromGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFromGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFromGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFromGroup.get('creditCard.securityCode');
  }


  copyShippingAddressToBillingAddress(event: Event) {
    const checkbox: HTMLInputElement = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFromGroup.controls['billingAddress']
        .setValue(
          this.checkoutFromGroup.controls['shippingAddress'].value
        );
      this.billingAddressSates = this.shippingAddressSates
    } else {
      this.checkoutFromGroup.controls['billingAddress'].reset();
      this.billingAddressSates = [];
    }
  }

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFromGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    console.log(selectedYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month" + JSON.stringify(data));
        this.creditCardMonth = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFromGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(countryName)
    console.log(countryCode)
    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressSates = data;
        } else {
          this.billingAddressSates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  private validators(): void {
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl(theEmail, [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        country: new FormControl('',
          [Validators.required]),
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('',
          [Validators.required, Validators.minLength(2)]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',
          [Validators.required, Validators.minLength(2)]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
          [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('',
        ),
        expirationYear: new FormControl('',
        ),
      }),
    });
  }


  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice,
    );
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity,
    );

  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);

    this.checkoutFromGroup.reset();

    this.router.navigateByUrl("/products");
  }
}
