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
import { ComparisionComponent } from './comparision/comparision.component';
@Component({
  selector: 'uni-cost-of-living',
  templateUrl: './cost-of-living.component.html',
  styleUrls: ['./cost-of-living.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ReactiveFormsModule, SelectModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule, ComparisionComponent],

})
export class CostOfLivingComponent implements OnInit {

  cities: City[] = [];
  sourceCities: City[] = [];
  targetCities: City[] = [];
  form!: FormGroup;
  planExpired: boolean = false
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
      targetCity: [null]
    });
    this.cityChange();
  }

  ngOnInit() {
    this.checkplanExpire()
    this.getCurrencyConvertions('United States,India');
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
    this.costOfLivingService.getCities().subscribe((res: City[]) => {
      this.cities = res;
      this.sourceCities = this.cities;
      this.targetCities = this.cities;
    });
  }

  compare() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.sourcecountryName = this.form.value.sourceCity.country_name;
    this.targetcountryName = this.form.value.targetCity.country_name;
    this.costOfLivingService.calculatePrices(this.form.value.sourceCity).subscribe(response => {
      if (response.error !== null) {
        this.toastr.add({ severity: 'error', summary: 'Alert', detail: 'Something went wrong please contact the team or reload the page again', life: 10000 });
      }
      this.sourceCountryPrices = response;
      this.sourceCountryPrices?.prices?.forEach((price: Price) => {
        price.itemCount = 1;
      })
      this.costOfLivingService.calculatePrices(this.form.value.targetCity).subscribe(response => {
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
  cityChange() {
    this.form.controls['sourceCity'].valueChanges.subscribe(
      data => {
        if (data) {
          this.sourceCountry = data.country_name;
          this.targetCities = this.cities.map(city => ({
            ...city,
            disabled: city.city_id === data.city_id, // Disable selected city
          }));
        } else {
          this.targetCities = this.cities;
        }
      }
    );
    this.form.controls['targetCity'].valueChanges.subscribe(
      data => {
        if (data) {
          this.targetCountry = data.country_name;
          this.sourceCities = this.cities.map(city => ({
            ...city,
            disabled: city.city_id === data.city_id, // Disable selected city
          }));
        } else {
          this.sourceCities = this.cities;
        }
      }
    );
  }
  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

}
