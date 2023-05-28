import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionPlan} from "../../../@Models/subscription";

@Component({
  selector: 'uni-subscription-billing',
  templateUrl: './subscription-billing.component.html',
  styleUrls: ['./subscription-billing.component.scss']
})
export class SubscriptionBillingComponent implements OnInit {
  @Input() plan!: SubscriptionPlan | null;
  @Output() change = new EventEmitter();
  @Output() pay = new EventEmitter();
  @Input() loading = false;
  constructor() { }

  ngOnInit(): void {
  }

}
