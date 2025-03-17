import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
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
export interface selectList {
  name: string;
}
import { marketingAnalysisData } from './marketing-analysis.data';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';

@Component({
    selector: 'uni-marketing-analysis',
    templateUrl: './marketing-analysis.component.html',
    styleUrls: ['./marketing-analysis.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, CardModule,RouterModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
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
  planExpired!: boolean;
  recommendRestrict: boolean = false;
  marketingForm: FormGroup = new FormGroup({});
  restrict: boolean = false;
  currentPlan: string = "";
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orglogowhitelabel: any;
  orgnamewhitlabel: any;
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
  constructor(
    private fb: FormBuilder,
    private foundersToolsService: FounderstoolService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private travelToolService: TravelToolsService,
    private pageFacade: PageFacadeService,
    private costOfLivingService: CostOfLivingService,
    private sanitizer: DomSanitizer
    
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
      currencycode: [''],
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
        branches: ["What industry does your business operate in?", "Where is your business or target market location?", "Who is your target market ?", "What products or services does your business offer?"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Marketing & Sales',
        branches: ["Can you describe your business model?", "Through which sales channels do you reach your customers?", "Over what duration do you want this analysis to be conducted?"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Finance',
        branches: ["What budget have you allocated for conducting this market research?", " What are your primary revenue streams?", "What specific aspects do you want to focus on in the competitor analysis?", "What time frame do you have in mind for the market forecast?"]
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
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

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status?.subscription_plan;
      if (
        data.plan === "expired" || data.plan === 'subscription_expired' ||
        subscription_exists_status?.subscription_plan === "free_trail"
      ) {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
      if (
        data.plan === "expired" || data.plan === 'subscription_expired'
      ) {
        this.recommendRestrict = true;
      } else {
        this.recommendRestrict = false;
      }
    });
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
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
    this.submitted = false;
    const formData = this.marketingForm.value;
    if (this.activePageIndex == 2) {
      if (!formData.budget || !formData.revenueStreams || !formData.forecast || !formData.competitorAnalysis) {
        this.submitted = true;
        return;
      }
    }
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    let data: any = {
      ...this.marketingForm.value,
      mode: 'market_analysis',
      location: formData.location.city_name+', '+formData.location.country_name
    }
    this.foundersToolsService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        // this.recommendationData = response.response;
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

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next() {
    this.submitted = false;
    const formData = this.marketingForm.value;
    console.log(formData)
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

  showRecommandationData(data: string) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationData = data;
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
    const formValue = ['industry', 'location', 'targetMarket', 'productService', 'businessModel', 'salesChannel', 'timeFrame', 'budget', 'revenueStreams', 'competitorAnalysis', 'forecast'];
    const formData = this.marketingForm.value;
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Marketing Analysis</h2>
				</div>
			</div><p><strong>Input:<br></strong></p>`;

    // Keep track of which formValue index we're currently using
    let formValueIndex = 0;

    this.recommendations.forEach((category: any) => {
      addingInput += `<p><strong>${category.question.heading}</strong></p>`;

      category.question.branches.forEach((branchQuestion: any) => {
        addingInput += `<p style="color: #d32f2f;"><strong>${branchQuestion}</strong></p>`;

        let currentAnswer = "";
        const currentFormField = formValue[formValueIndex];

        if (formData && formData[currentFormField]) {
          if (currentFormField == 'budget') {
            currentAnswer = formData['currencycode'] + ' ' + formData[currentFormField];
          } else {
            currentAnswer = formData[currentFormField];
          }
        } else {
          currentAnswer = "No answer provided";
        }

        addingInput += `<p>${currentAnswer}</p>`;

        formValueIndex++;
      });

      // Add spacing between categories
      addingInput += `<br>`;
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
      module_name: "Marketing Analysis",
      file_name: "marketing_analysis"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }

}
