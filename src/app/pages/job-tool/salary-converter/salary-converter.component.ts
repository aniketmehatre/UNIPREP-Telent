import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SalaryConverterService} from "./salary-converter.service";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {LocationService} from "../../../location.service";
import {PlanService} from "../../../shared/plan.service";
import {AuthService} from "../../../Auth/auth.service";

@Component({
  selector: 'uni-salary-converter',
  templateUrl: './salary-converter.component.html',
  styleUrls: ['./salary-converter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalaryConverterComponent implements OnInit {

  salary: any
  selectedCurrencyCode: string = 'INR'
  selectedCountryName: any
  selectedCountryCode: any
  selectedToCurrencyCode: string = 'INR'
  selectedToCountryCode: any
  selectedToCountryName: any
  taxData: any
  fromCountry: any
  toCountry: any
  countries: any[] = []
  rates: any
  statementText: any
  inHomeCurrency: any
  isPPPCardVisible: boolean = false
  planExpired: boolean = false
  restrict: boolean = false
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  get fromValue() {
    return this.taxData[0];
  }
  get toValue() {
    return this.taxData[1];
  }

  constructor(private salaryConverterService: SalaryConverterService, private _location: Location,
              private authService: AuthService, private router: Router, private locationService: LocationService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = false;
    } else {
      this.ehitlabelIsShow = true;
    }
    this.checkPlanIsExpired()
    this.salaryConverterService.getCountries().subscribe(data => {
      this.countries = data;
    })

  }

  isShowPlanExpiredDialog: boolean = false
  convert(): void {
    // this.planService.checkPlanIsExpired().subscribe((isExpired) => {
    //   if (isExpired) {
    //     this.planExpired = isExpired;
    //     this.restrict = isExpired;
    //     this.isShowPlanExpiredDialog = true
    //     this.cdr.detectChanges();
    //     return;
    //   } else {
    //
    //   }
    // });
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isShowPlanExpiredDialog = false
    if (this.fromCountry && this.toCountry && this.salary) {
      const fromPpp = this.selectedCountryCode;
      const toPpp = this.selectedToCountryCode;
      let req = {
        codes: `${fromPpp},${toPpp}`,
        amt: this.salary
      }
      this.salaryConverterService.getTaxData(req).subscribe((resp: any) => {
        this.taxData = resp.data
        this.statementText = resp.statement
        this.inHomeCurrency = resp.inHomeCurrency
        this.isPPPCardVisible = true
      });
    }
  }

  onCountryChange(event: any){
    this.selectedCountryCode = event.value.countryCode
    this.selectedCurrencyCode = event.value.currencyCode
    this.selectedCountryName = event.value.countryName
    this.isPPPCardVisible = false
    this.taxData = []
  }

  onCountryToChange(event: any){
    this.selectedToCountryCode = event.value.countryCode
    this.selectedToCurrencyCode = event.value.currencyCode
    this.selectedToCountryName = event.value.countryName
    this.isPPPCardVisible = false
    this.taxData = []
  }

  goBack(){
    this._location.back();
  }

  checkPlanIsExpired(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      if (data.plan === "expired" || data.plan === 'subscription_expired') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  clearRestriction() {
    this.restrict = false;
  }

}
