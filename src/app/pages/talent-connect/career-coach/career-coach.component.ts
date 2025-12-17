import { Component, NgZone, ViewChild } from "@angular/core";
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
import { AuthService } from "src/app/Auth/auth.service";
import { LocationService } from "src/app/services/location.service";
import { StripeCardElementOptions, StripeElementsOptions } from "@stripe/stripe-js";
import { NgxStripeModule, StripePaymentElementComponent, StripeService } from "ngx-stripe";
import { DialogModule } from "primeng/dialog";

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
    DialogModule,
    NgxStripeModule,
  ],
  templateUrl: "./career-coach.component.html",
  styleUrls: ["./career-coach.component.scss"],
})
export class CareerCoachComponent {
  priceLabel = "INR 799.00";
  amount = 0;

  supportOptions = [];

  form = this.fb.group({
    support: ["",Validators.required],
    notes: ["", [Validators.required, Validators.minLength(10)]],
  });

  coachView: boolean = false;
  page: number = 1;
  perPage: number = 10;
  employeesList: any[] = [];
  totalEmployeeCount: number = 0;
  country: any;
  userName: any;
  nationalityId: any;
  userCountry: any;
  subscriptionId: any;
  currency: any;
   @ViewChild(StripePaymentElementComponent) card!: StripePaymentElementComponent;
  cardOptions: StripeCardElementOptions = {
    iconStyle: "solid",
    style: {
      base: {
        color: "#000000",
      },
      invalid: {
        color: "red",
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: "en",
  };
  stripeData: any;
  cardVisibility = false;
  paymentType: any;
  reqPayload: any;

  constructor(
    private fb: FormBuilder,
    private winRef: WindowRefService,
    private toast: MessageService,
    private talentConnectService: TalentConnectService,
    private authService: AuthService,
    private locationService: LocationService,
    private stripeService: StripeService,
    private ngZone: NgZone,
  ) {
    this.talentConnectService.supportDropdown().subscribe((response: any) => {
      this.supportOptions = response.data.supportOptions;
    });

    this.form.get("support")?.valueChanges.subscribe((value) => {
      if (value) {
        this.talentConnectService
          .careerCoachCal(value,this.country)
          .subscribe((response: any) => {
            this.amount = response.data.total_amount;
            this.subscriptionId = response.data.subscription_id;
            this.currency = response.data.currency;
            this.paymentType = response.data.payment_gateway;
          });
      }
    });
     const geoData = JSON.parse(
      localStorage.getItem("currentCountryByGEOLocation") || "{}"
    );
    const country = geoData.country || this.country;
    this.authService.getMe().subscribe((res) => {
      const cityName = res.userdetails[0].city_name;
      this.userName = res.userdetails[0].name;
      this.nationalityId = res.userdetails[0].nationality_id;
      this.locationService.getUserCountry(this.nationalityId,cityName.split(",")[1]?.trim()).subscribe((locRes) => {
        this.userCountry = locRes.data.country[0].country;
        this.country = country || this.userCountry;
      });
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
    this.reqPayload = { ...this.form.value, amount: this.amount,subscriptionId: this.subscriptionId,currency: this.currency };
    this.checkout(this.paymentType);
    // this.talentConnectService
    //   .placeCareerCoachOrder(reqPayload)
    //   .subscribe((response: any) => {
    //     this.payWithRazor(response);
    //   });
  }

   checkout(type: any) {
    let data = {
      type: this.paymentType,
    };
    data.type = type;
    this.pay(data);
  }

  pay(value: any) {
    if (value.type == "Razorpay") {
      this.talentConnectService
        .placeCareerCoachOrder(this.reqPayload)
        .subscribe((data) => {
          this.payWithRazorpay(data.data.order_id);
          this.currency;
          if (data.success == false) {
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
            return;
          }
        });
    } else {
      this.payUsingStripe(value);
    }
  }
 payWithRazorpay(orderid: any) {
    let razorKey = 'rzp_live_YErYQVqDIrZn1D';
    if (environment.domain === 'api.uniprep.ai') {
      razorKey = 'rzp_test_Crpr7YkjPaCLEr';
    }

    const options: any = {
      key: razorKey,
      amount: this.amount * 100,
      currency: this.currency,
      name: 'UNIPREP',
      description: 'UNIPREP Subscription',
      image: 'https://uniprep.ai/uniprep-assets/images/icon-light.svg',
      order_id: orderid,
      notes: {
        address:
          '165/1, Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023',
      },
      modal: {
        escape: false,
      },
      theme: {
        color: '#3f4c83',
      },
    };

    options.handler = (response: any) => {
      const paymentData = {
        orderId: response?.data?.order_id,
        paymentId: response?.data?.payment_id,
      };

      this.talentConnectService.completeCareerCoachPayment(paymentData).subscribe({
          next:(res: any) => {
            if (res.status === false) {
              this.toast.add({
              severity: 'error',
              summary: 'Error',
                detail: res.message,
              });
            } else {
              this.ngZone.run(() => {
                this.toast.add({
                severity: 'success',
                summary: 'Payment Successful',
                detail: 'Your transaction has been completed.',
                });
              });
            }
          },
          error: () => {
            this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Payment verification failed.',
            });
          }
        });
    };

    options.modal.ondismiss = () => {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Transaction cancelled',
      });
    };

    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

   payUsingStripe(value: any) {
    this.stripeData = value;
    this.stripeData.finalPrice = this.amount;
    this.stripeData.subscriptionId = this.subscriptionId;
    this.stripeData=this.reqPayload
    this.talentConnectService
      .placeCareerCoachOrderStripe(this.stripeData)
      .subscribe({
        next: (pi: any) => {
          this.currency;
          this.stripeData.clientSecret = pi.data.client_secret as string;
          this.elementsOptions.clientSecret = pi.data.client_secret as string;
          setTimeout(() => {
            this.cardVisibility = true;
          }, 100);
        },
        error: (error) => {
          console.error('Error creating payment intent:', error);
          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to initialize payment. Please try again.'
          });
        }
      });
  }

  payWithStripe() {
    if (!this.stripeData || !this.card) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Payment form is not ready. Please try again.'
      });
      return;
    }

    this.stripeService
      .confirmPayment({
        elements: this.card.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.userName || 'Customer',
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe({
        next: (result: any) => {
          if (result.status === false) {
            this.toast.add({
              severity: 'error',
              summary: 'Payment Failed',
              detail: result.message,
            });
            return;
          }

          if (result.paymentIntent?.status === 'succeeded') {
            this.toast.add({
              severity: 'success',
              summary: 'Payment Successful',
              detail: 'Your payment has been processed successfully.',
            });

            const payload = {
              order_id: this.stripeData.order_id,
              payment_id: result.paymentIntent.id,
            };

            this.talentConnectService.completeCareerCoachPaymentStripe(payload)
              .subscribe({
                next: (res: any) => {
                  if (res.status === true) {
                    this.toast.add({
                      severity: 'success',
                      summary: 'Credits Added',
                      detail: 'Your credits have been updated.',
                    });

                    this.cardVisibility = false;

                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  } else {
                    this.toast.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: res.message,
                    });
                  }
                },
                error: () => {
                  this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to update credits.',
                  });
                }
              });
          }
        },
        error: (err) => {
          this.toast.add({
            severity: 'error',
            summary: 'Stripe Error',
            detail: err?.message || 'Something went wrong.',
          });
        },
      });
  }


  loadCareerCoachData(params: any = {}) {
    const data = { page: this.page, perpage: this.perPage, ...params };
    this.talentConnectService.careerCoachhistories(data).subscribe((response) => {
      this.employeesList = response.data.transactions; 
      this.totalEmployeeCount = response.data.total;
      this.coachView = true;
    });
  }

  pageChange(event: any) {
    this.page = (event.page ?? 0) + 1;
    this.perPage = event.rows ?? 10;
  }
}
