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

import { startupDropdownData } from './startup-expense.data';
// interface selectList {
//   name: string;
// }
@Component({
    selector: 'uni-start-up-expense-estimate',
    templateUrl: './start-up-expense-estimate.component.html',
    styleUrls: ['./start-up-expense-estimate.component.scss'],
    standalone: true,
    imports: [CommonModule,  DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class StartUpExpenseEstimateComponent implements OnInit {
  locationList: any[];
  industryList: { Industry: string }[] = startupDropdownData.Industry;
  startupStageList: selectList[] = startupDropdownData['Startup Stage'];
  teamSizeList: selectList[] = startupDropdownData['Team Size'];
  primaryExpenseList: selectList[] = startupDropdownData['Key expenses'];
  revenueModelsList: selectList[] = startupDropdownData['Revenue Model'];
  captialInvestedList: selectList[] = startupDropdownData['Capital Investment'];
  expenseEstimation: selectList[] = startupDropdownData['Expense Estimation'];

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
  locationsList: any = [];
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
      expense_estimation: ['', Validators.required],
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
        branches: ["What is the industry of your business?", "Where is your startup located?", "At what phase is your startup currently?", "What is the current size of your team?"]
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
    this.foundersToolsService.getLocationList().subscribe((res: any) => {
      console.log(res);
      this.locationsList = res;
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
      if (!formData.budget || !formData.expense_estimation) {
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
    if (this.activePageIndex == 0) {
      if (!formData.industry || !formData.location || !formData.startup_stage || !formData.team_size) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.current_investment || (!formData.revenue_model || formData.revenue_model?.length == 0) || (!formData.primary_expense || formData.primary_expense?.length == 0) || !formData.operating_expense) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.budget || !formData.expense_estimation) {
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

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    this.foundersToolsService.downloadRecommendation({ data: this.recommendationData }).subscribe({
      next: res => {
        const a = document.createElement('a');
        a.href = res.url;
        a.download = 'recommendation.pdf'; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(res.url);
      },
      error: err => {
        console.log(err?.error?.message);
      }
    });
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
