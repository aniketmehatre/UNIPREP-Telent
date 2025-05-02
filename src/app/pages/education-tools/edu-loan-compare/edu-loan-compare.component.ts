import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EducationToolsService } from '../education-tools.service';
import { eduloanRecommendations, loanTensureMonths, moratoriumPeriods, repaymentYears, courseDuration } from './edu-loan-compare.data';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api'
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
import { PageFacadeService } from '../../page-facade.service';
import { CommonType } from 'src/app/@Models/common-type';
import { InputNumberModule } from 'primeng/inputnumber';
import { Currencies } from 'src/app/@Models/currency.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from 'src/app/Auth/auth.service';
import { removeExtraResponse } from '../../prompt';

@Component({
  selector: 'uni-edu-loan-compare',
  templateUrl: './edu-loan-compare.component.html',
  styleUrls: ['./edu-loan-compare.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule, InputNumberModule, SkeletonModule, SharedModule]
})
export class EduLoanCompareComponent implements OnInit {

  recommendations: { id: number, heading: string, questions: string[] }[] = eduloanRecommendations
  loanTensureMonthList: CommonType[] = loanTensureMonths;
  moratoriumPeriodList: CommonType[] = moratoriumPeriods;
  courseDurationList: CommonType[] = courseDuration;
  repaymentYearList: CommonType[] = repaymentYears;
  isFromSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  form: FormGroup = new FormGroup({});
  submitted: boolean = false;
  currenciesList: Currencies[] = [];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: string = '';
  activePageIndex: number = 0;
  isResponseSkeleton: boolean = false;
  
  userInputs: any;

  constructor(
    private fb: FormBuilder,
    private educationToolService: EducationToolsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private promptService: PromptService,
    private pageFacade: PageFacadeService,
    private toast: MessageService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      currency: ['', Validators.required],
      loan_amount: [null, Validators.required],
      interest_rate: [null, Validators.required],
      course_duration: ['', Validators.required],
      loan_tenure: ['', Validators.required],
      moratorium_period: ['', Validators.required],
      repayment_year: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCountryList();
    
  }

  getCountryList() {
    this.educationToolService.getCurrencies().subscribe(data => {
      this.currenciesList = data;
    });
  }

  previous(): void {
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
      if (!formData.currency || !formData.loan_amount || !formData.interest_rate || !formData.loan_tenure || !formData.course_duration) {
        this.submitted = true;
        return;
      }
      this.activePageIndex++;
    }
    else {
      if (!formData.moratorium_period || !formData.repayment_year) {
        this.submitted = true;
        return;
      }
      this.getRecommendation();
    }
  }

  getRecommendation() {
    this.recommendationData = "";
    let data: any = {
      ...this.form.value,
      mode: 'loan_comparison_tool'
    }
    this.userInputs = data;
    this.isRecommendationQuestion = false;
    this.isRecommendationSavedData = false;
    this.isRecommendationData = true;
    this.isResponseSkeleton = true;
    this.educationToolService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isResponseSkeleton = false;
        this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response) as string;
        this.authService.aiCreditCount$.next(true);
        this.isFromSavedData = false;
        this.saveRecommadation('getAllHistory');
        
      },
      error: error => {
        this.isResponseSkeleton = false;
        this.isRecommendationData = false;
      }
    });
  }

  saveRecommadation(type?: string) {
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (!this.isFromSavedData) {
      this.educationToolService.getAnalysisList('loan_comparison_tool').subscribe({
        next: response => {
          if (!type) {
            this.isRecommendationQuestion = false;
            this.isRecommendationData = false;
            this.isRecommendationSavedData = true;
          }
          this.recommadationSavedQuestionList = response.data;
          this.isFromSavedData = true;
        },
        error: error => {
        }
      });
    }
    else {
      this.isRecommendationQuestion = false;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = true;
    }
  }

  showRecommandationData(data: string, userInputs: any) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    // this.recommendationData = data;
    this.recommendationData = removeExtraResponse(data);

    const encodedJson = userInputs;
    const decodedInput = JSON.parse(encodedJson);
    this.userInputs = decodedInput;
  }

  resetRecommendation() {
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.form.reset();
    this.activePageIndex = 0;
  }

  downloadRecommadation() {
    // const formData = this.form.value;
    let addingInput: string = '';
    this.recommendations.forEach(({ id, questions }) => {
      questions.forEach((question, index) => {
        addingInput += `<p style="color: #3f4c83;"><strong>${question}</strong></p>`;
        const answersMap: any = {
          1: [this.userInputs.currency + ' ' + this.userInputs.loan_amount, this.userInputs.interest_rate + ' %', this.userInputs.loan_tenure, this.userInputs.course_duration],
          2: [this.userInputs.moratorium_period, this.userInputs.repayment_year]
        };
        addingInput += `<p>${answersMap[id]?.[index] || ''}</p><br>`;
      });
    });
    let params: any = {
      module_name: "EDULOAN Repayment Advisor",
      file_name: "eduloan_repayment_advisor",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }

  goBack() {
    if (this.isRecommendationQuestion) {
      this.router.navigateByUrl('/pages/education-tools');
    }
    else {
      this.resetRecommendation();
    }
  }

  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
