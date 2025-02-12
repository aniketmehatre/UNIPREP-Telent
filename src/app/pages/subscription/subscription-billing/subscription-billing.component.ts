import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionPlan } from "../../../@Models/subscription";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
    selector: 'uni-subscription-billing',
    templateUrl: './subscription-billing.component.html',
    styleUrls: ['./subscription-billing.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
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
