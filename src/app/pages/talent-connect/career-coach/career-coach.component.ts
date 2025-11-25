import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { TextareaModule } from "primeng/textarea";
import { environment } from "@env/environment";
import { WindowRefService } from "../../subscription/window-ref.service";
import { MessageService } from "primeng/api";
import { TalentConnectService } from "../talent-connect.service";
import { PaginatorModule } from "primeng/paginator";
import { ScrollTopModule } from "primeng/scrolltop";
import { TableModule } from "primeng/table";

@Component({
  selector: "uni-career-coach",
  standalone: true,
  imports: [
    CommonModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
    ScrollTopModule,
    TableModule,
    PaginatorModule,
    FormsModule,
  ],
  templateUrl: "./career-coach.component.html",
  styleUrls: ["./career-coach.component.scss"],
})
export class CareerCoachComponent {
  priceLabel = "INR 799.00";
  amount = 799;

  supportOptions = [];

  form = this.fb.group({
    support: [Validators.required],
    notes: ["", [Validators.required, Validators.minLength(10)]],
  });

  coachView: boolean = false;
  page: number = 1;
  perPage: number = 10;
  employeesList: any[] = [];
  totalEmployeeCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private winRef: WindowRefService,
    private toast: MessageService,
    private talentConnectService: TalentConnectService
  ) {
    this.talentConnectService.supportDropdown().subscribe((response: any) => {
      this.supportOptions = response.data.supportOptions;
    });

    this.form.get("support")?.valueChanges.subscribe((value) => {
      if (value) {
        this.talentConnectService
          .getCareerCoachCal(value)
          .subscribe((response: any) => {
            this.amount = response.total_amount;
          });
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  bookSession() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const reqPayload = { ...this.form.value, amount: this.amount };
    this.talentConnectService
      .placeCareerCoachOrder(reqPayload)
      .subscribe((response: any) => {
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
      amount: this.amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
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
        color: "var(--p-primary-500)",
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
        this.talentConnectService
          .completeCareerCoachTransaction(paymentdata)
          .subscribe(
            (response: any) => {
              this.toast.add({
                severity: response.status,
                summary: response.status,
                detail: response.message,
              });
              if (response.status == "success") {
                // this.creditEvents.requestUpdate();
                // this.router.navigate(["/pages/subscriptions"]);
              } else {
                return;
              }
            },
            (error: any) => {
              this.toast.add({
                severity: response.status,
                summary: response.status,
                detail: response.message,
              });
            }
          );
      }, 0);
    };
    options.modal.ondismiss = () => {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Transaction cancelled",
      });
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  loadCareerCoachData(params: any = {}) {
    const data = { page: this.page, perpage: this.perPage, ...params };
    this.talentConnectService.getCareerCoach(data).subscribe((response) => {
      this.employeesList = response.data;
      this.totalEmployeeCount = response.total;
      this.coachView = true;
    });
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
  }
}
