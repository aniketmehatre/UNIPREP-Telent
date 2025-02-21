import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { FounderstoolService } from '../../founderstool/founderstool.service';
import { startupDropdownData } from '../../founderstool/start-up-expense-estimate/startup-expense.data';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
import { uniCompareOptions } from './uni-compare.data';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';

@Component({
  selector: 'uni-uni-compare',
  templateUrl: './uni-compare.component.html',
  styleUrls: ['./uni-compare.component.scss']
})
export class UniCompareComponent implements OnInit, OnDestroy {
  panelStyle: { width: string } = { width: '360px' };

  universityCountryList: any[];
  compareUniversityList: any[];
  universityList: any = [];
  specializationList: any = [];
  stayBackAfterGraduations: { name: string }[] = uniCompareOptions.stayBack;

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
  countriesList: any;
  currenciesList: any;
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
      country: ['', Validators.required],
      compare_country: ['', Validators.required],
      university: ['', Validators.required],
      compare_university: ['', Validators.required],
      specialization: ['', Validators.required],
      compare_specialization: ['', Validators.required],
      fees: ['', Validators.required],
      currency_code: [''],
      compare_currency_code: [''],
      compare_fees: ['', Validators.required],
      expense_currency_code: [''],
      compare_expense_currency_code: [''],
      expense: ['', Validators.required],
      compare_expenses: ['', Validators.required],
      period: ['', Validators.required],
      compare_period: ['', Validators.required],
    });
    // this.form.get('compare_currency_code')?.disable();
    this.form.get('expense_currency_code')?.disable();
    this.form.get('compare_expense_currency_code')?.disable();  
  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'University Details',
        branches: ['Which country are you planning to study in', 'Which university are you applying to?', 'What is your chosen specialization or field of study?']
      },
    },
    {
      id: 2,
      question: {
        heading: 'Addtional Details',
        branches: ['What is the Overall tuition fee per year for your program?', 'What is your expected annual living expense?', 'How many months of stayback are allowed after graduation?']
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
    this.getCountryandSpecilizationList();
  }

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  getCountryandSpecilizationList() {
    this.educationToolService.getCountryList().subscribe(data => {
      this.universityCountryList = data;
    });
    this.educationToolService.getCurrentSpecializations().subscribe(data => {
      this.specializationList = data;
    });
    this.educationToolService.getCurrencies().subscribe(data => {
      this.currenciesList = data;
    });
  }

  changeCurrencyInTution(value: string) {
    this.form.patchValue({
      compare_currency_code: value,
      expense_currency_code: value,
      compare_expense_currency_code: value
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
    if (this.activePageIndex == 1) {
      if (!formData.fees || !formData.compare_fees || !formData.expense || !formData.compare_expenses || !formData.compare_period || !formData.period) {
        this.submitted = true;
        return;
      }
      const isValidAmount = (value: any) => /^[0-9]{1,6}$/.test(value);
      if (
        !isValidAmount(formData.fees) ||
        !isValidAmount(formData.compare_fees) ||
        !isValidAmount(formData.expense) ||
        !isValidAmount(formData.compare_expenses)
      ) {
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
      mode: 'uni_compare',
      compare_currency_code: this.form.get('compare_currency_code')?.value,
      expense_currency_code: this.form.get('expense_currency_code')?.value,
      compare_expense_currency_code: this.form.get('compare_expense_currency_code')?.value
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
      if (!formData.country || !formData.compare_country || !formData.university || !formData.compare_university || !formData.specialization || !formData.compare_specialization) {
        this.submitted = true;
        console.log(this.activePageIndex)
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.fees || !formData.compare_fees || !formData.expense || !formData.compare_expenses || !formData.compare_period || !formData.period) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.educationToolService.getAnalysisList('uni_compare').subscribe({
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

  setUniversityList(id: string) {
    this.educationToolService.getUniverstityByCountry(id).subscribe(data => {
      this.universityList = data;
    })
  }

  setCompareUniversityList(id: string) {
    this.educationToolService.getUniverstityByCountry(id).subscribe(data => {
      this.compareUniversityList = data;
    })
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    const formValue = ['country', 'university', 'specialization', 'fees', 'expense', 'period'];
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
            case 'fees':
              currentAnswer = `1. ${formData['currency_code']} ${formData[currentFormField]}   2. ${formData['compare_currency_code']} ${formData['compare_' + currentFormField]}`;
              break;
            case 'expense':
              currentAnswer = `1. ${formData['currency_code']} ${formData[currentFormField]}   2. ${formData['currency_code']} ${formData['compare_expenses']}`;
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
      module_name: "Uni Compare",
      file_name: "uni_compare"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  } 

  updatePanelStyle = () => {
    this.panelStyle = window.innerWidth > 990 ? { width: '370px' } : { width: '100%' };
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.updatePanelStyle);
  }


}
