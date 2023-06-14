import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {customsopSubscriptionplans} from "../../../@Models/subscription";
import {AuthService} from "../../../Auth/auth.service";
import {SubscriptionService} from "../subscription.service";

@Component({
    selector: "uni-subscription-list",
    templateUrl: "./subscription-list.component.html",
    styleUrls: ["./subscription-list.component.scss"],
})
export class SubscriptionListComponent implements OnInit {
    @Input() plans: customsopSubscriptionplans[] = [];
    @Output() selected = new EventEmitter<any>();
    @Output() selectedCredit = new EventEmitter<any>();
    @Input() country: any;
    countryList: any;
    isNormalPlanSelected: boolean = true;
    isBuyCreditSelected: boolean = false;
    buttonText: string = "Buy Question Credit";
    questionCreditData: any[] = [];
    selectedCountry: any[] = [[2], [2], [2], [2]];
    selectedCountryList: any
    @Input() whichOneVisible: any;

    constructor(
        private authService: AuthService,
        private subscriptionService: SubscriptionService
    ) {
    }

    ngOnInit(): void {
        console.log(this.whichOneVisible);
        if (this.whichOneVisible == 1 || this.whichOneVisible == undefined) {
            this.isNormalPlanSelected = true;
            this.isBuyCreditSelected = false;
        } else {
            this.isNormalPlanSelected = false;
            this.isBuyCreditSelected = true;
        }
        this.authService.getCountry().subscribe((data) => {
            this.countryList = data;
            console.log(this.countryList);
        });
        this.subscriptionService.getQuestionCredit().subscribe(
            (res: any) => {
                this.questionCreditData = res.questioncredits;
            },
            (error: any) => {
                // this.toastr.add({severity: 'error', summary: 'Failed', detail: error.error.message});
            }
        );
    }

    buyCreditClicked() {
        if (this.isNormalPlanSelected) {
            this.isBuyCreditSelected = true;
            this.isNormalPlanSelected = false;
            this.buttonText = "Buy Subscription Plan";
        } else {
            this.isBuyCreditSelected = false;
            this.isNormalPlanSelected = true;
            this.buttonText = "Buy Question Credit";
        }
    }

    onChangeSelectedCountry(element: any) {
        this.selectedCountryList = element;
    }
}
