
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Billinginfo, OrderHistory, Subscription, SubscriptionSuccess } from "../../../@Models/subscription";
import { environment } from "@env/environment.prod";
import { AuthService } from 'src/app/Auth/auth.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SubscriptionService } from '../subscription.service';
import { User } from 'src/app/@Models/user.model';

import { LocalStorageService } from "ngx-localstorage";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { WindowRefService } from '../window-ref.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'uni-upgrade-subscription',
  templateUrl: './upgrade-subscription.component.html',
  styleUrls: ['./upgrade-subscription.component.scss']
})
export class UpgradeSubscriptionComponent implements OnInit {
  selectedButton: any;
  countryList: any;
  breadCrumb: MenuItem[] = [];
  selectedCountry: any[] = [2, 3];
  isInstructionVisible: boolean = false;
  @Input() billing!: any | null;
  @Input() subscriptions!: Subscription | null;
  @Input() history: OrderHistory[] = [];
  @Output() upgrade = new EventEmitter();

  topupcountries = false;
  topupvalidity = false;
  subscriptionList: any = [];
  showPayLoading = false;

  subscriptionTopupList: any = [];
  couponInput: any = '';
  subscriptionTotal: any = '0.00';
  checkoutTotal: any = '';
  currentlyUsedCoupon: any = '';
  invalidCoupon: boolean = false;
  selectedSubscriptionDetails: any;
  selectedTopupCountryDetails: any;
  showCheckout: boolean = true;
  subscriptionAmt: any = '0.00';
  studentType: number = 0;
  loadingUserDetails: boolean = false;
  discountAmount: any;
  discountAmountEnable!: boolean;
  usedCouponId: number = 0;
  confirmModal: boolean = false;
  plansLoaded: boolean = false;
  user!: User | null;
  subscriptionDetails: any;
  success!: SubscriptionSuccess;
  discountPercentage: any;
  @Output() showHistory = new EventEmitter();
  @Input() showHistoryBtn: any;
  existingSubscription: any[] = [];
  showCross: boolean = false;
  iscouponReadonly: boolean = false;
  isPlanExpired: boolean = false;
  currentCountry: string = "";
  continent: string = "";
  currency: string = "";
  monthlyPlan: number = 3;
  activeTabIndex: number = 0;

