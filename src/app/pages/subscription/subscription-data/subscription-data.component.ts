import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Billinginfo, OrderHistory, Subscription} from "../../../@Models/subscription";
import {environment} from "@env/environment.prod";

@Component({
  selector: 'uni-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.scss']
})
export class SubscriptionDataComponent implements OnInit {

  @Input() billing!: any | null;
  @Input() subscriptions!: Subscription | null;
  @Input() history: OrderHistory[] = [];
  @Output() upgrade = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  get URL() {
    return `${environment.ApiUrl}/downloadinvoice`;
  }
  onSuc(event: any) {
    console.log(event);
  }
  onErr(event: any) {
    console.log(event);
  }

}
