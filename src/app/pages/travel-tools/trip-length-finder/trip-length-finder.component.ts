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
import { PromptService } from '../../prompt.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageFacadeService } from '../../page-facade.service';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'uni-trip-length-finder',
  templateUrl: './trip-length-finder.component.html',
  styleUrls: ['./trip-length-finder.component.scss'],
  standalone: true,
  imports: [CommonModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, SharedModule]
})
export class TripLengthFinderComponent implements OnInit {

  constructor(
    private travelToolService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService,
    private sanitizer: DomSanitizer,
    private prompt: PromptService,
    private pageFacade: PageFacadeService,
    private authService: AuthService
  ) { }

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: "Which destination are you considering for your trip?" }
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
  isResponseSkeleton: boolean = false;
  
  userInputs: any;

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
    this.recommendationData = "";
    if (this.authService.isInvalidSubscription('travel_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.hideWarning(productId);
    if (!this.invalidClass) {
      let data = {
        country: this.selectedData[1].city_name + ', ' + this.selectedData[1].country_name,
        mode: "trip_length_finder"
      };
      this.userInputs = data;
      this.isResponsePage = true;
      this.isRecommendation = false;
      this.isResponseSkeleton = true;
      this.travelToolService.getChatgptRecommendations(data).subscribe({
        next: (response: any) => {
          this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response);
          this.isResponseSkeleton = false;
          this.authService.aiCreditCount$.next(true);
        },
        error: (error) => {
          console.error(error);
          this.isResponseSkeleton = false;
        },
      })
    }
  }

  buyCredits() {
    if (this.authService.isInvalidSubscription('travel_tools')) {
      this.authService.hasUserSubscription$.next(true);
    } else {
      this.router.navigate(["/pages/export-credit"]);
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
    this.recommendationData = "";
    this.isRecommendation = true;
    this.isResponsePage = false;
    this.isSavedPage = false;
    this.activePageIndex = 0;
    this.selectedData = [];
  }

  savedRecommendations() {
    if (this.authService.isInvalidSubscription('travel_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.isRecommendation = false;
    this.isResponsePage = false;
    this.isSavedPage = true;

    this.travelToolService.getTripList('trip_length_finder').subscribe(response => {
      this.savedResponse = response.data;
    })
  }

  clickRecommendation(response: any, userInputs: any) {
    this.isRecommendation = false;
    this.isResponsePage = true;
    this.isSavedPage = false;
    this.recommendationData = response;

    const encodedJson = userInputs;
    const decodedInput = JSON.parse(encodedJson);
    this.userInputs = decodedInput;
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    // let selectedCityAndCountry = this.selectedData[1].city_name + ', ' + this.selectedData[1].country_name;
    let addingInput: string = `
      <p style="color: #3f4c83;"><strong>Which Destination are you planning to visit?</strong></p>
      <p>${this.userInputs.country}</p>`;
    let params: any = {
      module_name: "Trip Length Finder",
      file_name: "trip_length_finder",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.prompt.responseBuilder(params);
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}