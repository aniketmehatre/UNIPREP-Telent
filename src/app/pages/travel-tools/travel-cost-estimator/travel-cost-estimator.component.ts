import { Component, OnInit } from '@angular/core';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { City } from 'src/app/@Models/cost-of-living';
import { TravelToolsService } from '../travel-tools.service';
import { Currency } from 'src/app/@Models/currency.model';

@Component({
  selector: 'uni-travel-cost-estimator',
  templateUrl: './travel-cost-estimator.component.html',
  styleUrls: ['./travel-cost-estimator.component.scss']
})
export class TravelCostEstimatorComponent implements OnInit {

  recommendations: { id: number, question: string }[] = [
    {
      id: 1,
      question: "Select your Departure Location",
    },
    {
      id: 2,
      question: "Select your Destination",
    },
    {
      id: 3,
      question: "Duration of Travel",
    },
    {
      id: 4,
      question: "Select your experience preference"
    },
    {
      id: 5,
      question: "Select your preferred currency"
    },
  ];
  activePageIndex: number = 0;
  cityList: City[] = [];
  departureLocationList: City[] = [];
  destinationLocationList: City[] = [];
  departureFilter: string = '';
  destinationFilter: string = '';
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  trvelExperienceList: { id: number, name: string }[] = [
    {
      id: 1,
      name: 'Basic'
    },
    {
      id: 2,
      name: 'Standard'
    },
    {
      id: 3,
      name: 'Luxury'
    }
  ];
  currencyList: Currency[] = [];
  recommendationData: string = '';
  isRecommendationData: boolean = false;

  constructor(
    private costOfLivingService: CostOfLivingService,
    private travelToolsService: TravelToolsService
  ) { }

  ngOnInit(): void {
    this.selectedData = { 3: 1 };
    this.getCityList();
    this.getCurrencyList();
  }

  getCityList() {
    this.costOfLivingService.getCities().subscribe({
      next: response => {
        this.cityList = response;
        this.departureLocationList = response;
        this.destinationLocationList = response;
      }
    });
  }

  getCurrencyList() {
    this.travelToolsService.getCurrencies().subscribe({
      next: response => {
        this.currencyList = response;
      }
    });
  }

  customFilterFunction(type: string) {
    if (type === 'departure') {
      if (this.departureFilter === "") {
        this.departureLocationList = this.cityList;
        return;
      }
      this.departureLocationList = this.cityList.filter(city =>
        city?.city_name?.toLowerCase().includes(this.departureFilter.toLowerCase()) || city.country_name.toLowerCase().includes(this.departureFilter.toLowerCase())
      );
    }
    else {
      if (this.destinationFilter === "") {
        this.destinationLocationList = this.cityList;
        return;
      }
      this.destinationLocationList = this.cityList.filter(city =>
        city?.city_name?.toLowerCase().includes(this.destinationFilter.toLowerCase()) || city.country_name.toLowerCase().includes(this.destinationFilter.toLowerCase())
      );
    }
  }

  resetFunction(type: string) {
    if (type === 'departure') {
      this.departureFilter = '';
      this.departureLocationList = this.cityList;
    }
    else {
      this.destinationFilter = '';
      this.destinationLocationList = this.cityList;
    }
  }

  cityChange(typeOfField: string, cityDetails: any) { }

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number): void {
    this.departureFilter = "";
    this.destinationFilter = "";
    this.invalidClass = false;
    // if (productId in this.selectedData) {
    if (this.activePageIndex < this.recommendations.length - 1) {
      this.activePageIndex++;
    }
    // } else {
    //   this.invalidClass = true;
    // }
  }

  getRecommendation() {
    // debugger
    // let data:any = {
    //   country: this.selectedData[1],
    //   destination: this.selectedData[2],
    //   duration: this.selectedData[3],
    //   experinece: this.selectedData[4],
    //   currency: this.selectedData[5],
    //   mode: 'travecostestimator'
    // }

    let data: any = {
      country: 'Germany',
      destination: 'Canada',
      duration: 3,
      experience: 'Basic',
      currency: 'CAD',
      mode: 'travelcostestimator'
    }
    this.travelToolsService.getRecommendationforTravelCostEstimator(data).subscribe({
      next: response => {
        this.isRecommendationData = true;
        this.recommendationData = response.response;
      },
      error: error => {
        this.isRecommendationData = false;
      }
    });
  }
}
