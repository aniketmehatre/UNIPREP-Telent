import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Router } from '@angular/router';
import { City } from 'src/app/@Models/cost-of-living';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
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
    selector: 'uni-travel-visit-planner',
    templateUrl: './travel-visit-planner.component.html',
    styleUrls: ['./travel-visit-planner.component.scss'],
    standalone: true,
    imports: [CommonModule,SkeletonModule,FluidModule,InputTextModule,TooltipModule,ButtonModule,MultiSelectModule,CarouselModule,InputGroupModule,InputGroupAddonModule,FormsModule,ReactiveFormsModule,InputTextModule,SelectModule,DialogModule,CardModule,InputNumberModule]
})
export class TravelVisitPlannerComponent implements OnInit {

  constructor(
    private travelToolService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService,
    private sanitizer: DomSanitizer
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
  recommendationData: SafeHtml = [];
  savedResponse: any = [];
  destinationLocationList: City[] = [];

  ngOnInit(): void {
    this.selectedData[2] = 1; //second page i need to show the days count so manually i enter the day.
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
        let chatGptResponse = response.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '');
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
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
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Travel Visit Planner</h2>
				</div>
			</div><p><strong>Input:<br></strong></p>`;
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
    let finalRecommendation = addingInput + '<p><strong>Response:<br></strong></p>' + this.recommendationData + '</div>';
		finalRecommendation = finalRecommendation
			.replace(/```html|```/g, '') 
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
			.replace(/SafeValue must use \[property\]=binding:/g, '')
			.replace(/class="container"/g, ''); //because if i add container the margin will increase so i removed the container now the spacing is proper.

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
