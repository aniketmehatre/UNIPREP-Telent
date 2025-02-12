import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {SubscriptionService} from "../subscription.service";
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
    selector: 'uni-buy-credits',
    templateUrl: './buy-credits.component.html',
    styleUrls: ['./buy-credits.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
    
})
export class BuyCreditsComponent implements OnInit {
    stage = 1;
    buyCreditData: any [] = [];
    questionCreditData: any [] = [];

    constructor(private toastr: MessageService, private subscriptionService: SubscriptionService) {
    }

    ngOnInit(): void {
        this.subscriptionService.getQuestionCredit().subscribe(
            (res: any) => {
                this.questionCreditData = res.questioncredits;
            },
            (error: any) => {
                this.toastr.add({severity: 'error', summary: 'Failed', detail: error.error.message});
            }
        );
    }

    basicplan() {

    }


}
