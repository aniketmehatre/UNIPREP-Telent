import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Location } from '@angular/common';

@Component({
  selector: 'uni-trip-length-finder',
  templateUrl: './trip-length-finder.component.html',
  styleUrls: ['./trip-length-finder.component.scss']
})
export class TripLengthFinderComponent implements OnInit {

  constructor(private travelToolService: TravelToolsService, private location: Location) { }

  recommendations: { id: number, question: string }[] = [
    {
      id: 1,
      question: "What is your travel destination?",
    }
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
    this.getCountriesList();
  }

  getCountriesList(): void {
    this.travelToolService.getCurrencies().subscribe(response => {
      this.allCountries = response;
    });
  }

  getRecommendation(productId: number) {
    this.hideWarning(productId);
    if (!this.invalidClass) {
      let data = {
        country: this.selectedData[1],
        mode: "trip_length_finder"
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
  }

  savedRecommendations() {
    this.isRecommendation = false;
    this.isResponsePage = false;
    this.isSavedPage = true;
    
    this.travelToolService.getTripList('trip_length_finder').subscribe( response =>{
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
