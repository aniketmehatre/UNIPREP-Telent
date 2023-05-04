import {Component, OnInit} from "@angular/core";
import {AuthService} from "src/app/Auth/auth.service";
import {SubscriptionService} from "./subscription.service";
import {WindowRefService} from "./window-ref.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: "uni-subscription",
    templateUrl: "./subscription.component.html",
    styleUrls: ["./subscription.component.scss"],
})
export class SubscriptionComponent implements OnInit {
    stage = 1;
    cards: any[] = [
        {
            img: "uniprep-assets/icons/mastercard.png",
            name: "Master card",
        },
        {
            img: "uniprep-assets/icons/visacard.png",
            name: "Visa card",
        },
    ];
    planname: any = [];
    planprice: any = [];
    totalcheck: any = [];
    subscriptionid: any = [];
    selectedplanname: any;
    selectedplanprice: any;
    selectedsubscriptionid: any;
    noofchecks: any;
    currentDate = new Date();
    subscribername: any;

    constructor(
        private subscriptionService: SubscriptionService,
        private toastr: MessageService,
        private winRef: WindowRefService,
        private authservice: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.subscriptionService.getSubscriptionList().subscribe(
            (res: any) => {
                res.data.forEach((plandata: any) => {
                    this.planname.push(plandata?.name);
                    this.planprice.push(plandata?.price);
                    this.totalcheck.push(plandata?.checks);
                    this.subscriptionid.push(plandata?.id);
                });
            },
            (error: any) => {
                this.toastr.add({severity: 'error', summary: 'Failed', detail: error.error.message});
            }
        );
    }

    paymentcheckout() {
        var checkoutdata = {
            // userid: this.authservice._logindata.id,
            subscriptionid: this.selectedsubscriptionid,
            price: this.selectedplanprice,
        };
        this.subscriptionService.GetOrderId(checkoutdata).subscribe(
            (res: any) => {
                this.payWithRazor(res.orderid);
                return;
            },
            (error: any) => {
                // this.toastr.warning(error.error.message);
            }
        );
    }

    payWithRazor(orderid: any) {
        const options: any = {
            key: "rzp_test_Crpr7YkjPaCLEr",
            amount: this.selectedplanprice, // amount should be in paise format to display Rs 1255 without decimal point
            currency: "INR",
            name: "Uniabroad", // company name or product name
            description: "SOP Expert Subscription", // product description
            image: "https://uniabroad.io/webassets/img/rplogo.svg", // company logo or product image
            order_id: orderid, // order_id created by you in backend
            //callback_url: "http://localhost:4200/pages/subscriptions",
            prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            modal: {
                // We should prevent closing of the form when esc key is pressed.
                escape: false,
            },
            theme: {
                color: "#0c238a",
            },
        };
        options.handler = (response: any, error: any) => {
            options.response = response;
            var paymentdata = {
                orderid: response?.razorpay_order_id,
                paymentid: response?.razorpay_payment_id,
            };
            this.subscriptionService.PaymentComplete(paymentdata).subscribe(
                (res: any) => {
                    console.log("Response", res)
                    //this.subscribername= this.authservice.user.email
                    this.stage = 3;
                },
                (error: any) => {
                    // this.toastr.warning(error.error.message);
                }
            );
        };
        options.modal.ondismiss = () => {
            console.log("Transaction cancelled.");
        };
        const rzp = new this.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }

    buynow(planprice: any, planname: any, noofcheck: any, subscriptionid: any) {
        this.stage = 2;
        this.selectedplanname = planname;
        this.selectedplanprice = planprice;
        this.noofchecks = noofcheck;
        this.selectedsubscriptionid = subscriptionid;
    }

    basicplan() {
        console.log("varunnunddooo");
        this.router.navigate(["/billing"]);
    }
}
