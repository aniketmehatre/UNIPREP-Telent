import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marketingAnalysisData } from './marketing-analysis.data';
import { PromptService } from "src/app/services/prompt.service";
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { removeExtraResponse } from '../../../@Supports/prompt';
export interface selectList {
  name: string;
}
@Component({
  selector: 'uni-marketing-analysis',
  templateUrl: './marketing-analysis.component.html',
  styleUrls: ['./marketing-analysis.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule, RouterModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule]
})
export class MarketingAnalysisComponent implements OnInit {
  locationList: any[] = [];
  targetMarketList = marketingAnalysisData['Target Audience'];
  productServiceList = marketingAnalysisData['Product/Service'];
  businessModelList = marketingAnalysisData.Model;
  salesChannelsList = marketingAnalysisData['Sales Channels'];
  timeFramesList = marketingAnalysisData['Analysis Duration'];
  revenueStreamsList = marketingAnalysisData['Revenue Streams'];
  competitorList = marketingAnalysisData['Competitor Analysis Focus'];
  industryList = marketingAnalysisData.Industry;
  forecastingList = marketingAnalysisData['Market Forecast'];
  isFromSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  page = 1;
  pageSize = 25;
  first: number = 0;
  marketingForm: FormGroup = new FormGroup({});
  currentPlan: string = "";
  locationName: string = '';
  submitted: boolean = false;
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  // currencyandCountryList: any;
  currenciesList: any;
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: SafeHtml;
  isResponseSkeleton: boolean = false;
  
  userInputs: any;

  constructor(
    private fb: FormBuilder,
    private foundersToolsService: FounderstoolService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private costOfLivingService: CostOfLivingService,
    private sanitizer: DomSanitizer,
    private promptService: PromptService

  ) {
    this.marketingForm = this.fb.group({
      industry: ['', Validators.required],
      location: ['', Validators.required],
      targetMarket: ['', Validators.required],
      productService: ['', Validators.required],
      businessModel: ['', Validators.required],
      salesChannel: ['', Validators.required],
      timeFrame: ['', Validators.required],
      budget: ['', Validators.required],
      revenueStreams: ['', Validators.required],
      competitorAnalysis: ['', Validators.required],
      currencycode: ['', Validators.required],
      forecast: ['', Validators.required]
    });

  }
  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["What industry does your business operate in?", "Where is you business established?", "What is the age group of your target audience?", " What products or services does your business provide?"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Marketing & Sales',
        branches: ["What is your business model?", "Which sales channels do you use to reach to your customers?", "What is the preferred timeframe for this analysis?"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Finance',
        branches: ["What is your allocated budget for conducting this market research?", " What are your primary revenue streams?", "What specific factors are you focusing on in the competitor analysis?", "Over what period should the market forecast be conducted?"]
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  ngOnInit(): void {
    this.getCityList();
    this.getCurrenyandLocation();
    
  }


  goBack() {
    this.router.navigateByUrl('/pages/founderstool/founderstoollist');
  }


  getCurrenyandLocation() {
    // this.foundersToolsService.getCurrencyAndCountries().subscribe((res: any) => {
    //   console.log(res);
    //   this.currencyandCountryList = res;
    // });

    this.foundersToolsService.getCurrenciesList().subscribe((res: any) => {
      this.currenciesList = res;
    });
  }

  getCityList() {
    this.costOfLivingService.getCities().subscribe({
      next: response => {
        this.locationList = response;
      }
    });
  }

  checkUserRecommendation() {
    this.foundersToolsService.getRecommendations().subscribe(res => {
      if (res.status) {
        this.enableModule = true;
      } else {
        this.enableModule = false;
        // this.addAnyValueToOptions();
      }
    });
  }

  getRecommendation() {
    if(this.authService._creditCount === 0){
			this.toast.add({severity: "error",summary: "Error",detail: "Please Buy some Credits...!"});
			this.router.navigateByUrl('/pages/export-credit')
			return;
		}
    this.recommendationData = "";
    this.submitted = false;
    const formData = this.marketingForm.value;
    if (this.activePageIndex == 2) {
      if (!formData.budget || !formData.revenueStreams || !formData.forecast || !formData.competitorAnalysis || !formData.currencycode) {
        this.submitted = true;
        return;
      }
    }

    let data: any = {
      ...this.marketingForm.value,
      mode: 'market_analysis',
      location: formData.location.city_name + ', ' + formData.location.country_name
    }
    this.userInputs = data;
    this.isRecommendationQuestion = false;
    this.isRecommendationSavedData = false;
    this.isRecommendationData = true;
    this.isResponseSkeleton = true;
    this.foundersToolsService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isResponseSkeleton = false;
        this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response);
        this.authService.aiCreditCount$.next(true);
      },
      error: (error) => {
        console.error(error);
        this.isResponseSkeleton = false;
        this.isRecommendationData = false;
      }
    });
  }

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next() {
    if (this.authService.isInvalidSubscription('founders_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.submitted = false;
    const formData = this.marketingForm.value;
    if (this.activePageIndex == 0) {
      if (!formData.industry || !formData.location || !formData.targetMarket || !formData.productService) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.businessModel || !formData.salesChannel || !formData.timeFrame) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.budget || !formData.revenueStreams || !formData.forecast || !formData.competitorAnalysis) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (this.authService.isInvalidSubscription('founders_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (!this.isFromSavedData) {
      this.foundersToolsService.getAnalysisList('market_analysis').subscribe({
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

  showRecommandationData(data: string, userInputs: any) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    // this.recommendationData = data;
    this.recommendationData = removeExtraResponse(data);

    const encodedJson = userInputs;
    const decodedInput = JSON.parse(encodedJson);
    this.userInputs = decodedInput;
  }

  resetRecommendation() {
    this.foundersToolsService.resetRecommendation().subscribe(res => {
      this.isRecommendationQuestion = true;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = false;
      this.marketingForm.reset();
      this.activePageIndex = 0;
      this.isFromSavedData = false;
    });
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let addingInput: string = '';
    const formValue = ['industry', 'location', 'targetMarket', 'productService', 'businessModel', 'salesChannel', 'timeFrame', 'budget', 'revenueStreams', 'competitorAnalysis', 'forecast'];
    // Keep track of which formValue index we're currently using
    let formValueIndex = 0;
    this.recommendations.forEach((category: any) => {
      addingInput += `<p><strong>${category.question.heading}</strong></p>`;
      category.question.branches.forEach((branchQuestion: any) => {
        addingInput += `<p style="color: var(--p-primary-500);"><strong>${branchQuestion}</strong></p>`;
        let currentAnswer = "";
        const currentFormField = formValue[formValueIndex];
        if (this.userInputs[currentFormField]) {
          if (currentFormField == 'budget') {
            currentAnswer = this.userInputs['currencycode'] + ' ' + this.userInputs[currentFormField];
          } else {
            currentAnswer = this.userInputs[currentFormField];
          }
        } else {
          currentAnswer = "No answer provided";
        }
        addingInput += `<p>${currentAnswer}</p><br>`;
        formValueIndex++;
      });
      // Add spacing between categories
      addingInput += `<br>`;
    });

    let params: any = {
      module_name: "Marketing Analysis",
      file_name: "marketing_analysis",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("market-analysis");
  }

}
