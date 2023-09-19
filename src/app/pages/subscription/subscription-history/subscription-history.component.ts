import {Component, Input, OnInit} from '@angular/core';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'uni-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss']
})
export class SubscriptionHistoryComponent implements OnInit {

  @Input() userSubscription: any;
  @Input() subscribedHistoryData: any;
  @Input() subscribedCountryList: any;
  constructor() {
  }

  ngOnInit(): void {

  }

  buttonclicked1(){

  }


}
