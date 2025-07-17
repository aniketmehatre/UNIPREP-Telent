import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {customsopSubscriptionplans} from "../../../@Models/subscription";
import { LocationService } from "src/app/services/location.service";
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
    selector: "uni-subscription-list",
    templateUrl: "./subscription-list.component.html",
    styleUrls: ["./subscription-list.component.scss"],
    standalone: true,
    imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
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
        private locationService: LocationService,
        private subscriptionService: SubscriptionService
    ) {
    }

    ngOnInit(): void {
        if (this.whichOneVisible == 1 || this.whichOneVisible == undefined) {
            this.isNormalPlanSelected = true;
            this.isBuyCreditSelected = false;
        } else {
            this.isNormalPlanSelected = false;
            this.isBuyCreditSelected = true;
        }
        this.locationService.getCountry().subscribe((data) => {
            this.countryList = data;
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
