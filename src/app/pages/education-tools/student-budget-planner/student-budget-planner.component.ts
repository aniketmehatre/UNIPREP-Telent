import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { AllCountryRes, UniversityRes, CurrencyList, SaveResponse, SavedReponseArray } from 'src/app/@Models/education-tools.model';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';

@Component({
  selector: 'uni-student-budget-planner',
  templateUrl: './student-budget-planner.component.html',
  styleUrls: ['./student-budget-planner.component.scss'],
  standalone: true,
  imports: [CommonModule, InputTextModule, InputGroupModule, InputGroupAddonModule, SelectModule, FormsModule, ReactiveFormsModule, ButtonModule, SkeletonModule, CarouselModule, PaginatorModule, FluidModule, DialogModule, MultiSelectModule, CardModule, RouterModule, TooltipModule, InputIconModule]
})
export class StudentBudgetPlannerComponent implements OnInit {

  constructor(
    private educationService: EducationToolsService,
    private travelService: TravelToolsService,
    private router: Router,
    private toastr: MessageService,
    private sanitizer: DomSanitizer,
    private promptService: PromptService
  ) { }
  recommendations: { id: number, question: string }[] = [
    {
      id: 1, question: 'Student Information'
    },
    {
      id: 2, question: 'Student Expenses'
    },
    // {
    //   id: 3, question: 'Financials'
    // },
    // {
    //   id: 4, question: 'Project Income'
    // }
  ];
  activePageIndex: number = 0;
  countriesList: AllCountryRes[] = [];
  allUniversityList: UniversityRes[] = [];
  currencyList: CurrencyList[] = [];
  universityList: any[] = [];
  recommendationData: SafeHtml;
  isRecommendation: boolean = true;
  isResponsePage: boolean = false;
  isSavedResponse: boolean = false;
  isOldResponse: boolean = false;
  isSubmitted: boolean = false;
  responseBtnDisable: boolean = false;
  selectedCurrency: string = "";
  recommadationSavedQuestionList: SavedReponseArray[] = [];
  selectedDataArray: any = {
    country: null,
    university: null,
    course_duration: null,
    stay_back: null,
    tution: null,
    accommodation: null,
    travel_expense: null,
    food_and_grocery: null,
    miscellaneous: null,
    // education_loan: null,
    // family_loan: null,
    // monthly_payment: null,
    // repayment_period: null,
    // part_time_income: null,
    // full_time_income: null,
    // other_income: null,
    mode: 'student_budget_planner',
  }
  selectedData: any = { ...this.selectedDataArray }

  courseDurationList: { value: string }[] = [
    { value: '6 Months' },
    { value: '12 Months' },
    { value: '18 Months' },
    { value: '24 Months' },
    { value: '30 Months' },
    { value: '36 Months' },
    { value: '42 Months' },
    { value: '48 Months' },
    { value: '54 Months' },
    { value: '60 Months' },
  ];

  stayBackList: any[] = [
    { value: 'Upto 6 Months' },
    { value: 'Upto 12 Months' },
    { value: 'Upto 18 Months' },
    { value: 'Upto 24 Months' },
    { value: 'Upto 30 Months' },
    { value: 'Upto 36 Months' },
    { value: 'Upto 42 Months' },
    { value: 'Upto 48 Months' },
    { value: 'Upto 54 Months' },
    { value: 'Upto 60 Months' },
  ]
  notfilledArray: string[] = [];

  ngOnInit(): void {
    this.dropdownValues();
  }
  dropdownValues() {
    this.educationService.getDropdownValues().subscribe({
      next: response => {
        this.countriesList = response.country;
        this.allUniversityList = response.university;
      }
    });
  }

  onChangeCountry() {
    let countryId = this.selectedData['country'];
    this.universityList = this.allUniversityList.filter(item => {
      return countryId === item.country_id
    })
    let getCurrencyName = this.countriesList.find(u => u.id === this.selectedData['country']);
    this.selectedCurrency = getCurrencyName?.currency || '';  // Default to empty string
    this.selectedData['countryName'] = getCurrencyName?.country;
  }

