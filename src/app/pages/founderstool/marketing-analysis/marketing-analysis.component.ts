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
export interface selectList {
  name: string;
}
@Component({
  selector: 'uni-marketing-analysis',
  templateUrl: './marketing-analysis.component.html',
  styleUrls: ['./marketing-analysis.component.scss']
})
export class MarketingAnalysisComponent implements OnInit {
  locationList: any[] = [];
  targetMarketList: selectList[] = [];
  productServiceList: selectList[] = [];
  businessModelList: selectList[] = [];
  salesChannelsList: selectList[] = [];
  timeFramesList: selectList[] = [];
  revenueStreamsList: selectList[] = [];
  competitorList: selectList[] = [];
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
      currencycode: ['']
    });

  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["What is Your Industry", "Where are you located", "What is the Target Market", "Is your business a product/service"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Marketing & Sales',
        branches: ["What is Your Business Model?", "Where are you sales channel?", "Select the analysis time frame"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Finance',
        branches: ["What is your budget for marketing", "what are your revenue streams", "what is your competitor analysis focus?"]
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
    this.getMarketAnalysisLists();
    this.getCurrenyandCountry();
  }

  goBack() {
    this.router.navigateByUrl('/pages/founderstool');
  }

  getMarketAnalysisLists() {
    this.foundersToolsService.getmarketingAnaylsisOptionsList().subscribe((res: any) => {
      console.log(res);
      this.competitorList = res?.competitor;
      this.timeFramesList = res?.duration;
      this.targetMarketList = res?.market;
      this.businessModelList = res?.models;
      this.productServiceList = res?.productservice;
      this.revenueStreamsList = res?.revenuestreams;
      this.salesChannelsList = res?.saleschannel;
    });
  }

  getCurrenyandCountry() {
    this.foundersToolsService.getCurrencyAndCountries().subscribe((res: any) => {
      console.log(res);
      this.locationList = res;
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
      if (!formData.budget || !formData.revenueStreams || !formData.competitorAnalysis) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.foundersToolsService.getAnalysisList('marketing_analysis').subscribe({
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

}
