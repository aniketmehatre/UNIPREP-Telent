import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Billinginfo, OrderHistory, Subscription } from "../../../@Models/subscription";
import { environment } from "@env/environment.prod";
import { AuthService } from 'src/app/Auth/auth.service';
import { MenuItem, MessageService } from 'primeng/api';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'uni-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.scss'],
})
export class SubscriptionDataComponent implements OnInit {
  selectedButton: any;
  countryList: any;
  breadCrumb: MenuItem[] = [];
  selectedCountry: any[] = [2, 3];
  isInstructionVisible: boolean = false
  @Input() billing!: any | null;
  @Input() subscriptions!: Subscription | null;
  @Input() history: OrderHistory[] = [];
  @Output() upgrade = new EventEmitter();
  basesubscription = true;
  topupcountries = false;
  topupvalidity = false;
  subscriptionList: any = [];

  subscriptionTopupList: any = [];
  couponInput: string = '';
  subscriptionTotal: any = '0.00';
  invalidCoupon: boolean = false;
  selectedSubscriptionDetails: any;
  selectedTopupCountryDetails: any;
  showCheckout: boolean = true;
  @Output() subscriptionPlan = new EventEmitter();
  constructor(private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private toast: MessageService) { }

  ngOnInit(): void {

    this.authService.getCountry().subscribe((data) => {
      this.countryList = data;
      this.getSubscriptionList();
      this.getSubscriptionTopupList();
    });
  }
  get URL() {
    return `${environment.ApiUrl}/downloadinvoice`;
  }
  buttonclicked1() {
    this.basesubscription = true;
    this.topupcountries = false;
    this.topupvalidity = false;
  }
  buttonclicked2() {
    this.basesubscription = false;
    this.topupcountries = true;
    this.topupvalidity = false;
  }
  buttonclicked3() {
    this.basesubscription = false;
    this.topupcountries = false;
    this.topupvalidity = true;
  }
  closeAllHome() {
    this.isInstructionVisible = false;
  }
  moreabout() {
    this.isInstructionVisible = true;
  }

  getSubscriptionList() {
    let data = {
      page: 1,
      perpage: 1000,
      studenttype: 1
    }
    this.subscriptionService.getSubscriptions(data).subscribe((response) => {
      this.subscriptionList = response.subscriptions;
      this.subscriptionList.forEach((item: any) => {
        item.country = item.country.split(',').map(Number);
        let filteredCountryIds = item.country;
        item.selected = false;
        item.selectedCoutry = {};
        item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
        item.isActive = item.popular == 1 ? true : false;
      });
    });
  }

  getSubscriptionTopupList() {
    this.subscriptionService.getSubscriptionTopups().subscribe((response) => {
      this.subscriptionTopupList = response.topups;
      this.subscriptionTopupList.forEach((item: any) => {
        item.price = Number(item.price);
        item.countries = item.countries.split(',').map(Number);
        let filteredCountryIds = item.countries;
        item.selected = false;
        item.selectedCoutriesList = [];
        item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
        item.isActive = item.popular == 1 ? true : false;
      });
    });
  }

  removeCountry(subId: number, selectedId: number) {
    this.subscriptionTopupList.forEach((item: any) => {
      if (subId == item.id) {
        item.selectedCoutriesList = item.selectedCoutriesList.filter((data: any) => data.id !== selectedId);
      }
    });
  }

  selectedSubscriptionPlan(sub: any) {
    this.showCheckout = false;
    this.subscriptionList.forEach((item: any) => {
      item.selected = false;
      item.isActive = false;
      if (sub.id == item.id) {
        item.selected = true;
        item.isActive = true;
      }
    });
    this.selectedSubscriptionDetails = sub;
    this.subscriptionTotal = sub.givenprice;
  }

  selectedTopupCountryPlan(sub: any) {
    if(sub?.selectedCoutriesList?.length > 0) {
      this.showCheckout = false;
      this.subscriptionTopupList.forEach((item: any) => {
        item.selected = false;
        item.isActive = false;
        if (sub.id == item.id) {
          item.selected = true;
          item.isActive = true;
        }
      });
      this.selectedTopupCountryDetails = sub;
      this.subscriptionTotal = sub.finalamount * sub.selectedCoutriesList.length;
    }
    else {
      this.toast.add({severity:'warn', summary: 'Warn', detail: 'Please Choose a country'});
    }

  }

  applyCoupon() {
    if (this.couponInput) {
      let data = {
        couponCode: this.couponInput,
        checkoutTotal: this.subscriptionTotal
      }
      this.subscriptionService.applyCoupon(data).subscribe((response) => {
        if (response.success) {
          this.subscriptionTotal = Number(this.subscriptionTotal) - response.discountPrice;
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon is Applied' });
        }
        else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: response.message });
          this.invalidCoupon = true;
        }
      });
    }
    else {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some Coupon Code!' });
    }
  }

  checkout() {
    if (this.basesubscription && this.selectedSubscriptionDetails) {
      let data = {
        subscriptionId: this.selectedSubscriptionDetails.id,
        countryId: this.selectedSubscriptionDetails.selectedCoutry.id,
        finalPrice: this.subscriptionTotal,
        couponApplied: this.couponInput ? 1 : 0,
        coupon: this.couponInput,
      }
      this.subscriptionPlan.emit(data);
    }
    else {
      if (this.selectedTopupCountryDetails) {
        let data = {
          topupid: this.selectedTopupCountryDetails.id,
          countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
          finalPrice: this.subscriptionTotal,
          couponApplied: this.couponInput ? 1 : 0,
          coupon: this.couponInput,
        }
        this.subscriptionPlan.emit(data);
      }
      else {
        this.toast.add({severity:'warn', summary: 'Warn', detail: 'Please Choose a plan'});
      }
    }
  }

  onInput(event: any) {
    this.invalidCoupon = false;
  }

}
