import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {customsopSubscriptionplans, SubscriptionPlan} from "../../../@Models/subscription";

@Component({
  selector: 'uni-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  @Input() plans: customsopSubscriptionplans[] = [];
  @Output() selected = new EventEmitter<customsopSubscriptionplans>();
  constructor() { }

  ngOnInit(): void {
  }

}
