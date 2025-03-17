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
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  travelTypeList: { id: number, name: string }[] = [
    { id: 1, name: 'Business' },
    { id: 2, name: 'Leisure' },
    { id: 3, name: 'Adventure' }
  ];
  transportationModeList: { id: number, name: string }[] = [
    { id: 1, name: 'Metro' },
    { id: 2, name: 'Train' },
    { id: 3, name: 'Bus' }
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
  recommendationData: SafeHtml;
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any[] = [{}];
  isFromSavedData: boolean = false;
  constructor(
    private travelToolsService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.selectedData = { 4: 1 };
    this.getCityList();
  }

  getCityList() {
    this.costOfLivingService.getCities().subscribe({
      next: response => {
        this.destinationLocationList = response;
      }
    });
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
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
        let chatGptResponse = response.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
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
    let selectedCityAndCountry = this.selectedData[1].city_name+', '+this.selectedData[1].country_name;
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Travel Packaging Planner</h2>
				</div>
			</div>
      <p><strong>Input:<br></strong></p>`;
    this.recommendations.forEach(values =>{
      addingInput += `<p style="color: #d32f2f;"><strong>${values.question}</strong></p>`;
      let currentAnswer = "";
      if(values.id == 1){
        currentAnswer = selectedCityAndCountry;
      }else if(values.id == 2){
        currentAnswer = this.selectedData[2];
      }else if(values.id == 3){
        currentAnswer = this.selectedData[3].join(", ");
      }else if(values.id == 4){
        currentAnswer = `${ this.selectedData[4] } Days`;
      }else if(values.id == 5){
        currentAnswer = `${ this.selectedData[5] } Month`;
      }
      addingInput += `<p>${ currentAnswer }</p><br>`;
    });
    let finalRecommendation = addingInput+ '<div class="divider"></div><p><strong>Response:<br><br></strong></p>' + this.recommendationData;
    finalRecommendation = finalRecommendation
			.replace(/```html|```/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
			.replace(/SafeValue must use \[property\]=binding:/g, '')
			.replace(/class="container"/g, 'style="line-height:1.9"'); //because if i add container the margin will increase so i removed the container now the spacing is proper.
		
    let paramData: DownloadRespose = {
        response: finalRecommendation,
        module_name: "Travel Packing Planner",
        file_name: "travel_packing_planner"
      };
    this.travelToolsService.convertHTMLtoPDF(paramData).then(() =>{
      console.log("PDF Download Successfully");
    }).catch(error =>{
      console.error("Error generating PDF:", error)
    })
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }
}
