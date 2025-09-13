import {Component, OnInit} from '@angular/core';
import {OrderHistory} from '../../common/order-history';
import {OrderHistoryService} from '../../services/order-history.service';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports: [
    NgIf,
    NgForOf,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './order-history.component.html',
  standalone: true,
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit{
 orderHistoryList:OrderHistory[]=[];
 storage:Storage=sessionStorage;

 constructor(private orderHistoryService:OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }


  private handleOrderHistory() {
    const theEmail=JSON.parse(this.storage.getItem('userEmail')!);

    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      res=>this.orderHistoryList=res._embedded.orders
      ,error => {alert(error.message);}
    )
  }
}
