import { Component, NgZone, OnInit } from '@angular/core';
import { EnterpriseSubscriptionService } from './enterprise-subscription.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { WindowRefService } from 'src/app/pages/subscription/window-ref.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'uni-enterprise-subscription',
  templateUrl: './enterprise-subscription.component.html',
  styleUrls: ['./enterprise-subscription.component.scss']
})
export class EnterpriseSubscriptionComponent implements OnInit {
  collegeName: string = "";
  orderLink: string | null = "";

  isPaymentCompleted: boolean = false;
  constructor(
    private enterPriseSubscription: EnterpriseSubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: MessageService,
    private winRef: WindowRefService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.orderLink = this.route.snapshot.paramMap.get("id");
    this.getCollege();

  }
  getCollege() {
    this.enterPriseSubscription.getCollege({ 'order_link': this.orderLink }).subscribe(res => {
      this.collegeName = res.college_name !== 'Something went wrong on payment details, please contact team' ? res.college_name : '';
      if (this.collegeName == '') {
        this.toast.add({ severity: 'error', summary: 'Error', detail: res.college_name });
      }
    });
  }
  pay() {
    if (this.orderLink) {
      this.enterPriseSubscription.placeOrder({ 'order_link': this.orderLink }).subscribe((data) => {
        if (data.success == false) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: data.message,
          });
          return;
        }
        this.payWithRazor(data.orderid);
      });
    }
  }
  payWithRazor(orderid: any) {
    let razorKey = 'rzp_live_YErYQVqDIrZn1D';
    if (environment.domain == "api.uniprep.ai") {
      razorKey = 'rzp_test_Crpr7YkjPaCLEr';
    }
    const options: any = {
      key: razorKey,
      currency: "INR",
      name: "UNIPREP",
      description: "UNIPREP Subscription",
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg",
      order_id: orderid,

      notes: {
        address: " 165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023 ",
      },
      modal: {
        escape: false,
      },
      theme: {
        color: "#3f4c83",
      },
    };
    options.handler = (response: any, error: any) => {
      options.response = response;
      let data = {
        paymentorder_id: response?.razorpay_order_id,
        payment_paid_id: response?.razorpay_payment_id,
      };
      this.enterPriseSubscription.paymentComplete(data).subscribe(
        (res: any) => {
          if (res.success == false) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: res.message });
          }
          this.ngZone.run(() => {
            this.isPaymentCompleted = true;
          });
        },
      );
    };
    options.modal.ondismiss = () => {
      this.toast.add({ severity: 'error', summary: 'Error', detail: "Transaction cancelled" });
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
