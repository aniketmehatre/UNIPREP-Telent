import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';

@Component({
  selector: 'uni-travel-visit-planner',
  templateUrl: './travel-visit-planner.component.html',
  styleUrls: ['./travel-visit-planner.component.scss']
})
export class TravelVisitPlannerComponent implements OnInit {

  constructor(private travelToolService: TravelToolsService) { }

  recommendations: { id: number, question: string }[] = [
      {
        id: 1,
        question: "Select Your Nationality",
      },
      {
        id: 2,
        question: "Select the country you are looking for",
      },
      {
        id: 3,
        question: "Select your residential status of ",
      }
    ];
    seasons: any = [
      {value: "Summer"},
      {value: "Winter"},
      {value: "Fall"},
      {value: "Spring"}
    ];

    activePageIndex: number = 0;
    selectedData: { [key: string]: any } = {};
    allCountries: any = [];
    invalidClass: boolean = false;
  
    ngOnInit(): void {
      this.getCountriesList();
    }
  
    getCountriesList(): void{
      this.travelToolService.getCurrencies().subscribe( response => {
        this.allCountries = response;
      });
    }
  
    previous(){
      this.invalidClass = false;
      if (this.activePageIndex > 0) {
        this.activePageIndex--;
      }
    }
  
    next(productId: number){
      this.hideWarning(productId);
      if(!this.invalidClass){
        if (this.activePageIndex < this.recommendations.length - 1) {
          this.activePageIndex++;
        }
      }
    }
  
    getRecommendation(productId: number){
      this.hideWarning(productId);
      if(!this.invalidClass){
        let data = {
          destination: this.selectedData[1],
          trip_duration: this.selectedData[2]+ " days",
          season: this.selectedData[3],
          mode: "travel_visit_planner"
        };
        console.log(data);
        this.travelToolService.getRecommendationforTravelCostEstimator(data).subscribe(response =>{
          console.log(response,"chatgpt response");
        })
      }
    }

    hideWarning(productId: number){
      if (productId in this.selectedData) {
        this.invalidClass = false;
      } else {
        this.invalidClass = true;
      }
    }
}
