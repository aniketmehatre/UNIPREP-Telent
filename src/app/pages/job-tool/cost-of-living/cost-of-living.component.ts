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
      this.targetCities=this.cities;
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
        this.targetCountryPrices.prices.forEach((price: Price) => {
          price.itemCount = 1;
        })
        this.canShowComparision = true;
      });
    });
  }

  customFilter(search: string, city: any): boolean {
    const searchTerm = search.toLowerCase();
    return city.city_name.toLowerCase().includes(searchTerm) || city.country_name.toLowerCase().includes(searchTerm);
  }
  resetFunction(typeOfField:string) {
    if(typeOfField=='source'){
      this.sourceCities = this.cities;
      this.form.get('sourceFilter')?.setValue('');
      return;
    }
    this.targetCities = this.cities;
    this.form.get('targetFilter')?.setValue('');
  }


  customFilterFunction(typeOfField:string) {
    if(typeOfField=='source'){
      this.sourceCities = this.cities.filter(city =>
        city.city_name.toLowerCase().includes(this.form.get('sourceFilter')?.value) || city.country_name.toLowerCase().includes(this.form.get('sourceFilter')?.value)
      );
      return;
    }
    this.targetCities = this.cities.filter(city =>
      city.city_name.toLowerCase().includes(this.form.get('targetFilter')?.value) || city.country_name.toLowerCase().includes(this.form.get('targetFilter')?.value)
    );
  }



}
