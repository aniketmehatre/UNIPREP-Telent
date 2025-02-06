import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionPlan, SubscriptionSuccess} from "../../../@Models/subscription";

@Component({
    selector: 'uni-subscription-success',
    templateUrl: './subscription-success.component.html',
    styleUrls: ['./subscription-success.component.scss'],
    standalone: false
})
export class SubscriptionSuccessComponent implements OnInit {

  @Input() plan!: SubscriptionSuccess | null;
  now = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