  next(productId: number): void {
    this.isSubmitted = true;
    let fillables: any = [];
    this.notfilledArray = [];
    let isAllFieldsFields: boolean = true;

    if (productId === 1) {
      fillables = ['country', 'university', 'course_duration', 'stay_back'];
    } else if (productId === 2) {
      fillables = ['tution', 'accommodation', 'travel_expense', 'food_and_grocery', 'miscellaneous'];
    }

    fillables.forEach((element: any) => {
      if (!this.selectedData[element] || this.selectedData[element] === '') {
        isAllFieldsFields = false;
        this.notfilledArray.push(element);
      }
    });

    if (isAllFieldsFields) {
      this.activePageIndex++;
      this.isSubmitted = false;
      this.notfilledArray = [];
    }
  }

  previous() {
    this.activePageIndex--;
  }

  submit() {
    this.isOldResponse = true;
    Object.entries(this.selectedData).forEach(([key, value]) => {
      if (key === 'country') {
        let countryName = this.getCountryName();
        this.selectedData['country'] = countryName;
      }
      // if(value === null){
      //   this.selectedData[key] = "none";
      // }
    });
    this.travelService.getChatgptRecommendations(this.selectedData).subscribe({
      next: response => {
        this.isResponsePage = true;
        this.isRecommendation = false;
        this.isSavedResponse = false;
        this.isOldResponse = false;
        this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response);
      }
    })
  }

  getCountryName() {
    let getCountryName = this.countriesList.find(u => u.id === this.selectedData['country']);
    return getCountryName?.country; //returns only the country name
  }

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  saveResponse() {
    let params: SaveResponse = {
      country_name: this.selectedData['country'],
      university_name: this.selectedData['university'],
      response: this.recommendationData
    };
    this.educationService.saveResponse(params).subscribe({
      next: response => {
        if (response.status && response.status == true) {
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: "Response Saved Successfully.",
          });
          this.responseBtnDisable = true;
        }
      }
    })
  }

  listOfSavedResponse() {
    this.educationService.getSavedRes().subscribe({
      next: response => {
        this.recommadationSavedQuestionList = response.data;
        this.isSavedResponse = true;
        this.isRecommendation = false;
        this.isResponsePage = false;
      }
    })
  }

  showRecommandationData(response: string) {
    this.recommendationData = response;
    this.isSavedResponse = false;
    this.isRecommendation = false;
    this.isResponsePage = true;
    this.isOldResponse = true;
  }

  resetRecommendation() {
    this.universityList = [];
    this.isSavedResponse = false;
    this.isRecommendation = true;
    this.isResponsePage = false;
    this.isOldResponse = false;
    this.activePageIndex = 0;
    this.notfilledArray = [];
    this.selectedData = { ...this.selectedDataArray }
  }

  downloadRecommadation() {
    let addingInput: string = `
      <p style="color: #3f4c83;"><strong>In which country do you plan to study?</strong></p>
      <p>${this.selectedData.countryName}</p><br>
      <p style="color: #3f4c83;"><strong>Which university will you be attending?</strong></p>
      <p>${this.selectedData.university}</p><br>
      <p style="color: #3f4c83;"><strong>What is the length of your course?</strong></p>
      <p>${this.selectedData.course_duration}</p><br>
      <p style="color: #3f4c83;"><strong>What is the duration of the post-study stay-back period?</strong></p>
      <p>${this.selectedData.stay_back}</p><br>
      <p style="color: #3f4c83;"><strong>What is the net tuition fee for your entire course?</strong></p>
      <p>${this.selectedData.tution} in ${this.selectedCurrency}</p><br>
      <p style="color: #3f4c83;"><strong>How much do you expect to spend on accommodation per month?</strong></p>
      <p>${this.selectedData.accommodation} / Month in ${this.selectedCurrency}</p><br>
      <p style="color: #3f4c83;"><strong>What are your estimated travel expenses per month?</strong></p>
      <p>${this.selectedData.travel_expense} / Month in ${this.selectedCurrency}</p><br>
      <p style="color: #3f4c83;"><strong>How much do you plan to spend on food and groceries each month?</strong></p>
      <p>${this.selectedData.food_and_grocery} / Month in ${this.selectedCurrency}</p><br>
      <p style="color: #3f4c83;"><strong>What are your anticipated miscellaneous expenses per month?</strong></p>
      <p>${this.selectedData.miscellaneous} / Month in ${this.selectedCurrency}</p><br>
    `;

    let params: any = {
      module_name: "Student Budget Planner",
      file_name: "student_budget_planner",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }
}
