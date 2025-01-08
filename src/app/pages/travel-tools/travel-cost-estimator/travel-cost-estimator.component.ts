import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { CountryandCurrency } from 'src/app/@Models/currency.model';

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
  currencyList: CountryandCurrency[] = [];
  departureLocationList: CountryandCurrency[] = [];
  destinationLocationList: CountryandCurrency[] = [];
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
  countryandCurrencyList: CountryandCurrency[] = [];
  recommendationData: string = '';
  isRecommendationData: boolean = false;

  constructor(
    private travelToolsService: TravelToolsService
  ) { }

  ngOnInit(): void {
    this.selectedData = { 3: 1 };
    this.getCurrencyList();
  }

  getCurrencyList() {
    this.travelToolsService.getCurrencies().subscribe({
      next: response => {
        this.countryandCurrencyList = response;
        this.currencyList = response;
        this.departureLocationList = response;
        this.destinationLocationList = response;
      }
    });
  }

  customFilterFunction(type: string) {
    if (type === 'departure') {
      if (this.departureFilter === "") {
        this.departureLocationList = this.countryandCurrencyList;
        return;
      }
      this.departureLocationList = this.countryandCurrencyList.filter(item =>
        item?.country.toLowerCase().includes(this.departureFilter.toLowerCase())
      );
    }
    else {
      if (this.destinationFilter === "") {
        this.destinationLocationList = this.countryandCurrencyList;
        return;
      }
      this.destinationLocationList = this.countryandCurrencyList.filter(item =>
        item?.country.toLowerCase().includes(this.destinationFilter.toLowerCase())
      );
    }
  }

  resetFunction(type: string) {
    if (type === 'departure') {
      this.departureFilter = '';
      this.departureLocationList = this.countryandCurrencyList;
    }
    else {
      this.destinationFilter = '';
      this.destinationLocationList = this.countryandCurrencyList;
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
    // debugger
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
    let data:any = {
      country: this.selectedData[1],
      destination: this.selectedData[2],
      duration: this.selectedData[3],
      experinece: this.selectedData[4],
      currency: this.selectedData[5],
      mode: 'travecostestimator'
    }
    // this.travelToolsService.getRecommendationforTravelCostEstimator(data).subscribe({
    //   next: response => {
    //     this.isRecommendationData = true;
    //     this.recommendationData = response.response;
    //   },
    //   error: error => {
    //     this.isRecommendationData = false;
    //   }
    // });
  }
}
