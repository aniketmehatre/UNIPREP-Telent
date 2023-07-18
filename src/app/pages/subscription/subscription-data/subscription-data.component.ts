import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Billinginfo, OrderHistory, Subscription} from "../../../@Models/subscription";
import {environment} from "@env/environment.prod";
import { AuthService } from 'src/app/Auth/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'uni-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.scss']
})
export class SubscriptionDataComponent implements OnInit {
  selectedButton:any;
  countryList: any;
  breadCrumb: MenuItem[] = [];
  selectedCountry: any[] = [[2], [2], [2], [2]];
  isInstructionVisible: boolean = false
  @Input() billing!: any | null;
  @Input() subscriptions!: Subscription | null;
  @Input() history: OrderHistory[] = [];
  @Output() upgrade = new EventEmitter();
  basesubscription=true;
  topupcountries=false;
  topupvalidity=false;
  constructor(  private authService: AuthService,) { }

  ngOnInit(): void {

    this.authService.getCountry().subscribe((data) => {
      this.countryList = data;
      console.log(this.countryList);
  });
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
  buttonclicked1(){
    this.basesubscription=true;
    this.topupcountries=false;
    this.topupvalidity=false;
  }
  buttonclicked2(){
    this.basesubscription=false;
    this.topupcountries=true;
    this.topupvalidity=false;
  }
  buttonclicked3(){
    this.basesubscription=false;
    this.topupcountries=false;
    this.topupvalidity=true;
  }
  closeAllHome() {
    this.isInstructionVisible = false;
}
moreabout(){
  this.isInstructionVisible = true;
}
}
