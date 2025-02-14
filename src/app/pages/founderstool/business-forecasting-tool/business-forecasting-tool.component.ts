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
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { businessForeCastData } from './business-forcasting.data';
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
@Component({
    selector: 'uni-business-forecasting-tool',
    templateUrl: './business-forecasting-tool.component.html',
    styleUrls: ['./business-forecasting-tool.component.scss'],
    standalone: true,
    imports: [CommonModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class BusinessForecastingToolComponent implements OnInit {
  industryList: any[] = businessForeCastData.Industry;
  locationList: any;
  seasonsList: any[] = businessForeCastData.Seasons;
  factorsList = businessForeCastData['Revenue Drivers'];
  targetAudienceList = businessForeCastData['Target Audience'];
  assumptionsList = businessForeCastData['Growth Assumption'];
  durationList = businessForeCastData['Forecast period'];
  goalsList = businessForeCastData['Revenue goals'];
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
  currencyList: any;
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
        branches: ["What is your business type or industry?",
          "What are the key revenue drivers for your business?",
          "Does your business experience seasonality? If yes, please specify the peak seasons"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Marketing & Sales',
        branches: ["Who is your target audience?",
          "What are your growth assumptions?",
          "What are the current market trends affecting your industry?"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Analysis',
        branches: ["What is the desired forecast period for this revenue forecasting?",
          "What are your revenue goals for the forecast period?"]
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
    private pageFacade: PageFacadeService,
    private toast: MessageService
  ) {
    this.form = this.fb.group({
      industry: ['', Validators.required],
      seasons: [[]],
      factors: [[], Validators.required],
      target_audience: [[], Validators.required],
      assumptions: [[], Validators.required],
      forecast_peroid: ['', Validators.required],
      goals: [[], Validators.required],
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
    if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
    this.getForeCastingOptionLists();
    this.getCurrenyandLocation();
  }

  backtoMain() {
    this.router.navigateByUrl('/pages/founderstool');
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

  getCurrenyandLocation() {
    this.foundersToolsService.getCurrencyAndCountries().subscribe((res: any) => {
      this.currencyList = res;
    });
    this.foundersToolsService.getLocationList().subscribe((res: any) => {
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
    this.submitted = false;
    const formData = this.form.value;
    if (!formData.forecast_peroid || !formData.goals) {
      this.submitted = true;
      return;
    }
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    let data: any = {
      ...this.form.value,
      mode: 'revenue_forescasting_tool',
      seasonalfunctionality: this.isSessonEnable
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
      if (!formData.industry || (this.isSessonEnable && (!formData.seasons || formData.seasons.length == 0)) || (!formData.factors || formData.factors?.length == 0)) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if ((!formData.target_audience || formData.target_audience?.length == 0) || (!formData.assumptions || formData.assumptions?.length == 0)) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.forecast_peroid || !formData.goals) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.foundersToolsService.getAnalysisList('revenue_forescasting_tool').subscribe({
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

  isGoBackNavigation() {
    this.router.navigateByUrl('/pages/founderstool/founderstoollist')
  }

}
