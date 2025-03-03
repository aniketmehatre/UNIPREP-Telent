import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';
import { startupDropdownData } from './startup-expense.data';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';

interface selectList {
  name: string;
}
@Component({
  selector: 'uni-start-up-expense-estimate',
  templateUrl: './start-up-expense-estimate.component.html',
  styleUrls: ['./start-up-expense-estimate.component.scss']
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
  currenciesList: any;
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: string = '';
  departureFilter: string = '';
  locationsList: any = [];
  departureLocationList: any = [];
  constructor(
    private fb: FormBuilder,
    private foundersToolsService: FounderstoolService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private travelToolService: TravelToolsService,
    private pageFacade: PageFacadeService,
    private costOfLiving: CostOfLivingService
  ) {
    this.marketingForm = this.fb.group({
      industry: ['', Validators.required],
      location: ['', Validators.required],
      locationFilterString: [''],
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
    this.foundersToolsService.getCurrenciesList().subscribe((res: any) => {
      this.currenciesList = res;
    });
    this.costOfLiving.getCities().subscribe({
      next: response => {
        this.locationsList = response;
        this.departureLocationList = response;
      }
    })
  }

  customFilterFunction(type: string) {
    if (type === 'departure') {
      let locationFilterString = this.marketingForm.value.locationFilterString;
      if (locationFilterString === "") {
        this.departureLocationList = this.locationsList;
        return;
      }
      this.departureLocationList = this.locationsList.filter((city: any) =>
        city?.city_name?.toLowerCase().includes(locationFilterString.toLowerCase()) || city?.country_name?.toLowerCase().includes(locationFilterString.toLowerCase())
      );
    }
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
    const formValue = ['industry', 'location', 'startup_stage', 'team_size', 'current_investment', 'revenue_model', 'primary_expense', 'operating_expense', 'budget', 'expense_estimation'];
    const formData = this.marketingForm.value;
    let addingInput = `<p><strong>Input:<br></strong></p>`;

    // Keep track of which formValue index we're currently using
    let formValueIndex = 0;

    this.recommendations.forEach((category: any) => {
      addingInput += `<p><strong>${category.question.heading}</strong></p>`;

      category.question.branches.forEach((branchQuestion: any) => {
        addingInput += `<p>${branchQuestion}</p>`;

        let currentAnswer = "";
        const currentFormField = formValue[formValueIndex];

        if (formData && formData[currentFormField]) {
          switch (currentFormField) {
            case 'current_investment':
              currentAnswer = formData['investment_currency_code'] + ' ' + formData[currentFormField];
              break;
            case 'operating_expense':
              currentAnswer = formData['expense_currency_code'] + ' ' + formData[currentFormField];
              break;
            case 'budget':
              currentAnswer = formData['sales_currency_code'] + ' ' + formData[currentFormField];
              break;
            default:
              currentAnswer = formData[currentFormField];
              break;
          }
        } else {
          currentAnswer = "No answer provided";
        }

        addingInput += `<p><strong>${currentAnswer}</strong></p>`;

        formValueIndex++;
      });

      addingInput += `<br>`;
    });

    let finalRecommendation = addingInput + '<p><strong>Response:<br></strong></p>' + this.recommendationData;
    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Startup Expenses Estimate",
      file_name: "startup_expense_estimate"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
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
