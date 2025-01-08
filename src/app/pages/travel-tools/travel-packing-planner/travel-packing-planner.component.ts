import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { CountryandCurrency } from 'src/app/@Models/currency.model';
import { Location } from '@angular/common';
import { TravelPackingPlannerQuestionList } from '../trvel-tool-questions';

@Component({
  selector: 'uni-travel-packing-planner',
  templateUrl: './travel-packing-planner.component.html',
  styleUrls: ['./travel-packing-planner.component.scss']
})
export class TravelPackingPlannerComponent implements OnInit {

  recommendations: { id: number, question: string }[] = TravelPackingPlannerQuestionList;
  activePageIndex: number = 0;
  destinationLocationList: CountryandCurrency[] = [];
  destinationFilter: string = '';
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  travelTypeList: { id: number, name: string }[] = [
    { id: 1, name: 'Business' },
    { id: 2, name: 'Leisure' },
    { id: 3, name: 'Adventure' }
  ];
  transportationModeList: { id: number, name: string }[] = [
    { id: 1, name: 'Flight' },
    { id: 2, name: 'Train' },
    { id: 3, name: 'Road Trip' }
  ];
  monthList: { id: number, name: string }[] = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
  countryandCurrencyList: CountryandCurrency[] = [];
  recommendationData: string = '';
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any[] = [{}];
  isFromSavedData: boolean = false;
  constructor(
    private travelToolsService: TravelToolsService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.selectedData = { 4: 1 };
    this.getCurrencyList();
  }

  getCurrencyList() {
    this.travelToolsService.getCurrencies().subscribe({
      next: response => {
        this.countryandCurrencyList = response;
        this.destinationLocationList = response;
      }
    });
  }

  customFilterFunction(type: string) {
    if (this.destinationFilter === "") {
      this.destinationLocationList = this.countryandCurrencyList;
      return;
    }
    this.destinationLocationList = this.countryandCurrencyList.filter(item =>
      item?.country.toLowerCase().includes(this.destinationFilter.toLowerCase())
    );
  }

  resetFunction(type: string) {
    this.destinationFilter = '';
    this.destinationLocationList = this.countryandCurrencyList;
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    this.destinationFilter = "";
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
      destination: this.selectedData[1],
      travel_type: this.selectedData[2],
      travel_mode: this.selectedData[3],
      duaration: this.selectedData[4],
      travel_month: this.selectedData[5],
      mode: 'travelpackingplanner'
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
    this.selectedData = { 4: 1 };
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = false;
  }

  saveRecommadation() {
    if(!this.isFromSavedData) {
      this.travelToolsService.getTripList('travelpackingplanner').subscribe({
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
