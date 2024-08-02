import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CostOfLivingService } from './cost-of-living.service';
import { City, CostOfLiving, Price } from 'src/app/@Models/cost-of-living';

@Component({
  selector: 'uni-cost-of-living',
  templateUrl: './cost-of-living.component.html',
  styleUrls: ['./cost-of-living.component.scss']
})
export class CostOfLivingComponent implements OnInit {

  cities: City[] = [];
  sourceCities: City[] = [];
  targetCities: City[] = [];

  countries: { label: string, value: string }[] = [];
  form!: FormGroup;

  canShowComparision: boolean = false;
  sourceCountryPrices!: CostOfLiving;
  targetCountryPrices!: CostOfLiving;

  constructor(
    private fb: FormBuilder,
    private costOfLivingService: CostOfLivingService
  ) {
    this.form = this.fb.group({
      sourceCity: [null],
      targetCity: [null],
      sourceCountry: [null],
      targetCountry: [null],
    });
  }

  ngOnInit() {
    this.costOfLivingService.getCities().subscribe(res => {

      this.cities = res?.cities;
      this.cities.forEach((city: City) => {
        const country = this.countries.find((item: any) => item.label === city.country_name);
        if (!country) {
          this.countries.push({ label: city.country_name, value: city.country_name });
        }

      });
    });
  }

  compare() {
    var sourceCityDetails = this.cities.find(city => city.city_id === this.form.value.sourceCity);
    var targetCityDetails = this.cities.find(city => city.city_id === this.form.value.targetCity);
    this.costOfLivingService.calculatePrices(sourceCityDetails).subscribe(response => {
      this.sourceCountryPrices = response;
      this.sourceCountryPrices.prices.forEach((price: Price) => {
        price.itemCount = 1;
      })
      this.costOfLivingService.calculatePrices(targetCityDetails).subscribe(response => {
        this.targetCountryPrices = response;
        this.sourceCountryPrices.prices.forEach((price: Price) => {
          price.itemCount = 1;
        })
        this.canShowComparision = true;
      });
    });
  }
  loadCity(countryField: string) {
    if (countryField == 'sourceCountry') {
      this.sourceCities = this.cities.filter(city => city.country_name == this.form.get('sourceCountry')?.value);
      return;
    }
    this.targetCities = this.cities.filter(city => city.country_name == this.form.get('targetCountry')?.value);
  }
}
