import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
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
import { uniCompareOptions } from './uni-compare.data';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { removeExtraResponse } from "../../prompt"
@Component({
  selector: 'uni-uni-compare',
  templateUrl: './uni-compare.component.html',
  styleUrls: ['./uni-compare.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule]
})
export class UniCompareComponent implements OnInit, OnDestroy {
  panelStyle: { width: string } = { width: '360px' };

  universityCountryList: any[];
  compareUniversityList: any[];
  universityList: any = [];
  specializationList: any = [];
  compareSpecializationList: any = [];
  stayBackAfterGraduations: { name: string }[] = uniCompareOptions.stayBack;
  allUniversityList: any[] = [];
  isFromSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  page = 1;
  pageSize = 25;
  first: number = 0;
  planExpired!: boolean;
  recommendRestrict: boolean = false;
  form: FormGroup = new FormGroup({});
  currentPlan: string = "";
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
  recommendationData: SafeHtml = '';
  isResponseSkeleton: boolean = false;
  aiCreditCount: number = 0;
  constructor(
    private fb: FormBuilder,
    private educationToolService: EducationToolsService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private sanitizer: DomSanitizer,
    private promptService: PromptService

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

    this.form.controls['country'].valueChanges.subscribe(value => {
      if (value) {
        this.getAndSetUniversity(value.id, "country");
      }
    })
    this.form.controls['compare_country'].valueChanges.subscribe(value => {
      if (value) {
        this.getAndSetUniversity(value.id, "compare_country");
      }
    })

    this.form.controls['university'].valueChanges.subscribe(value => {
      if (value) {
        this.getAndSetCourseNameList(value.id, "university");
      }
    })
    this.form.controls['compare_university'].valueChanges.subscribe(value => {
      if (value) {
        this.getAndSetCourseNameList(value.id, "compare_university");
      }
    })
  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'University Details',
        branches: ['Which country are you planning to study in?', 'Which university are you applying to?', 'What is your chosen specialization or field of study?']
      },
    },
    {
      id: 2,
      question: {
        heading: 'Addtional Details',
        branches: ['What is the overall tuition fees per year for the selected course?', 'What is your expected annual living expense?', 'How many months of stayback are allowed after graduation?']
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  userInputs: any;

  ngOnInit(): void {
    this.updatePanelStyle();
    window.addEventListener('resize', this.updatePanelStyle);

    this.getCountryandSpecilizationList();
    this.getAICreditCount();
  }
  getAICreditCount() {
    this.promptService.getAicredits().subscribe({
      next: resp => {
        this.aiCreditCount = resp;
      }
    })
  }
  getAndSetCourseNameList(universityId: number, mode: string) {
    this.educationToolService.courseNameList(universityId).subscribe({
      next: response => {
        if (mode == "university") {
          this.specializationList = response;
        } else if (mode == "compare_university") {
          this.compareSpecializationList = response;
        }

      }
    })
  }

  getAndSetUniversity(id: string, mode: string) {
    this.educationToolService.getUniverstityByCountry(id).subscribe(data => {
      if (mode == "country") {
        this.universityList = data;
      } else if (mode == "compare_country") {
        this.compareUniversityList = data;
      }
    })
  }

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  getCountryandSpecilizationList() {
    // this.educationToolService.getCourseListBoxDropdown().subscribe(data => {
    //   this.universityCountryList = data?.country;
    //   this.allUniversityList = data?.university_name;
    //   this.specializationList = data?.subject;
    // });
    // this.educationToolService.getCurrentSpecializations().subscribe(data => {
    //   this.specializationList = data;
    // });
    this.educationToolService.unifinderCountries().subscribe({
      next: response => {
        this.universityCountryList = response;
      }
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

  getRecommendation() {
    this.submitted = false;
    const formData = this.form.value;
    if (this.activePageIndex == 1) {
      if (!formData.fees || !formData.compare_fees || !formData.expense || !formData.compare_expenses || !formData.compare_period || !formData.period) {
        this.submitted = true;
        return;
      }
      const isValidAmount = (value: any) => /^[0-9]{1,8}$/.test(value);
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
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (this.aiCreditCount == 0) {
      this.toast.add({ severity: "error", summary: "Error", detail: "Free AI Credits Over.Please Buy Some Credits..!" });
      return;
    }
    let data: any = {
      ...this.form.value,
      mode: 'uni_compare',
      compare_currency_code: this.form.get('compare_currency_code')?.value,
      expense_currency_code: this.form.get('expense_currency_code')?.value,
      compare_expense_currency_code: this.form.get('compare_expense_currency_code')?.value,
      country: formData.country.country,
      compare_country: formData.compare_country.country,
      university: formData.university.university_name,
      compare_university: formData.compare_university.university_name,
    }
    this.userInputs = data;
    this.isRecommendationQuestion = false;
    this.isRecommendationSavedData = false;
    this.isRecommendationData = true;
    this.isResponseSkeleton = true;
    this.educationToolService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isResponseSkeleton = false;
        this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response);
        this.getAICreditCount();
      },
      error: (error) => {
        console.error(error);
        this.isResponseSkeleton = false;
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


  showRecommandationData(data: string, userInputs: any) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    // this.recommendationData = data;
    this.recommendationData = removeExtraResponse(data);
    const encodedJson = userInputs;
    const decodedInput = JSON.parse(encodedJson);
    this.userInputs = decodedInput;
  }

  resetRecommendation() {
    this.educationToolService.resetRecommendation().subscribe(res => {
      this.isRecommendationQuestion = true;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = false;
      this.form.reset();
      this.activePageIndex = 0;
      this.isFromSavedData = false;
      this.specializationList = [];
      this.compareSpecializationList = [];
      this.universityList = [];
      this.compareUniversityList = [];
    });
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let addingInput: string = '';
    const formValue = ['country', 'university', 'specialization', 'fees', 'expense', 'period'];
    // const formData = this.form.value;
    // formData['country'] = formData['country'].country;
    // formData['compare_country'] = formData['compare_country'].country;
    // formData['university'] = formData['university'].university_name;
    // formData['compare_university'] = formData['compare_university'].university_name;

    let formValueIndex = 0;
    this.recommendations.forEach((category: any) => {
      addingInput += `<p><strong>${category.question.heading}</strong></p>`;
      category.question.branches.forEach((branchQuestion: any) => {
        addingInput += `<p style="color: #3f4c83;"><strong>${branchQuestion}</strong></p>`;
        let currentAnswer = "";
        const currentFormField = formValue[formValueIndex];
        if (this.userInputs[currentFormField]) {
          switch (currentFormField) {
            case 'fees':
              currentAnswer = `1. ${this.userInputs['currency_code']} ${this.userInputs[currentFormField]}   2. ${this.userInputs['compare_currency_code']} ${this.userInputs['compare_' + currentFormField]}`;
              break;
            case 'expense':
              currentAnswer = `1. ${this.userInputs['currency_code']} ${this.userInputs[currentFormField]}   2. ${this.userInputs['currency_code']} ${this.userInputs['compare_expenses']}`;
              break;
            default:
              currentAnswer = `1. ${this.userInputs[currentFormField]}   2. ${this.userInputs['compare_' + currentFormField]} `;
              break;
          }
        } else {
          currentAnswer = "No answer provided";
        }
        addingInput += `<p>${currentAnswer}</p><br>`;
        formValueIndex++;
      });
      // Add spacing between categories
      addingInput += `<br>`;
    });
    let params: any = {
      module_name: "Uni Compare",
      file_name: "uni_compare",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }

  updatePanelStyle = () => {
    this.panelStyle = window.innerWidth > 990 ? { width: '370px' } : { width: '100%' };
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.updatePanelStyle);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
