import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CostOfLivingService } from './cost-of-living.service';
import { City, CostOfLiving, Price } from 'src/app/@Models/cost-of-living';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { debounceTime } from 'rxjs';

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

  canShowComparision: boolean = false;
  sourceCountryPrices!: CostOfLiving;
  targetCountryPrices!: CostOfLiving;
  sourceCountry: string = '';
  targetCountry: string = '';
  constructor(
    private fb: FormBuilder,
    private costOfLivingService: CostOfLivingService
  ) {
    this.form = this.fb.group({
      sourceCity: [null],
      targetCity: [null],
      sourceFilter: [''],
      targetFilter: ['']
    });
  }

  ngOnInit() {
    this.costOfLivingService.getCities().subscribe((res: City[]) => {
      this.cities = res;
      this.sourceCities = this.cities;
      this.targetCities = this.cities;
    });
  }

  compare() {
    var sourceCityDetails = this.cities.find(city => city.city_id === this.form.value.sourceCity&&city.country_name==this.sourceCountry);
    var targetCityDetails = this.cities.find(city => city.city_id === this.form.value.targetCity&&city.country_name==this.targetCountry);
     
    console.log(sourceCityDetails);
    console.log(targetCityDetails);
    this.costOfLivingService.calculatePrices(sourceCityDetails).subscribe(response => {
      this.sourceCountryPrices = response;
      this.sourceCountryPrices.prices.forEach((price: Price) => {
        price.itemCount = 1;
      })
      this.costOfLivingService.calculatePrices(targetCityDetails).subscribe(response => {
        this.targetCountryPrices = response;
        this.targetCountryPrices.prices.forEach((price: Price) => {
          price.itemCount = 1;
        });
        this.canShowComparision = true;
      });
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
      this.sourceCities = this.cities.filter(city =>
        city?.city_name?.toLowerCase().includes(this.form.get('sourceFilter')?.value) || city.country_name.toLowerCase().includes(this.form.get('sourceFilter')?.value)
      );
      return;
    }
    this.targetCities = this.cities.filter(city =>
      city?.city_name.toLowerCase().includes(this.form.get('targetFilter')?.value) || city.country_name.toLowerCase().includes(this.form.get('targetFilter')?.value)
    );
  }
  cityChange(typeOfField: string, cityDetails: any) {
    if (typeOfField == 'source') {
      this.sourceCountry = cityDetails.country_name;
      return;
    }
    this.targetCountry = cityDetails.country_name
  }


}
