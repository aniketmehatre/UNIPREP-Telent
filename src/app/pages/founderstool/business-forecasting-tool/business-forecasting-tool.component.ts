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
  selector: 'uni-business-forecasting-tool',
  templateUrl: './business-forecasting-tool.component.html',
  styleUrls: ['./business-forecasting-tool.component.scss']
})
export class BusinessForecastingToolComponent implements OnInit {
  locationList: any[] = [];
  seasonsList: any[] = [{ name: 'Sample Seaons' }];
  factorsList: selectList[] = [{ name: 'Sample Seaons' }];
  targetAudienceList: selectList[] = [{ name: 'Sample Seaons' }];
  assumptionsList: selectList[] = [{ name: 'Sample Seaons' }];
  upComingMarketList: selectList[] = [{ name: 'Sample Seaons' }];
  durationList: selectList[] = [{ name: 'Sample Seaons' }];
  analyseList: selectList[] = [{ name: 'Sample Seaons' }];
  isFromSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  page = 1;
  pageSize = 25;
  first: number = 0;
  planExpired!: boolean;
  recommendRestrict: boolean = false;
  form: FormGroup = new FormGroup({});
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
  isSessonEnable: boolean = false;
  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["What is your industry?",
          "Does your business have seasonal functionalities?",
          "What are the seasons?",
          "What are the key factors influencing your revenue?"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Marketing & Sales',
        branches: ["Who are your target audience?",
          "What assumptions are you making about business growth?",
          "Are there any current or upcoming market trends affecting revenue?"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Analysis',
        branches: ["Revenue forecast timeframe",
          "What are your specific revenue targets for the forecast period?",
          "How much data do you have to analyze for your forecast?"]
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  constructor(
    private fb: FormBuilder,
    private foundersToolsService: FounderstoolService,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router,
    private pageFacade: PageFacadeService
  ) {
    this.form = this.fb.group({
      industry: ['', Validators.required],
      seasons: [[]],
      factors: [[], Validators.required],
      target_audience: [[], Validators.required],
      assumptions: [[], Validators.required],
      upcoming_market: ['', Validators.required],
      duration: ['', Validators.required],
      currency_code: ['', Validators.required],
      forecast_peroid: ['', Validators.required],
      analyse: [[], Validators.required],
    });

  }


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
    this.getForeCastingOptionLists();
    this.getCurrenyandCountry();
  }

  backtoMain() {
    this.router.navigateByUrl('/pages/founder-tools');
  }

  getForeCastingOptionLists() {
    this.foundersToolsService.getmarketingAnaylsisOptionsList().subscribe((res: any) => {
      // console.log(res);
      // this.seasonsList = res?.seasons;
      // this.factorsList = res?.competitor;
      // this.targetAudienceList = res?.market;
      // this.assumptionsList = res?.models;
      // this.upComingMarketList = res?.productservice;
      // this.durationList = res?.revenuestreams;
      // this.analyseList = res?.saleschannel;
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
      ...this.form.value,
      mode: 'business_forecasting_tool'
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
    const formData = this.form.value;
    console.log(formData)
    if (this.activePageIndex == 0) {
      if (!formData.industry || (!formData.seasons && this.isSessonEnable) || !formData.factors) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.target_audience || !formData.assumptions || !formData.upcoming_market) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.duration || !formData.forecast_peroid || !formData.analyse) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.foundersToolsService.getAnalysisList('business_forecasting_tool').subscribe({
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


  onEnableDisableSeason(isSeasonEnable: boolean) {
    console.log(this.form.controls?.['factors']); // Debugging line, ensure this is intentional
    this.isSessonEnable = isSeasonEnable;

    if (this.isSessonEnable) {
      this.form.controls?.['seasons'].addValidators(Validators.required);
      this.form.controls?.['seasons'].updateValueAndValidity();
    } else {
      this.form.controls?.['seasons'].clearValidators();
      this.form.controls?.['seasons'].updateValueAndValidity();
    }
  }



  resetRecommendation() {
    this.foundersToolsService.resetRecommendation().subscribe(res => {
      this.isRecommendationQuestion = true;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = false;
      this.form.reset();
      this.activePageIndex = 0;
      this.isFromSavedData = false;
    });
  }

}
