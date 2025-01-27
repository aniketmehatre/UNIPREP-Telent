import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Location } from '@angular/common';

@Component({
  selector: 'uni-travel-visit-planner',
  templateUrl: './travel-visit-planner.component.html',
  styleUrls: ['./travel-visit-planner.component.scss']
})
export class TravelVisitPlannerComponent implements OnInit {

  constructor(private travelToolService: TravelToolsService, private location: Location) { }

  recommendations: { id: number, question: string }[] = [
    {
      id: 1,
      question: "Where are you planning to travel?",
    },
    {
      id: 2,
      question: "How many days will your trip be?",
    },
    {
      id: 3,
      question: "Which season or month are you planning your trip?",
    }
  ];
  seasons: any = [
    { value: "Summer" },
    { value: "Winter" },
    { value: "Fall" },
    { value: "Spring" }
  ];
  isRecommendation: boolean = true;
  isResponsePage: boolean = false;
  isSavedPage: boolean = false;
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  allCountries: any = [];
  invalidClass: boolean = false;
  recommendationData: any = [];
  savedResponse: any = [];

  ngOnInit(): void {
    this.selectedData[2] = 1; //second page i need to show the days count so manually i enter the day.
    this.getCountriesList();
  }

  getCountriesList(): void {
    this.travelToolService.getCurrencies().subscribe(response => {
      this.allCountries = response;
    });
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number) {
    this.hideWarning(productId);
    if (!this.invalidClass) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    }
  }

  getRecommendation(productId: number) {
    this.hideWarning(productId);
    if (!this.invalidClass) {
      let data = {
        destination: this.selectedData[1],
        trip_duration: this.selectedData[2] + " days",
        season: this.selectedData[3],
        mode: "travel_visit_planner"
      };
      this.travelToolService.getChatgptRecommendations(data).subscribe(response => {
        this.recommendationData = response.response;
        this.isRecommendation = false;
        this.isResponsePage = true;
      })
    }
  }

  hideWarning(productId: number) {
    if (productId in this.selectedData) {
      this.invalidClass = false;
    } else {
      this.invalidClass = true;
    }
  }

  resetRecommendation() {
    this.recommendationData = [];
    this.isRecommendation = true;
    this.isResponsePage = false;
    this.isSavedPage = false;
    this.activePageIndex = 0;
    this.selectedData = [];
    this.selectedData[2] = 1;
  }

  savedRecommendations() {
    this.isRecommendation = false;
    this.isResponsePage = false;
    this.isSavedPage = true;
    
    this.travelToolService.getTripList('travel_visit_planner').subscribe( response =>{
      this.savedResponse = response.data;
    })
  }
  clickRecommendation(response: any){
    this.isRecommendation = false;
    this.isResponsePage = true;
    this.isSavedPage = false;
    this.recommendationData = response;
  }

  goBack() {
    this.location.back();
  }
}
