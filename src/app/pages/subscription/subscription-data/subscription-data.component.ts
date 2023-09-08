import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Billinginfo, OrderHistory, Subscription } from "../../../@Models/subscription";
import { environment } from "@env/environment.prod";
import { AuthService } from 'src/app/Auth/auth.service';
import { MenuItem } from 'primeng/api';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'uni-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.scss']
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
  labelVariable: string = 'test'
  baseSubSelectedCountry: number = 2;
  selectedCoutriesList: any = [];
  selectedCountryOption: any = {
        altname: "uk",
        country: "United Kingdom",
        created_at: "2022-12-14T06:16:52.000000Z",
        flag: "http://40.80.95.32/uniprepapi/storage/app/public/country-flags/united-kingdom.svg",
        id: 2,
        status: 1,
        updated_at: "2023-07-25T06:45:19.000000Z"
  };
  constructor(private authService: AuthService,
    private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {

    this.authService.getCountry().subscribe((data) => {
      this.countryList = data;
      this.changeCountry({value:[2,3]});
    });
    this.getSubscriptionList();
  }
  get URL() {
    return `${environment.ApiUrl}/downloadinvoice`;
  }
  onSuc(event: any) {
    console.log(event);
  }
  onErr(event: any) {
    console.log(event);
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
      perpage: 1000
    }
    this.subscriptionService.getSubscriptions(data).subscribe((response) => {

    });
  }

  changeCountry(event: any) {
    let selectedIds = event.value;
    this.selectedCoutriesList = this.countryList.filter((item: any) => selectedIds.includes(item.id));
  }
  removeCountry(selectedId: number) {
    this.selectedCountry = this.selectedCountry.filter(item => item !== selectedId);
  }
  changeBaseCountry(event: any) {
    this.selectedCountryOption = event.selectedOption;
  }
}
