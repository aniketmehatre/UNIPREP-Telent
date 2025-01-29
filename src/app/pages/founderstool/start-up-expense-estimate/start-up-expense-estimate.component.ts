import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';
import { selectList } from '../marketing-analysis/marketing-analysis.component';

@Component({
  selector: 'uni-start-up-expense-estimate',
  templateUrl: './start-up-expense-estimate.component.html',
  styleUrls: ['./start-up-expense-estimate.component.scss']
})
export class StartUpExpenseEstimateComponent implements OnInit {
  locationList: any[] = [{ name: 'India' }];
  startupStageList: selectList[] = [{ name: 'Early Stage' }];
  teamSizeList: selectList[] = [{ name: 'Big' }];
  primaryExpenseList: selectList[] = [{ name: 'intial' }];
  revenueStreamsList: selectList[] = [{ name: 'streams' }];
  durationList: selectList[] = [{ name: 'streams' }];
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
      startup_stage: ['', Validators.required],
      team_size: ['', Validators.required],
      primary_expense: ['', Validators.required],
      current_investment: ['', Validators.required],
      revenue_model: ['', Validators.required],
      operating_expense: ['', Validators.required],
      budget: ['', Validators.required],
      duration: ['', Validators.required],
      investment_currency_code: [],
      expense_currency_code: [],
      sales_currency_code: []
    });

  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["What industry is your startup in?", "At what phase is your startup currently?", "Where is your startup located?", "What is the current size of your team?"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Expense',
        branches: ["What are the key expense categories for your startup?", "How much capital have you invested in the startup so far?", "What is your revenue model ?", "What are your monthly operating expenses?"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Analysis',
        branches: ["How much is allocated to the sales and marketing budget each month?", "Over what period would you like the expense estimation to be calculated?"]
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
    // this.getMarketAnalysisLists();
    this.getCurrenyandCountry();
  }

  goBack() {
    this.router.navigateByUrl('/pages/founderstool/founderstoollist');
  }

  getMarketAnalysisLists() {
    // this.foundersToolsService.getmarketingAnaylsisOptionsList().subscribe((res: any) => {
    //   console.log(res);
    //   this.competitorList = res?.competitor;
    //   this.timeFramesList = res?.duration;
    //   this.targetMarketList = res?.market;
    //   this.businessModelList = res?.models;
    //   this.productServiceList = res?.productservice;
    //   this.revenueStreamsList = res?.revenuestreams;
    //   this.salesChannelsList = res?.saleschannel;
    // });
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
      mode: 'startup_expense_estimator'
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
      if (!formData.industry || !formData.location || !formData.startup_stage || !formData.team_size) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.current_investment || !formData.revenue_model || !formData.primary_expense || !formData.operating_expense) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.budget || !formData.duration) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.foundersToolsService.getAnalysisList('startup_expense_estimator').subscribe({
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
