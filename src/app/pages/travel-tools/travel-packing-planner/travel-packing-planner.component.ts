import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { TravelPackingPlannerQuestionList } from '../trvel-tool-questions';
import { Router } from '@angular/router';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { City } from 'src/app/@Models/cost-of-living';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CarouselModule } from 'primeng/carousel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'uni-travel-packing-planner',
    templateUrl: './travel-packing-planner.component.html',
    styleUrls: ['./travel-packing-planner.component.scss'],
    standalone: true,
    imports: [CommonModule,SkeletonModule,FluidModule,InputTextModule,TooltipModule,ButtonModule,MultiSelectModule,CarouselModule,InputGroupModule,InputGroupAddonModule,FormsModule,ReactiveFormsModule,InputTextModule,SelectModule,DialogModule,CardModule,InputNumberModule]
})
export class TravelPackingPlannerComponent implements OnInit {

  recommendations: { id: number, question: string }[] = TravelPackingPlannerQuestionList;
  activePageIndex: number = 0;
  destinationLocationList: City[] = [];
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
    { id: 3, name: 'By road' }
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
  cityList: City[] = [];
  recommendationData: string = '';
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any[] = [{}];
  isFromSavedData: boolean = false;
  constructor(
    private travelToolsService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService
  ) { }

  ngOnInit(): void {
    this.selectedData = { 4: 1 };
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

  customFilterFunction(type: string) {
    if (this.destinationFilter === "") {
      this.destinationLocationList = this.cityList;
      return;
    }
    this.destinationLocationList = this.cityList.filter(city =>
      city?.city_name?.toLowerCase().includes(this.destinationFilter.toLowerCase()) || city?.country_name?.toLowerCase().includes(this.destinationFilter.toLowerCase())
    );
  }

  resetFunction(type: string) {
    this.destinationFilter = '';
    this.destinationLocationList = this.cityList;
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    this.destinationFilter = "";
    this.destinationLocationList = this.cityList;
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
      destination: this.selectedData[1].city_name ?? this.selectedData[1].country_name,
      travel_type: this.selectedData[2],
      travel_mode: this.selectedData[3],
      duration: this.selectedData[4],
      travel_month: this.selectedData[5],
      mode: 'travel_packaging_planner'
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
      this.travelToolsService.getTripList('travel_packaging_planner').subscribe({
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
    else {
      this.isRecommendationQuestion = false;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = true;
    }
  }

  showRecommandationData(data: string) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationData = data;
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    this.travelToolsService.downloadRecommendation({ data: this.recommendationData }).subscribe({
      next: res => {
        window.open(res.url, "_blank");
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }
}
