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
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';

@Component({
  selector: 'uni-edu-loan-compare',
  templateUrl: './edu-loan-compare.component.html',
  styleUrls: ['./edu-loan-compare.component.scss']
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
      },
    },
    {
      id: 2,
      question: {
        heading: 'Loan Details',
      },
    },
    {
      id: 3,
      question: {
        heading: 'Addtional Details',
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
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
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
    let paramData: DownloadRespose = {
      response: this.recommendationData,
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
