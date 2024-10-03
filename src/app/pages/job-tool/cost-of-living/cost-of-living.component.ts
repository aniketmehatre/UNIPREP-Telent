import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CostOfLivingService } from './cost-of-living.service';
import { City, CostOfLiving, Price } from 'src/app/@Models/cost-of-living';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { debounceTime } from 'rxjs';
import { LocationService } from "../../../location.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../Auth/auth.service";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-cost-of-living',
  templateUrl: './cost-of-living.component.html',
  styleUrls: ['./cost-of-living.component.scss']
})
export class CostOfLivingComponent implements OnInit {

  cities: City[] = [];
  sourceCities: City[] = [];
  targetCities: City[] = [];
  form!: FormGroup;
  planExpired: boolean = false
  restrict: boolean = false
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  canShowComparision: boolean = false;
  sourceCountryPrices!: CostOfLiving;
  targetCountryPrices!: CostOfLiving;
  targetcountryName: string = '';
  sourcecountryName: string = '';
  sourceCountry: string = '';
  targetCountry: string = '';
  constructor(
    private fb: FormBuilder, private locationService: LocationService,
    private costOfLivingService: CostOfLivingService, private router: Router, private authService: AuthService,
    private toastr: MessageService
  ) {
    this.form = this.fb.group({
      sourceCity: [null],
      targetCity: [null],
      sourceFilter: [''],
      targetFilter: ['']
    });
  }

  ngOnInit() {
    this.checkPlanIsExpired()
    this.getCurrencyConvertions('United States,India', '');
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
    this.costOfLivingService.getCities().subscribe((res: City[]) => {
      this.cities = res;
      this.sourceCities = this.cities;
      this.targetCities = this.cities;
    });
  }

  compare() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    var sourceCityDetails = this.cities.find(city => city.city_id === this.form.value.sourceCity);
    var targetCityDetails = this.cities.find(city => city.city_id === this.form.value.targetCity);
    this.sourcecountryName = sourceCityDetails ? sourceCityDetails.country_name : '';
    this.targetcountryName = targetCityDetails ? targetCityDetails.country_name : '';
    this.costOfLivingService.calculatePrices(sourceCityDetails).subscribe(response => {
      if (response.error !== null) {
        this.toastr.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong please contact the team or reload the page agian', life: 10000 });
      }
      this.sourceCountryPrices = response;
      this.sourceCountryPrices?.prices?.forEach((price: Price) => {
        price.itemCount = 1;
      })
      this.costOfLivingService.calculatePrices(targetCityDetails).subscribe(response => {
        if (response.error !== null) {
          this.toastr.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong please contact the team or reload the page agian', life: 10000 });
        }
        this.targetCountryPrices = response;
        this.targetCountryPrices?.prices?.forEach((price: Price) => {
          price.itemCount = 1;
        });
        this.canShowComparision = true;
      });
    });
  }
  getCurrencyConvertions(comparingCountries: string, countryType: string) {
    this.costOfLivingService.currencyConvert({ countries: comparingCountries }).subscribe(res => {
      if (countryType === 'sourceCountry') {
        if (this.sourceCountryPrices.country_name == 'India') {
          this.costOfLivingService.inrRate = res.rate;
        }
      } else if (countryType === 'targetCountry') {
        if (this.targetCountryPrices.country_name == 'India') {
          this.costOfLivingService.inrRate = res.rate;
        }
      } else {
        this.costOfLivingService.inrRate = res.rate;
      }
    },
      error => {
      });
  }

  resetFunction(typeOfField: string) {
    if (typeOfField == 'source') {
      this.sourceCities = this.cities;
      this.form.get('sourceFilter')?.setValue('');
      return;
    }
    this.targetCities = this.cities;
    this.form.get('targetFilter')?.setValue('');
  }


  customFilterFunction(typeOfField: string) {
    if (typeOfField == 'source') {
      if (this.form.get('sourceFilter')?.value === "") {
        this.sourceCities = this.cities;
        return;
      }
      this.sourceCities = this.cities.filter(city =>
        city?.city_name?.toLowerCase().includes(this.form.get('sourceFilter')?.value) || city.country_name.toLowerCase().includes(this.form.get('sourceFilter')?.value)
      );
      const sourceCountries = this.sourceCities.filter(city => city.city_name == '');
      sourceCountries.forEach(city => {
        this.sourceCities.pop();
      });
      this.sourceCities.unshift(...sourceCountries);
      return;
    }
    if (this.form.get('targetFilter')?.value === "") {
      this.targetCities = this.cities;
      return;
    }
    this.targetCities = this.cities.filter(city =>
      city?.city_name?.toLowerCase().includes(this.form.get('targetFilter')?.value) || city.country_name.toLowerCase().includes(this.form.get('targetFilter')?.value)
    );
    console.log(this.targetCities);
    const targetCountries = this.targetCities.filter(city => city.city_name == '');
    targetCountries.forEach(city => {
      this.targetCities.pop();
    });
    this.targetCities.unshift(...targetCountries);
  }

  cityChange(typeOfField: string, cityDetails: any) {
    if (typeOfField == 'source') {
      this.sourceCountry = cityDetails.country_name;
      return;
    }
    this.targetCountry = cityDetails.country_name
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
