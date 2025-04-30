import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
import { optionsGlobal } from './global-edufit.data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { removeExtraResponse } from "../../prompt"
@Component({
  selector: 'uni-global-edufit',
  templateUrl: './global-edufit.component.html',
  styleUrls: ['./global-edufit.component.scss'],
  standalone: true,
  imports: [CommonModule, SelectModule, RouterModule, DialogModule, CardModule, PaginatorModule, CarouselModule, ButtonModule, FormsModule, ReactiveFormsModule, SkeletonModule, SharedModule]
})
export class GlobalEdufitComponent implements OnInit {
  universityList: any = [];
  countryList: any = [];
  interestedCountryList: any = [];
  specializationList: any = [];
  degreeList: any = optionsGlobal.Degree;
  durationList: { name: string }[] = optionsGlobal.CourseDuration;
  // costEstimationList: { name: string }[] = optionsGlobal.;
  periodsList: { name: string }[] = optionsGlobal.Stayback;
  isFromSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  page = 1;
  pageSize = 25;
  first: number = 0;
  form: FormGroup = new FormGroup({});
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
  recommendationData: SafeHtml;
  isResponseSkeleton: boolean = false;
  aiCreditCount: number = 0;
  userInputs: any;

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
      home_country: ['', Validators.required],
      interested_country: ['', Validators.required],
      university: ['', Validators.required],
      specialization: ['', Validators.required],
      degree: ['', Validators.required],
      duration: ['', Validators.required],
      currency_code: ['', Validators.required],
      fees: ['', Validators.required],
      period: ['', Validators.required],
    });
    this.form.controls['university'].valueChanges.subscribe(value => {
      if (value) {
        this.getCourseNameList(value.id);
      }
    })
    this.form.controls['interested_country'].valueChanges.subscribe(value => {
      if (value) {
        this.setCompareUniversityList(value.id);
      }
    })
  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["Which country are you planning to study in?", "Which university are you considering?", "What Course are you interested in?"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Finance',
        branches: ["What is the tuition fee for the program?", "What is the estimated cost of living per year?", "What is the stay back period in the country?"]
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  ngOnInit(): void {
    this.getCurrenyandLocation();
    this.getAICreditCount();
  }
  getAICreditCount() {
    this.promptService.getAicredits().subscribe({
      next: resp => {
        this.aiCreditCount = resp;
      }
    })
  }
  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  getCurrenyandLocation() {
    // this.educationToolService.getCountryList().subscribe(data => {
    //   this.countryList = data;
    // });
    this.locationService.getHomeCountry(2).subscribe({
      next: response => {
        this.countryList = response;
      }
    });
    this.educationToolService.unifinderCountries().subscribe({
      next: response => {
        this.interestedCountryList = response;
      }
    });
    // this.educationToolService.getCurrentSpecializations().subscribe(data => {
    //   this.specializationList = data;
    // });
    this.educationToolService.getCurrencies().subscribe(data => {
      this.currencyandCountryList = data;
    });
  }


  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  getRecommendation() {
    this.submitted = false;
    const formData = this.form.value;
    if (!formData.fees || !formData.period || !formData.currency_code) {
      this.submitted = true;
      return;
    }
    // const isValidSixAmount = (value: any) => /^[0-9]{1,6}$/.test(value);
    // const isValidEightAmount = (value: any) => /^[0-9]{1,8}$/.test(value);
    const isValidEightAmount = (value: any) => {
      return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 99999999;
    };
    if (!isValidEightAmount(formData.fees)) {
      this.submitted = true;
      return;
    }
    if (this.aiCreditCount == 0) {
      this.toast.add({ severity: "error", summary: "Error", detail: "Free AI Credits Over.Please Buy Some Credits..!" });
      return;
    }
    let data: any = {
      ...this.form.value,
      university: formData.university.university_name,
      interested_country: formData.interested_country.country,
      mode: 'global_edufit'
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
      error: error => {
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
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.submitted = false;
    const formData = this.form.value;
    if (this.activePageIndex == 0) {
      if (!formData.interested_country || !formData.university || !formData.specialization) {
        this.submitted = true;
        return;
      }
    }
    // if (this.activePageIndex == 1) {
    //   if (!formData.specialization || !formData.duration) {
    //     this.submitted = true;
    //     return;
    //   }
    // }
    if (this.activePageIndex == 1) {
      if (!formData.fees || !formData.period) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    // if (!this.isFromSavedData) {
    this.educationToolService.getAnalysisList('global_edufit').subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = false;
        this.isRecommendationSavedData = true;
        this.recommadationSavedQuestionList = response.data;
        console.log(this.recommadationSavedQuestionList, "saved data");
      },
      error: error => {
      }
    });
    // }
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
      this.universityList = [];
    });
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let addingInput: string = '';
    const formValue = ['interested_country', 'university', 'specialization', 'fees', 'period'];
    // const formData = this.form.value;
    let formValueIndex = 0;
    this.recommendations.forEach((category: any) => {
      addingInput += `<p><strong>${category.question.heading}</strong></p>`;
      category.question.branches.forEach((branchQuestion: any) => {
        addingInput += `<p style="color: #3f4c83;"><strong>${branchQuestion}</strong></p>`;
        let currentAnswer = "";
        const currentFormField = formValue[formValueIndex];
        if (this.userInputs[currentFormField]) {
          if (currentFormField == 'fees') {
            currentAnswer = this.userInputs['currency_code'] + ' ' + this.userInputs[currentFormField];
          }
          else if (currentFormField == 'interested_country') {
            // currentAnswer = this.userInputs['interested_country']?.country
            currentAnswer = this.userInputs['interested_country']
          }
          else if (currentFormField == 'university') {
            // currentAnswer = this.userInputs['university']?.university_name
            currentAnswer = this.userInputs['university']
          }
          else {
            currentAnswer = this.userInputs[currentFormField];
          }
        } else {
          currentAnswer = "No answer provided";
        }
        addingInput += `<p>${currentAnswer}</p>`;
        formValueIndex++;
      });
      // Add spacing between categories
      addingInput += `<br>`;
    });
    let params: any = {
      module_name: "Global Edufit",
      file_name: "global_edufit",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }

  setCompareUniversityList(id: string) {
    this.educationToolService.getUniverstityByCountry(id).subscribe(data => {
      this.universityList = data
    })
  }

  getCourseNameList(universityId: number) {
    this.educationToolService.courseNameList(universityId).subscribe({
      next: response => {
        this.specializationList = response;
      }
    })
  }
}
