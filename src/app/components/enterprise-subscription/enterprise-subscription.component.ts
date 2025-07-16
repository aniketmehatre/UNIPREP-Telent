import { Component, NgZone, OnInit,OnDestroy  } from '@angular/core';
import { EnterpriseSubscriptionService } from './enterprise-subscription.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { WindowRefService } from 'src/app/pages/subscription/window-ref.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from 'primeng/toast';
@Component({
    selector: 'uni-enterprise-subscription',
    templateUrl: './enterprise-subscription.component.html',
    styleUrls: ['./enterprise-subscription.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule,ToastModule],
})
export class EnterpriseSubscriptionComponent implements OnInit,OnDestroy {
  collegeName: string = "";
  name: string = "";
  price: string = "";
  orderLink: string | null = "";
  timeLeft = 5;
  interval: any;
  newTab:any;
  isPaymentCompleted: boolean = false;
  isPaymentProgress: boolean = false;

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
   // this.openAndCloseTab();
   // this.openLink('h');
  }
  ngOnDestroy() {
    clearInterval(this.interval); // Clean up the interval
}
 
  getCollege() {
    this.enterPriseSubscription.getCollege({ 'order_link': this.orderLink }).subscribe(res => {
      this.collegeName = res.college_name !== 'Something went wrong on payment details, please contact team' ? res.college_name : '';
      
     if (this.collegeName == '' || this.collegeName == 'Something went wrong on payment details, please contact team' ) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: res.college_name });
        //this.isPaymentCompleted = true;
        //this.startTimer();
      }
 
      if (res.message == "Paid") {
        this.toast.add({ severity: 'error', summary: 'Alert', detail: "Already Paid!, please close this tab" });
        this.isPaymentCompleted = true;
        //this.startTimer();
      }
  
      this.name = res.name;
      this.price = res.price;
    });
  }

  openAndCloseTab() {
   
   // this.newTab = window.open(window.location.href, '_self');

    /*
    console.log(window.location.href);
    this.newTab = window.open("https://stackoverflow.com/questions/17711146/how-to-open-link-in-a-new-tab-in-html", '_blank');
    

    
    const newTab = window.open(window.location.href, '_blank');
    setTimeout(() => {
      if (newTab) {
        newTab.close();
      }
    }, 1000); // 10000 milliseconds = 10 seconds
    */
    
  }

  startTimer() {
    //this.newTab = window.open(window.location.href, '_self');
    this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        } else {
            // When the timer reaches 0, close the tab
          //  window.open('', '_self').close();
         // window.open('', '_self').close();
        
            window.close();
        //  this.newTab.close();
  
        }
    }, 3000); // Update every second
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
    this.isPaymentProgress = true;
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
        color: "var(--p-primary-500)",
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
      this.isPaymentProgress = false;
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
