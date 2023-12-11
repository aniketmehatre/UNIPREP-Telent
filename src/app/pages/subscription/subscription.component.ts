import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/Auth/auth.service";
import { SubscriptionService } from "./subscription.service";
import { WindowRefService } from "./window-ref.service";
import { MessageService } from "primeng/api";
import {
    Billinginfo,
    OrderHistory,
    Subscription,
    SubscriptionPlan,
    SubscriptionSuccess,
} from "../../@Models/subscription";
import { Observable } from "rxjs";
import { selectBillingInfo$ } from "./store/selectors";
import {select} from "@ngrx/store";
import { DataService } from "src/app/data.service";

@Component({
    selector: "uni-subscription",
    templateUrl: "./subscription.component.html",
    styleUrls: ["./subscription.component.scss"],
})
export class SubscriptionComponent implements OnInit {
    stage = 1;
    subscriptions$!: Observable<SubscriptionPlan[]>;
    orderLoading$!: Observable<boolean>;
    selectedSubscription!: SubscriptionPlan | null;
    selectedQuestionCredit!: any | null;
    showPayLoading = false;
    orderHistory$!: Observable<OrderHistory[]>;
    subscriptionDetail$!: Observable<Subscription | null>;
    billingInfo$!: Observable<Billinginfo | null>;
    success!: SubscriptionSuccess;
    user: any;
    countryList: any;
    isSubOrQuestion: number = 1;
    subscribedCountryList: any [] = [];
    subscribedHistoryData: any [] = [];
    userSubscription: any  = [];
    subscriptionDetails: any;
    accountBillingData: any[] = [];
    loadingSubscriptionHistory: boolean = false;
    loadingExistingSubscription: boolean = false;
    showSubscriptionedData: boolean = false;
    showPlanBtn: boolean = false;

    constructor(
        private subscriptionService: SubscriptionService,
        private winRef: WindowRefService,
        private authservice: AuthService,
        private toastr: MessageService,
        private dataService: DataService
    ) { }
    ngOnInit(): void {
        if(!this.authservice?.user?.subscription) {
            this.stage = 1;
            return;
        }
        this.loadSubData();
        this.authservice.getNewUserTimeLeft().subscribe(res => {
            let data = res.time_left;
            if (data.plan === 'expired' || data.plan === 'subscription_expired') {
                this.showPlanBtn = true;
            } else {
                this.showPlanBtn = false;
            }
        });
    }
    start() {
        this.showPayLoading = false;
        this.stage = 1;
        // this.loadSubscriptions();
    }

    loadSubData() {
        this.loadSubscriptionHistory();
        this.loadExistingSubscription();
    }

    loadSubDetails() {
        this.orderHistory$ = this.subscriptionService.getOrderHistory();
        this.subscriptionDetail$ = this.subscriptionService.getSubscriptionDetail();
        this.subscriptionDetail$.subscribe((data) => { });

        this.billingInfo$ = this.subscriptionService.getBillingInfo();
        //this.subscriptionService.loadSubDetails();
    }
    loadSubscriptions() {
        this.subscriptions$ = this.subscriptionService.getSubscriptionList();
        this.subscriptions$.subscribe((data) => { });
        this.orderLoading$ = this.subscriptionService.getLoading();
        this.subscriptionService.loadSubscriptionList();
        this.subscriptionService.getOrderID().subscribe((order) => {
            if (!order) {
                return;
            }
            this.payWithRazor(order);
        });
    }
    onSelectSubscription(event: any) {
       let selectedPlanData = {... event.event};
        selectedPlanData.country = event.selectedCountryList;
        selectedPlanData.price = Number(selectedPlanData.price) + ((event.selectedCountryList.length -1) * 699);

        this.selectedSubscription = selectedPlanData;
        this.stage = 3;
    }
    onSelectQuestionCredit(event: any) {
        this.selectedQuestionCredit = event;
        this.stage = 3;
    }
    changePlan() {
        this.selectedSubscription = null;
        this.isSubOrQuestion = 1;
        this.stage = 2;
    }

