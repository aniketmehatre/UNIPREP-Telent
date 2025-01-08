import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { CountryandCurrency } from 'src/app/@Models/currency.model';
import { Location } from '@angular/common';
import { TravelCostEstimatorQuestionList } from '../trvel-tool-questions';
import { ChatGPTResponse, TravelCostEstimator } from 'src/app/@Models/chat-gpt.model';

@Component({
  selector: 'uni-travel-cost-estimator',
  templateUrl: './travel-cost-estimator.component.html',
  styleUrls: ['./travel-cost-estimator.component.scss']
})
export class TravelCostEstimatorComponent implements OnInit {

  recommendations: { id: number, question: string }[] = TravelCostEstimatorQuestionList;
  trvelExperienceList: { id: number, name: string }[] = [
    { id: 1, name: 'Basic' },
    { id: 2, name: 'Standard' },
    { id: 3, name: 'Luxury' }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  currencyList: CountryandCurrency[] = [];
  departureLocationList: CountryandCurrency[] = [];
  destinationLocationList: CountryandCurrency[] = [];
  countryandCurrencyList: CountryandCurrency[] = [];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  departureFilter: string = '';
  destinationFilter: string = '';
  currencyFilter: string = '';
  recommendationData: string = '';
  recommadationSavedQuestionList: TravelCostEstimator[] = [];
  isFromSavedData: boolean = false;


  constructor(
    private travelToolsService: TravelToolsService,
    private location: Location
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
    else if (type === 'destination') {
      if (this.destinationFilter === "") {
        this.destinationLocationList = this.countryandCurrencyList;
        return;
      }
      this.destinationLocationList = this.countryandCurrencyList.filter(item =>
        item?.country.toLowerCase().includes(this.destinationFilter.toLowerCase())
      );
    }
    else {
      if (this.currencyFilter === "") {
        this.currencyList = this.countryandCurrencyList;
        return;
      }
      this.currencyList = this.countryandCurrencyList.filter(item =>
        item?.currency_code?.toLowerCase().includes(this.currencyFilter.toLowerCase())
      );
    }
  }

  resetFunction(type: string) {
    if (type === 'departure') {
      this.departureFilter = '';
      this.departureLocationList = this.countryandCurrencyList;
    }
    else if (type === 'destination') {
      this.destinationFilter = '';
      this.destinationLocationList = this.countryandCurrencyList;
    }
    else {
      this.currencyFilter = '';
      this.currencyList = this.countryandCurrencyList;
    }
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    this.departureFilter = "";
    this.destinationFilter = "";
    this.departureLocationList = this.countryandCurrencyList;
    this.destinationLocationList = this.countryandCurrencyList;
    this.invalidClass = false;
    if (itemId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  getRecommendation() {
    let data: any = {
      country: this.selectedData[1],
      destination: this.selectedData[2],
      duration: this.selectedData[3],
      experience: this.selectedData[4],
      currency: this.selectedData[5],
      mode: 'travelcostestimator'
    }
    this.travelToolsService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        this.recommendationData = response.response;
      },
      error: error => {
        this.isRecommendationData = false;
      }
    });
  }

  resetRecommendation() {
    this.activePageIndex = 0;
    this.selectedData = { 3: 1 };
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = false;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.travelToolsService.getTripList('travelcostestimator').subscribe({
        next: response => {
          this.isRecommendationQuestion = false;
          this.isRecommendationData = false;
          this.isRecommendationSavedData = true;
          this.recommadationSavedQuestionList = response.data;
        },
        error: error => {
        }
      });
    }
  }

  showRecommandationData(data: string) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationData = data;
  }

  goBack() {
    this.location.back();
  }
  
}