  constructor(private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private storage: LocalStorageService,
    private toast: MessageService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private winRef: WindowRefService,
    private authservice: AuthService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  timeLeftInfoCard: any

  ngOnInit(): void {
    this.getLocation();
    this.timeLeftInfoCard = localStorage.getItem('time_card_info');
    this.discountAmountEnable = false;
    this.user = this.authService.user;
    this.studentType = this.user?.student_type_id || 0;
    this.ngxService.start();
    this.authService.getCountry().subscribe((data) => {
      this.ngxService.stop();
      this.countryList = data;
      this.loadExistingSubscription();
      // this.getSubscriptionTopupList();

    }, error => {
      this.ngxService.stop();
    });

  }
  get URL() {
    return `${environment.ApiUrl}/downloadinvoice`;
  }


  closeAllHome() {
    this.isInstructionVisible = false;
  }
  moreabout() {
    this.isInstructionVisible = true;
  }

  getSubscriptionList(canChangeSubscription: string) {
    let data = {
      page: 1,
      perpage: 1000,
      studenttype: this.studentType,
      country: this.currentCountry,
      continent: this.continent,
      monthly_plan: this.monthlyPlan
    }

    this.subscriptionService.getSubscriptions(data).subscribe((response) => {
      const mostPopularOnes = response.subscriptions.filter((item: any) => item.popular === 1);
      const filteredData = response.subscriptions.filter((item: any) => item.popular !== 1);
      filteredData.splice(1, 0, ...mostPopularOnes);
      this.subscriptionList = filteredData;
      this.subscriptionList.map((item: any) => this.currency = item.currency);
      if (canChangeSubscription == "canSubscribeAll") {
        this.subscriptionList.map((item: any) => item.available = true);
      }
      if (canChangeSubscription == "canSubscribeSome") {
        this.subscriptionList.map((item: any) => {
          item.available = false;
          if (this.existingSubscription[0]?.plan == "Student" && item.subscription_plan != "Student") {
            item.available = true;
          }
          if (this.existingSubscription[0]?.plan == "Career" && item.subscription_plan != "Student" && item.subscription_plan != "Career") {
            item.available = true;
          }
          if (this.existingSubscription[0].plan == "Entrepreneur") {
            item.available = false;
          }
        });
      }
      this.plansLoaded = true;

    });
  }

  // getSubscriptionTopupList() {
  //   this.subscriptionService.getSubscriptionTopups().subscribe((response) => {
  //     this.subscriptionTopupList = response.topups;
  //     this.subscriptionTopupList.forEach((item: any) => {
  //       item.price = Number(item.price);
  //       item.countries = item.countries.split(',').map(Number);
  //       let filteredCountryIds = item.countries;
  //       item.selected = false;
  //       item.selectedCoutriesList = [];
  //       item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
  //       item.isActive = item.popular == 1 ? true : false;
  //     });
  //   });
  // }

  // removeCountry(subId: number, selectedId: number) {
  //   this.subscriptionTopupList.forEach((item: any) => {
  //     if (subId == item.id) {
  //       item.selectedCoutriesList = item.selectedCoutriesList.filter((data: any) => data.id !== selectedId);
  //     }
  //   });
  // }

  selectedSubscriptionPlan(sub: any) {
    this.showCheckout = false;
    this.checkoutTotal = '';
    this.subscriptionList.forEach((item: any) => {
      item.selected = false;
      item.isActive = false;
      if (sub.id == item.id) {
        item.selected = true;
        item.isActive = true;
      }
    });
    this.selectedSubscriptionDetails = sub;
    this.subscriptionAmt = sub.givenprice;
    this.subscriptionTotal = this.subscriptionAmt;
  }

  // selectedTopupCountryPlan(sub: any) {
  //   if (sub?.selectedCoutriesList?.length > 0) {
  //     this.showCheckout = false;
  //     this.checkoutTotal = '';
  //     this.subscriptionTopupList.forEach((item: any) => {
  //       item.selected = false;
  //       item.isActive = false;
  //       if (sub.id == item.id) {
  //         item.selected = true;
  //         item.isActive = true;
  //       }
  //     });
  //     this.selectedTopupCountryDetails = sub;

  //     this.subscriptionTotal = sub.finalamount * sub.selectedCoutriesList.length;

  //   }
  //   else {
  //     this.toast.add({ severity: 'warn', summary: 'Warn', detail: 'Please Choose a country' });
  //   }

  // }


  loadExistingSubscription() {
    this.subscriptionService.getExistingSubscription().subscribe((response: any) => {
      this.existingSubscription = response.subscription;
      this.existingSubscription.map(plan => plan.subscriptionDays = plan.remainingdays.split('-')[0].trim().replace(/\D/g, ''));
      if (this.existingSubscription[0].subscriptionDays == 90) {
        this.monthlyPlan = 3;
        this.existingSubscription[0].monthlyPlan = 3;
        this.activeTabIndex = 0;
      } else if (this.existingSubscription[0].subscriptionDays == 180) {
        this.monthlyPlan = 6;
        this.existingSubscription[0].monthlyPlan = 6;
        this.activeTabIndex = 1;
      } else {
        this.monthlyPlan = 12;
        this.existingSubscription[0].monthlyPlan = 12;
        this.activeTabIndex = 2;
      }
      let data = {
        page: 1,
        perpage: 1000,
        studenttype: this.studentType,
        country: this.currentCountry,
        continent: this.continent,
        monthly_plan: this.monthlyPlan
      }

      this.subscriptionService.getSubscriptions(data).subscribe((response) => {
        const mostPopularOnes = response.subscriptions.filter((item: any) => item.popular === 1);
        const filteredData = response.subscriptions.filter((item: any) => item.popular !== 1);
        filteredData.splice(1, 0, ...mostPopularOnes);
        this.subscriptionList = filteredData;
        this.subscriptionList.map((item: any) => this.currency = item.currency);
        this.plansLoaded = true;
        this.getPlanexpire();
      })
    });
  }
  getPlanexpire() {
    this.authservice.getNewUserTimeLeft().subscribe(res => {

      this.isPlanExpired = res.time_left.plan == "subscription_expired" ? true : false;

      this.subscriptionList.forEach((item: any) => {
        item.country = item.country.split(',').map(Number);
        item.selected = false;
        item.selectedCountry = {};
        item.filteredCountryList = this.countryList;
        item.selectedCountry = this.countryList.find((country: any) => country.id === Number(this.user?.interested_country_id));
        item.isActive = item.popular == 1 ? true : false;
        item.available = false;

        if (this.existingSubscription[0]?.plan == "Student") {
          item.available = true;
        }
        if (this.existingSubscription[0]?.plan == "Career" && item.subscription_plan != "Student") {
          item.available = true;
        }
      });
    })
  }
  applyCoupon() {

    if (this.showCheckout) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please select the Plan!' });
      return;
    }
    // if (this.subscriptionService.usedCoupon == this.couponInput && this.invalidCoupon) {
    //   this.toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid Coupon Code' });
    //   return;
    // }
    // if (this.subscriptionService.usedCoupon == this.couponInput) {
    //   this.toast.add({ severity: 'error', summary: 'Error', detail: 'Coupon already used' });
    //   return;
    // }
    if (this.couponInput) {
      this.showCross = true;
      this.iscouponReadonly = true;
      this.subscriptionService.usedCoupon = this.couponInput
      let data = {
        couponCode: this.couponInput,
        checkoutTotal: this.subscriptionTotal,
        subscriptioncouponstatus: this.selectedSubscriptionDetails?.couponcode,
        subscription_id: this.selectedSubscriptionDetails?.id,
        subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
      }

      this.subscriptionService.applyCoupon(data).subscribe((response) => {
        if (response.success) {
          this.checkoutTotal = Number(this.subscriptionTotal) - response.discountPrice;
          this.discountAmount = response.discountPrice;
          this.discountPercentage = response.discountPercentage;
          this.discountAmountEnable = true;
          this.usedCouponId = response.coupon_id;
          this.toast.add({ severity: 'success', summary: 'Success', detail: "Coupon applied" });
        }
        else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: response.message });
          this.invalidCoupon = true;
          this.checkoutTotal = this.subscriptionTotal;
          this.discountAmountEnable = false;
          this.couponInput = '';
          this.showCross = false;
          this.iscouponReadonly = false;
        }
      });
    }
    else {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some Coupon Code!' });
    }
  }

  checkout(event: Event) {
      
    this.confirmModal = false;
    if (this.existingSubscription[0].monthlyPlan > this.monthlyPlan) {
      this.confirmSubscription(event,"Are you sure you want to upgrade to the new "+this.monthlyPlan+" month "+this.selectedSubscriptionDetails.subscription_plan+" plan? Please note that your current "+this.existingSubscription[0].monthlyPlan+" month "+this.existingSubscription[0].plan +" plan will expire upon upgrading");
    }
    else {
      this.subscribe();
    }
  }
  subscribe() {
    this.subscriptionService.getExtendedToken().subscribe(
      response => {
        if (response.token) {
          this.storage.set(environment.tokenKey, response.token);
        }

        if (this.selectedSubscriptionDetails) {
          let data = {
            subscriptionId: this.selectedSubscriptionDetails.id,
            countryId: this.selectedSubscriptionDetails.selectedCountry?.id,
            finalPrice: this.checkoutTotal == '' ? this.subscriptionTotal : this.checkoutTotal,
            couponApplied: this.iscouponReadonly ? 1 : 0,
            coupon: this.iscouponReadonly ? this.couponInput : '',
            coupon_id: this.usedCouponId,
            subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id
          }
          this.pay(data);
        }
        // else {
        //   if (this.selectedTopupCountryDetails) {
        //     let data = {
        //       topupid: this.selectedTopupCountryDetails.id,
        //       countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
        //       finalPrice: this.checkoutTotal,
        //       couponApplied: this.couponInput ? 1 : 0,
        //       coupon: this.couponInput,
        //     }
        //     this.pay(data);
        //   }
        //   else {
        //     this.toast.add({ severity: 'warn', summary: 'Warn', detail: 'Please Choose a plan' });
        //   }
        // }
      },
      (error) => {
        if (this.selectedSubscriptionDetails) {
          let data = {
            subscriptionId: this.selectedSubscriptionDetails.id,
            countryId: this.selectedSubscriptionDetails.selectedCountry.id,
            finalPrice: this.checkoutTotal,
            couponApplied: this.couponInput ? 1 : 0,
            coupon: this.couponInput,
            subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id
          }
          if (this.checkoutTotal == '') {
            data.finalPrice = this.subscriptionTotal;
          }
          this.pay(data);
        }
        // else {
        //   if (this.selectedTopupCountryDetails) {
        //     let data = {
        //       topupid: this.selectedTopupCountryDetails.id,
        //       countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
        //       finalPrice: this.checkoutTotal,
        //       couponApplied: this.couponInput ? 1 : 0,
        //       coupon: this.couponInput,
        //     }
        //     this.pay(data);
        //   }
        //   else {
        //     this.toast.add({ severity: 'warn', summary: 'Warn', detail: 'Please Choose a plan' });
        //   }
        // }
      }
    );
  }
  confirmSubscription(event: Event,message:string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: 'Confirmation',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.subscribe();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  pay(value: any) {
    this.subscriptionDetails = value;
    // this.showPayLoading = true;
    if (value.subscriptionId) {
      this.subscriptionService.placeSubscriptionOrder(value).subscribe((data) => {
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
    // else {
    //     this.subscriptionService.placeTopupSubscriptionOrder(value).subscribe((data) => {
    //         this.payWithRazor(data.orderid);
    //     });
    // }

  }
  payWithRazor(orderid: any) {
    let razorKey = 'rzp_live_YErYQVqDIrZn1D';
    if (environment.domain == "api.uniprep.ai") {
      razorKey = 'rzp_test_Crpr7YkjPaCLEr';
    }
    const options: any = {
      key: razorKey,
      amount: this.subscriptionDetails?.finalPrice * 100,
      currency: "INR",
      name: "UNIPREP",
      description: "UNIPREP Subscription",
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg",
      order_id: orderid,

      prefill: {
        name: this.selectedSubscriptionDetails?.subscription,
        email: this.authservice.user?.email,
        contact: this.authservice.user?.usertype_name,
      },
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
      var paymentdata = {
        orderid: response?.razorpay_order_id,
        paymentid: response?.razorpay_payment_id,
      };
      setTimeout(() => {
        this.authservice.updateSubscriptionName(
          this.selectedSubscriptionDetails?.subscription || ""
        );
        if (this.subscriptionDetails?.subscriptionId) {
          this.subscriptionService.PaymentComplete(paymentdata).subscribe(
            (res: any) => {
              this.success = res;
              this.subscriptionService.doneLoading();
              this.gotoHistory();
            },
            (error: any) => {
              this.subscriptionService.doneLoading();
              this.gotoHistory();
            }
          );
        }
        // else {
        //     let data = {
        //         order_id: response?.razorpay_order_id,
        //         payment_reference_id: response?.razorpay_payment_id,
        //     }
        //     this.subscriptionService.topupPaymentComplete(data).subscribe(
        //         (res: any) => {
        //             this.success = res;
        //             this.subscriptionService.doneLoading();
        //             this.loadSubData();
        //             window.location.reload();
        //         },
        //         (error: any) => {
        //             // this.toastr.warning(error.error.message);
        //             this.subscriptionService.doneLoading();
        //             this.loadSubData();
        //             window.location.reload();
        //         }
        //     );
        // }

      }, 0);
    };
    options.modal.ondismiss = () => {

      this.toast.add({ severity: 'error', summary: 'Error', detail: "Transaction cancelled" });

    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
  onInput(event: any) {
    this.invalidCoupon = false;

  }
  clearCoupon() {
    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Coupon Removed' });
    this.subscriptionTotal = this.subscriptionAmt;
    this.checkoutTotal = this.subscriptionTotal;
    this.discountAmountEnable = false;
    this.showCross = false;
    this.iscouponReadonly = false;
    this.couponInput = "";
  }

  gotoHistory() {
    this.router.navigate(['pages/subscriptions']);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.findCountry(longitude, latitude);
      });
    } else {
      console.log("No support for geolocation")
    }
  }

  findCountry(longitude: number, latitude: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    this.http.get<any>(url).subscribe(
      (data: any) => {
        this.currentCountry = data?.address?.country;
        this.findContinent(this.currentCountry);
      },
      (error: any) => {
        console.log('Error fetching location:', error);
      }
    );
  }
  findContinent(countryName: string) {
    this.http.get(`https://restcountries.com/v3.1/name/${countryName}`).subscribe(
      (data: any) => {
        if (data?.length > 0) {
          this.continent = data[data?.length - 1].continents[0];
        }
        else {
          this.continent = 'Not found';
        }
      },
      error => {
        console.error('Error:', error);
        this.continent = 'Error';
      }
    );
  }
  changeMonthlyPlan(event: any) {
    let tabIndex = event.index;
    let data = "";
    if (tabIndex == 0) {
      this.monthlyPlan = 3;
    }
    else if (tabIndex == 1) {
      this.monthlyPlan = 6;
    }
    else {
      this.monthlyPlan = 12;
    }
    if (this.monthlyPlan > this.existingSubscription[0].monthlyPlan) {
      data = "canSubscribeAll";
    }
    else if (this.monthlyPlan == this.existingSubscription[0].monthlyPlan) {
      this.loadExistingSubscription();
      return;
    } else {
      data = "canSubscribeSome";
    }
    this.getSubscriptionList(data);
  }

  protected readonly localStorage = localStorage;
}
