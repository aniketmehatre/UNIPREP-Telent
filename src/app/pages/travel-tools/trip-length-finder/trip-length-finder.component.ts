import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
@Component({
    selector: 'uni-trip-length-finder',
    templateUrl: './trip-length-finder.component.html',
    styleUrls: ['./trip-length-finder.component.scss'],
    standalone: true,
    imports: [CommonModule,SkeletonModule,FluidModule,InputTextModule,TooltipModule,ButtonModule,MultiSelectModule,CarouselModule,InputGroupModule,InputGroupAddonModule,FormsModule,ReactiveFormsModule,InputTextModule,SelectModule]
})
export class TripLengthFinderComponent implements OnInit {

  constructor(
    private travelToolService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService,
    private sanitizer: DomSanitizer
  ) { }

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: "Which Destination are you planning to visit?" }
  ];
  isRecommendation: boolean = true;
  isResponsePage: boolean = false;
  isSavedPage: boolean = false;
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  recommendationData: SafeHtml;
  savedResponse: any = [];
  destinationLocationList: City[] = [];

  ngOnInit(): void {
    this.getCityList();
  }

  getCityList() {
    this.costOfLivingService.getCities().subscribe({
      next: response => {
        this.destinationLocationList = response;
      }
    });
  }

  getRecommendation(productId: number) {
    this.hideWarning(productId);
    if (!this.invalidClass) {
      let data = {
        country: this.selectedData[1].city_name ?? this.selectedData[1].country_name,
        mode: "trip_length_finder"
      };
      this.travelToolService.getChatgptRecommendations(data).subscribe((response:any) => {
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
  }

  savedRecommendations() {
    this.isRecommendation = false;
    this.isResponsePage = false;
    this.isSavedPage = true;

    this.travelToolService.getTripList('trip_length_finder').subscribe(response => {
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
    let addingInput = `
      <div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Trip Length Finder</h2>
				</div>
			</div><p><strong>Input:<br></strong></p>
      <p><strong>Which Destination are you planning to visit?</strong></p>
      <p>${selectedCityAndCountry}</p>
      <br>
    `;

    let finalRecommendation = addingInput + '<p><strong>Response:<br></strong></p>' + this.recommendationData + '</div>';
		finalRecommendation = finalRecommendation
			.replace(/```html|```/g, '') 
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
			.replace(/SafeValue must use \[property\]=binding:/g, '')
			.replace(/class="container"/g, ''); //because if i add container the margin will increase so i removed the container now the spacing is proper.


    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Trip Length Finder",
      file_name: "trip_length_finder"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
    
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }

}