import {Component, OnInit} from "@angular/core";
import { AuthService } from "src/app/Auth/auth.service";
import { SubscriptionService } from "./subscription.service";
import { WindowRefService } from "./window-ref.service";
import {MessageService} from "primeng/api";
import {
    Billinginfo,
    OrderHistory,
    Subscription,
    SubscriptionPlan,
    SubscriptionSuccess
} from "../../@Models/subscription";
import {Observable} from "rxjs";

@Component({
    selector: "uni-subscription",
    templateUrl: "./subscription.component.html",
    styleUrls: ["./subscription.component.scss"],
})
export class SubscriptionComponent implements OnInit {
    stage = 1;
    subscriptions$!:Observable<SubscriptionPlan[]>;
    orderLoading$!:Observable<boolean>;
    selectedSubscription!: SubscriptionPlan | null;
    showPayLoading = false;
    orderHistory$!:Observable<OrderHistory[]>;
    subscriptionDetail$!:Observable<Subscription | null>;
    billingInfo$!:Observable<Billinginfo | null>;
    success!: SubscriptionSuccess;
    constructor(
        private subscriptionService: SubscriptionService,
        private toastr: MessageService,
        private winRef: WindowRefService,
        private authservice: AuthService
    ) {}
    ngOnInit(): void {
        if (!this.authservice.user?.subscription.toLowerCase().includes('Free')) {
            console.log('test')
            this.stage = 1;
            this.loadSubDetails();
            return;
        }
        this.start();
    }
    start() {
        this.showPayLoading = false;
        this.stage = 2;
        this.loadSubscriptions();
    }
    loadSubDetails() {
        this.orderHistory$ = this.subscriptionService.getOrderHistory();
        this.subscriptionDetail$ = this.subscriptionService.getSubscriptionDetail();
        this.subscriptionDetail$.subscribe(data => {
            console.log(data);
        })
        this.billingInfo$ = this.subscriptionService.getBillingInfo();
        //this.subscriptionService.loadSubDetails();
    }
    loadSubscriptions() {
        this.subscriptions$ = this.subscriptionService.getSubscriptionList();
        this.subscriptions$.subscribe(data => {
            console.log(data);
        })
        this.orderLoading$ = this.subscriptionService.getLoading();
        this.subscriptionService.loadSubscriptionList();
        this.subscriptionService.getOrderID().subscribe(order => {
            console.log(order);
            if (!order) {
                return;
            }
            this.payWithRazor(order);
        });
    }
    onSelectSubscription(event: SubscriptionPlan) {
        this.selectedSubscription = event;
        this.stage = 3;
    }
    changePlan() {
        this.selectedSubscription = null;
        this.stage = 2;
    }
    pay() {
        this.showPayLoading = true;
        let data = {
            country_id: 2,
            subscription_id: this.selectedSubscription?.id
        }
        this.subscriptionService.placeOrder(data);
    }
    payWithRazor(orderid: any) {
        const options: any = {
            key: "rzp_test_Crpr7YkjPaCLEr",
            amount: this.selectedSubscription?.price, // amount should be in paise format to display Rs 1255 without decimal point
            currency: "INR",
            name: "Uniabroad", // company name or product name
            description: "SOP Expert Subscription", // product description
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
                this.authservice.updateSubscriptionName(this.selectedSubscription?.subscription || '');
                this.subscriptionService.PaymentComplete(paymentdata).subscribe(
                    (res: any) => {
                        this.success = res;
                        this.subscriptionService.doneLoading();
                        this.stage = 4;
                    },
                    (error: any) => {
                        // this.toastr.warning(error.error.message);
                        this.subscriptionService.doneLoading();
                        this.stage = 4;
                    }
                );
            },0)
        };
        options.modal.ondismiss = () => {
            console.log("Transaction cancelled.");
        };
        const rzp = new this.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }
}
