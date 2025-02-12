import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostOfLivingService } from './cost-of-living.service';
import { City, CostOfLiving, Price } from 'src/app/@Models/cost-of-living';
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../Auth/auth.service";
import { MessageService } from 'primeng/api';
import { LocationService } from 'src/app/location.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
@Component({
    selector: 'uni-cost-of-living',
    templateUrl: './cost-of-living.component.html',
    styleUrls: ['./cost-of-living.component.scss'],
    standalone: true,

    imports: [CommonModule, DialogModule,  FormsModule, ReactiveFormsModule, SelectModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule],

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
  costofLivingStatements: { statement: string }[] = [
    { statement: 'The Cost of Living In United Arab Emirates is 124.56% greater than in India.' },
    { statement: 'The Cost of Living In United States is 131.62% greater than in India.' },
    { statement: 'The Cost of Living In France is 154.50% greater than in India.' },
    { statement: 'The Cost of Living In United Kingdom is 129.89% greater than in India.' },
    { statement: 'The Cost of Living In Australia is 95.44% greater than in India.' },
  ];
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];

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
    this.checkplanExpire()
    this.getCurrencyConvertions('United States,India');
    this.locationService.getImage().subscribe((imageUrl: any) => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe((orgname: any) => {
      this.orgnamewhitlabel = orgname;
    });
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      }
    ];
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
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
        this.toastr.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong please contact the team or reload the page again', life: 10000 });
      }
      this.sourceCountryPrices = response;
      this.sourceCountryPrices?.prices?.forEach((price: Price) => {
        price.itemCount = 1;
      })
      this.costOfLivingService.calculatePrices(targetCityDetails).subscribe(response => {
        if (response.error !== null) {
          this.toastr.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong please contact the team or reload the page again', life: 10000 });
        }
        this.targetCountryPrices = response;
        this.targetCountryPrices?.prices?.forEach((price: Price) => {
          price.itemCount = 1;
        });
        this.canShowComparision = true;
      });
    });
  }
  getCurrencyConvertions(comparingCountries: string) {
    this.costOfLivingService.currencyConvert({ countries: comparingCountries }).subscribe(res => {
      this.costOfLivingService.inrRate = res.rate;
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
        city?.city_name?.toLowerCase().includes(this.form.get('sourceFilter')?.value?.toLowerCase()) || city.country_name.toLowerCase().includes(this.form.get('sourceFilter')?.value?.toLowerCase())
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
      city?.city_name?.toLowerCase().includes(this.form.get('targetFilter')?.value?.toLowerCase()) || city.country_name.toLowerCase().includes(this.form.get('targetFilter')?.value?.toLowerCase())
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
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan=="Student") {
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