    changeQuestionCreditPlan() {
        this.selectedQuestionCredit = null;
        this.isSubOrQuestion = 2;
        this.stage = 2;
    }
    pay(value: any) {
        this.subscriptionDetails = value;
        this.showPayLoading = true;
        if (value.subscriptionId) {
            this.subscriptionService.placeSubscriptionOrder(value).subscribe((data) => {
                this.payWithRazor(data.orderid);
            });
        }
        else {
            this.subscriptionService.placeTopupSubscriptionOrder(value).subscribe((data) => {
                this.payWithRazor(data.orderid);
            });
        }

    }

    payQuestionCredit() {
        this.showPayLoading = true;
        let data = {
            user_id: 2,
            questioncredits_id: this.selectedQuestionCredit?.id,
        };

        this.subscriptionService
            .placeQuestionCreditOrder(data)
            .subscribe((data) => {
                this.payWithRazor(data.orderid);
            });
    }
    payWithRazor(orderid: any) {
        const options: any = {
            key: "rzp_test_Crpr7YkjPaCLEr",
            amount: this.subscriptionDetails?.finalPrice * 100, // amount should be in paise format to display Rs 1255 without decimal point
            currency: "INR",
            name: "Uniabroad", // company name or product name
            description: "UNIPREP Subscription", // product description
            image: "https://uniabroad.io/webassets/img/rplogo.svg", // company logo or product image
            order_id: orderid, // order_id created by you in backend
            //callback_url: "http://localhost:4200/pages/subscriptions",
            prefill: {
                name: this.selectedSubscription?.subscription,
                email: this.authservice.user?.email,
                contact: this.authservice.user?.usertype_name,
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            modal: {
                // We should prevent closing of the form when esc key is pressed.
                escape: false,
            },
            theme: {
                color: "#9ABD38",
            },
        };
        options.handler = (response: any, error: any) => {
            options.response = response;
            var paymentdata = {
                orderid: response?.razorpay_order_id,
                paymentid: response?.razorpay_payment_id,
            };
            setTimeout(() => {
                this.authservice.updateSubscriptionName(
                    this.selectedSubscription?.subscription || ""
                );
                if (this.subscriptionDetails?.subscriptionId) {
                    this.subscriptionService.PaymentComplete(paymentdata).subscribe(
                        (res: any) => {
                            this.success = res;
                            this.subscriptionService.doneLoading();
                            this.loadSubData();
                            window.location.reload();
                        },
                        (error: any) => {
                            // this.toastr.warning(error.error.message);
                            this.subscriptionService.doneLoading();
                            this.loadSubData();
                            window.location.reload();
                        }
                    );
                }
                else {
                    let data = {
                        order_id: response?.razorpay_order_id,
                        payment_reference_id: response?.razorpay_payment_id,
                    }
                    this.subscriptionService.topupPaymentComplete(data).subscribe(
                        (res: any) => {
                            this.success = res;
                            this.subscriptionService.doneLoading();
                            this.loadSubData();
                            window.location.reload();
                        },
                        (error: any) => {
                            // this.toastr.warning(error.error.message);
                            this.subscriptionService.doneLoading();
                            this.loadSubData();
                            window.location.reload();
                        }
                    );
                }

            }, 0);
        };
        options.modal.ondismiss = () => {

            this.toastr.add({severity: 'error', summary: 'Error', detail: "Transaction cancelled"});

        };
        const rzp = new this.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }

    loadSubscriptionHistory(){
        this.subscriptionService.getSubscriptionHistory().subscribe((response: any) => {
            this.subscribedHistoryData = response.subscriptionhistory;
            this.accountBillingData = response.accountbillings;
            if(this.subscribedHistoryData.length > 0 && this.accountBillingData.length > 0) {
                this.loadingSubscriptionHistory = true;
                this.loadSubscriptionedData();
            }
        });
        this.dataService.showPopup(true);
    }

    loadExistingSubscription(){
        this.subscriptionService.getExistingSubscription().subscribe((response: any) => {
            this.userSubscription = response.subscription;
            if(typeof this.userSubscription=='object' && this.userSubscription.countryName!=null){
                this.loadingExistingSubscription = true;
                this.loadSubscriptionedData();
                return;
            }
            // if(this.userSubscription.length > 0) {
                this.loadingExistingSubscription = true;
                this.loadSubscriptionedData();
            // }
        });
    }

    loadSubscriptionedData() {
        if(this.loadingSubscriptionHistory && this.loadingExistingSubscription) {
            this.stage = 5;
        }
    }

    showPlan($event: any) {
        this.stage = 1;
    }
}
