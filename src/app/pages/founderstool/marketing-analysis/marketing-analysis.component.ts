import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { UserManagementService } from '../../user-management/user-management.service';
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
export interface selectList {
  name: string;
}
import { marketingAnalysisData } from './marketing-analysis.data';

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
  currencyandCountryList: any;
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: string = '';
  constructor(
    private fb: FormBuilder,
    private foundersToolsService: FounderstoolService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private pageFacade: PageFacadeService
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
        branches: ["What budget have you allocated for conducting this market research?", "What budget have you allocated for conducting this market research?", "What specific aspects do you want to focus on in the competitor analysis?", "What time frame do you have in mind for the market forecast?"]
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
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
    this.getCurrenyandLocation();
  }

  goBack() {
    this.router.navigateByUrl('/pages/founderstool/founderstoollist');
  }


  getCurrenyandLocation() {
    this.foundersToolsService.getCurrencyAndCountries().subscribe((res: any) => {
      console.log(res);
      this.currencyandCountryList = res;
    });
    // this.foundersToolsService.getLocationList().subscribe((res: any) => {
    //   console.log(res);
    //   this.locationList = res;
    // });
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
      mode: 'market_analysis'
    }
    this.foundersToolsService.getChatgptRecommendations(data).subscribe({
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
    this.foundersToolsService.downloadRecommendation({ data: this.recommendationData }).subscribe({
      next: res => {
        window.open(res.url, "_blank");
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
  }

}
