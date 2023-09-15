import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'uni-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss']
})
export class SubscriptionHistoryComponent implements OnInit {
  subscribedCountryList: any [] = [];
  subscribedHistoryData: any [] = [];
  userSubscription: any [] = [];
  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    this.loadSubscriptionHistory();
  }

  buttonclicked1(){

  }

  loadSubscriptionHistory(){
    let request = {
      country_id: '2'
    }
    this.subscriptionService.getSubscriptionDetails(request).subscribe((response) => {
      console.log(response);
      this.userSubscription = response.user_subscription;
      this.subscribedHistoryData = response.subscription_history;
      this.subscribedCountryList = response.country_list;
    })
  }
}
