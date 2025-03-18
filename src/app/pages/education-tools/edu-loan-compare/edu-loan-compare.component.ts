import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
import { eduLoanOptions, eduloanRecommendations, loanTensureMonths, moratoriumPeriods, repaymentYears } from './edu-loan-compare.data';
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
import { CommonType } from 'src/app/@Models/common-type';
import { InputNumberModule } from 'primeng/inputnumber';
import { Currencies } from 'src/app/@Models/currency.model';

@Component({
  selector: 'uni-edu-loan-compare',
  templateUrl: './edu-loan-compare.component.html',
  styleUrls: ['./edu-loan-compare.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule, InputNumberModule]
})
export class EduLoanCompareComponent implements OnInit {

  recommendations: { id: number, heading: string, questions: string[] }[] = eduloanRecommendations
  loanTensureMonthList: CommonType[] = loanTensureMonths;
  moratoriumPeriodList: CommonType[] = moratoriumPeriods;
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

  constructor(
    private fb: FormBuilder,
    private educationToolService: EducationToolsService,
    private toast: MessageService,
    private router: Router,
    private travelToolService: TravelToolsService
  ) {
    this.form = this.fb.group({
      currency: ['', Validators.required],
      loan_amount: [null, Validators.required],
      interest_rate: [null, Validators.required],
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
    this.submitted = false;
    const formData = this.form.value;
    if (this.activePageIndex == 0) {
      if (!formData.currency || !formData.loan_amount || !formData.interest_rate || !formData.loan_tenure) {
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
    let data: any = {
      ...this.form.value,
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
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.form.reset();
    this.activePageIndex = 0;
    this.isFromSavedData = false;
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

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

}
