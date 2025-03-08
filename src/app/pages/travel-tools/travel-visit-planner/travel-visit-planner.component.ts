import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Router } from '@angular/router';
import { City } from 'src/app/@Models/cost-of-living';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { MessageService } from 'primeng/api';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';

@Component({
  selector: 'uni-travel-visit-planner',
  templateUrl: './travel-visit-planner.component.html',
  styleUrls: ['./travel-visit-planner.component.scss']
})
export class TravelVisitPlannerComponent implements OnInit {

  constructor(
    private travelToolService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService

  ) { }

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: "What is your destination?" },
    { id: 2, question: "How many days will your trip last?" },
    { id: 3, question: "During which travel season or specific month do you plan to travel?" }
  ];
  seasons: { value: string }[] = [
    { value: "Summer" },
    { value: "Winter" },
    { value: "Fall" },
    { value: "Spring" },
    { value: 'Rainy' }
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
  destinationLocationList: City[] = [];
  cityList: City[] = [];
  destinationFilter: string = '';

  ngOnInit(): void {
    this.selectedData[2] = 1; //second page i need to show the days count so manually i enter the day.
    this.getCityList();
  }

  getCityList() {
    this.costOfLivingService.getCities().subscribe({
      next: response => {
        this.cityList = response;
        this.destinationLocationList = response;
      }
    });
  }

  customFilterFunction() {
    if (this.destinationFilter === "") {
      this.destinationLocationList = this.cityList;
      return;
    }
    this.destinationLocationList = this.cityList.filter(city =>
      city?.city_name?.toLowerCase().includes(this.destinationFilter.toLowerCase()) || city?.country_name?.toLowerCase().includes(this.destinationFilter.toLowerCase())
    );
  }

  resetFunction() {
    this.destinationFilter = '';
    this.destinationLocationList = this.cityList;
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
        destination: this.selectedData[1].city_name ?? this.selectedData[1].country_name,
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

    this.travelToolService.getTripList('travel_visit_planner').subscribe(response => {
      this.savedResponse = response.data;
    })
  }
  clickRecommendation(response: any) {
    this.isRecommendation = false;
    this.isResponsePage = true;
    this.isSavedPage = false;
    this.recommendationData = response;
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let selectedCityAndCountry = this.selectedData[1].city_name+', '+this.selectedData[1].country_name;
    let addingInput = `<p><strong>Input:<br></strong></p>`;
    this.recommendations.forEach(values =>{
      addingInput += `<p><strong>${values.question}</strong></p>`;
      let currentAnswer = "";
      if(values.id == 1){
        currentAnswer = selectedCityAndCountry;
      }else if(values.id == 2){
        currentAnswer = `${this.selectedData[2]} Days`;
      }else if(values.id == 3){
        currentAnswer = `${this.selectedData[3]} Season`;
      }
      addingInput += `<p>${currentAnswer}</p><br>`;
    });
    let finalRecommendation = addingInput+ '<p><strong>Response:<br></strong></p>' + this.recommendationData;
    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Travel Visit Planner",
      file_name: "travel_visit_planner"
    };

    this.travelToolService.convertHTMLtoPDF(paramData).then(() =>{
      console.log("PDF genrated Successfully.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    })
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }
}
