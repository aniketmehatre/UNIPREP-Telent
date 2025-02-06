import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionPlan } from "../../../@Models/subscription";

@Component({
    selector: 'uni-subscription-billing',
    templateUrl: './subscription-billing.component.html',
    styleUrls: ['./subscription-billing.component.scss'],
    standalone: false
})
export class SubscriptionBillingComponent implements OnInit {
  @Input() plan!: SubscriptionPlan | null;
  @Input() planQuestionCredit!: any | null
  @Output() change = new EventEmitter();
  @Output() changeQuestionCreditPlan = new EventEmitter();
  @Output() pay = new EventEmitter();
  @Output() payQuestionCredit = new EventEmitter();
  @Input() loading = false;
  constructor() {}

  ngOnInit(): void {

  }

}
