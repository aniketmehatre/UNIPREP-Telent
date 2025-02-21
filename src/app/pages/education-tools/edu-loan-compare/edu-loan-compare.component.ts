import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
import { eduLoanOptions } from './edu-loan-compare.data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
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
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';

@Component({
  selector: 'uni-edu-loan-compare',
  templateUrl: './edu-loan-compare.component.html',
  styleUrls: ['./edu-loan-compare.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class EduLoanCompareComponent implements OnInit, OnDestroy {
  panelStyle: { width: string } = { width: '370px' };

  bankNameList: any[] = eduLoanOptions?.banknames;
  interestedRateTypeList: string[] = eduLoanOptions['Interest Rate Type'];
  intersetedRateList: string[] = eduLoanOptions['Interest Rate'];
  studyDurationList: string[] = eduLoanOptions['Study Duration in months'];
  moratoriumPeriodList: string[] = eduLoanOptions['Moratorium Period: Repayment Start'];
  repaymentLoanList: string[] = eduLoanOptions['Repayment Start'];
  intersetedTermList = eduLoanOptions['Study Duration in months'];

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
  currencyandCountryList: any;
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: string = '';
  constructor(
    private fb: FormBuilder,
    private educationToolService: EducationToolsService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private pageFacade: PageFacadeService,
    private travelToolService: TravelToolsService
  ) {
    this.form = this.fb.group({
      bankname: ['', Validators.required],
      compare_bankname: ['', Validators.required],
      currency: ['', Validators.required],
      compare_currency: ['', Validators.required],
      loanamount: ['', Validators.required],
      compare_loanamount: [''],
      location: ['', Validators.required],
      compare_location: ['', Validators.required],
      interestrate_type: ['', Validators.required],
      compare_interestrate_type: [''],
      interestrate: [''],
      compare_interestrate: ['', Validators.required],
      interestterm: ['', Validators.required],
      compare_interestterm: ['', Validators.required],
      studyduration: ['', Validators.required],
      compare_studyduration: ['', Validators.required],
      moratoriumperiod: ['', Validators.required],
      compare_moratoriumperiod: ['', Validators.required],
      loanrepaymentperiod: ['', Validators.required],
      compare_loanrepaymentperiod: ['', Validators.required],
    });
    this.form.get('compare_currency')?.disable();
  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Bank Information',
        branches: ['What is the name of the loan provider?', 'What is the total loan amount you are considering from this provider?', 'In which country will you be studying?']
      },
    },
    {
      id: 2,
      question: {
        heading: 'Loan Details',
        branches: ['What type of interest rate does this loan have?', 'What is the interest rate for this loan?', 'What is the duration of your study period for which the loan will cover expenses?']
      },
    },
    {
      id: 3,
      question: {
        heading: 'Addtional Details',
        branches: ['Study Duration', 'What is the moratorium period ?', 'When does the repayment start?']
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  ngOnInit(): void {
    this.updatePanelStyle();
    window.addEventListener('resize', this.updatePanelStyle);
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
    this.getCountryList();
  }

  updatePanelStyle = () => {
    this.panelStyle = window.innerWidth > 982 ? { width: '370px' } : { width: '100%' };
  };

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  getCountryList() {
    this.educationToolService.getCurrencyAndCountries().subscribe(data => {
      this.currencyandCountryList = data;
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


  getRecommendation() {
    this.submitted = false;
    const formData = this.form.value;
    console.log(formData);
    if (this.activePageIndex == 2) {
      if (!formData.studyduration || !formData.compare_studyduration || !formData.moratoriumperiod || !formData.compare_moratoriumperiod || !formData.loanrepaymentperiod || !formData.compare_loanrepaymentperiod) {
        this.submitted = true;
        return;
      }
    }
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    let data: any = {
      ...this.form.value,
      compare_currency: this.form?.value?.currency,
      mode: 'loan_comparison_tool'
    }
    this.educationToolService.getChatgptRecommendations(data).subscribe({
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
    if (this.activePageIndex == 0) {
      if (!formData.bankname || !formData.compare_bankname || !formData.loanamount || !formData.location || !formData.compare_location) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.interestrate_type || !formData.compare_interestrate_type || !formData.interestrate || !formData.compare_interestrate || !formData.interestterm || !formData.compare_interestterm) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.educationToolService.getAnalysisList('loan_comparison_tool').subscribe({
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
    this.educationToolService.resetRecommendation().subscribe(res => {
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
    const formValue = ['bankname', 'loanamount', 'location', 'interestrate_type', 'interestrate', 'interestterm', 'studyduration', 'moratoriumperiod', 'loanrepaymentperiod'];
    const formData = this.form.value;
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
            case 'loanamount':
              currentAnswer = `1. ${formData['currency']} ${formData[currentFormField]}   2. ${formData['currency']} ${formData['compare_' + currentFormField]}`;
              break;
            case 'interestterm':
              currentAnswer = `1. ${formData[currentFormField]} Months   2. ${formData['compare_' + currentFormField]} Months `;
              break;
            case 'studyduration':
              currentAnswer = `1. ${formData[currentFormField]} Months   2. ${formData['compare_' + currentFormField]} Months `;
              break;
            default:
              currentAnswer = `1. ${formData[currentFormField]}   2. ${formData['compare_' + currentFormField]} `;
              break;
          }
        } else {
          currentAnswer = "No answer provided";
        }

        addingInput += `<p><strong>${currentAnswer}</strong></p>`;

        formValueIndex++;
      });

      // Add spacing between categories
      addingInput += `<br>`;
    });

    let finalRecommendation = addingInput + '<p><strong>Response:<br></strong></p>' + this.recommendationData;
    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Edu Loan Comparison",
      file_name: "edu_loan_comparison"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updatePanelStyle);
  }

}
