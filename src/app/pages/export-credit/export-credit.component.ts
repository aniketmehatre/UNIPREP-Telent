import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ExportCreditService } from './export-credit.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { WindowRefService } from '../subscription/window-ref.service';
import { Router } from '@angular/router';
import { ResponsiveCSSClassPipe } from 'ngx-extended-pdf-viewer';
@Component({
  selector: 'uni-export-credit',
  templateUrl: './export-credit.component.html',
  styleUrls: ['./export-credit.component.scss']
})
export class ExportCreditComponent implements OnInit {
 
  moduleList:any[] = [];
  totalPayableAmount:number = 0;

  constructor(private exportcreditservice:ExportCreditService, private toastr:MessageService, private winRef: WindowRefService, private router: Router) { }

  ngOnInit(): void {
    this.loadModuleList();
  }

  loadModuleList(): void{
    this.exportcreditservice.getModulesList().subscribe((responce) =>{
      this.moduleList = responce;
    });
  }

  
  checkOut(){
    if(this.totalPayableAmount == 0){
      this.toastr.add({severity:"error", summary: "error", detail: "Please add some Credits"});
      return;
    }
    this.exportcreditservice.placeOrder(this.moduleList).subscribe((response)=>{
      this.payWithRazor(response);
    });
    
  }

  payWithRazor(orderDetails: any) {
    let razorKey = "rzp_live_YErYQVqDIrZn1D";
    if (environment.domain == "api.uniprep.ai") {
      razorKey = "rzp_test_Crpr7YkjPaCLEr";
    }
    const options: any = {
      key: razorKey,
      amount: orderDetails.final_amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: "INR",
      name: "UNIPREP", // company name or product name
      description: "UNIPREP Subscription", // product description
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg", // company logo or product image
      order_id: orderDetails.order_id, // order_id created by you in backend

      // prefill: {
      //   name: this.selectedSubscription?.subscription,
      //   email: this.authservice.user?.email,
      //   contact: this.authservice.user?.usertype_name,
      // },
      notes: {
        address:
          " 165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023",
      },
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      theme: {
        color: "#3f4c83",
      },
    };

    options.handler = (response: any, error: any) => {
      options.response = response;
      var paymentdata = {
        order_id: response?.razorpay_order_id,
        payment_id: response?.razorpay_payment_id,
        update_order_ids: orderDetails?.added_credit_ids,
      };
      setTimeout(() => {
        this.exportcreditservice.completePayment(paymentdata).subscribe(
          (response: any)=>{
            this.toastr.add({
              severity: response.status,
              summary: response.status,
              detail: response.message,
            });
            if(response.status == "success"){
              this.router.navigate(["/pages/subscriptions"]);
            }else{
              return;
            }
            
            //console.log(response);
            //window.location.reload();
          },(error: any)=>{
            this.toastr.add({
              severity: response.status,
              summary: response.status,
              detail: response.message,
            });
            //console.log(error);
            //window.location.reload();
          }
        );
      }, 0);
    };
    options.modal.ondismiss = () => {
      this.toastr.add({
        severity: "error",
        summary: "Error",
        detail: "Transaction cancelled",
      });
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  onInputChangeValue(event: any, module_id:number){
    this.totalPayableAmount = 0;
    this.moduleList.forEach(item =>{
      if(module_id == item.id){
        item.inputvalue = event.value;
      }
      if(item.planValidation == 1){
        this.totalPayableAmount += item.inputvalue * item.price_per_credit;
      }
    });
  }
}
