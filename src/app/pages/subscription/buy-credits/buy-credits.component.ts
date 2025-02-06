import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {SubscriptionService} from "../subscription.service";

@Component({
    selector: 'uni-buy-credits',
    templateUrl: './buy-credits.component.html',
    styleUrls: ['./buy-credits.component.scss'],
    standalone: false
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
