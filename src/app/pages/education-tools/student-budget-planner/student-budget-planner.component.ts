import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { AllCountryRes,UniversityRes,CurrencyList,SaveResponse,SavedReponseArray } from 'src/app/@Models/education-tools.model';
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

@Component({
    selector: 'uni-student-budget-planner',
    templateUrl: './student-budget-planner.component.html',
    styleUrls: ['./student-budget-planner.component.scss'],
    standalone: true,
    imports: [CommonModule,InputTextModule, InputGroupModule, InputGroupAddonModule, SelectModule, FormsModule, ReactiveFormsModule, ButtonModule, SkeletonModule, CarouselModule, PaginatorModule, FluidModule, DialogModule, MultiSelectModule, CardModule, RouterModule, TooltipModule, InputIconModule]
})
export class StudentBudgetPlannerComponent implements OnInit {

  constructor(
    private educationService: EducationToolsService, 
    private travelService: TravelToolsService, 
    private router: Router, 
    private toastr: MessageService,
    private sanitizer: DomSanitizer,
  ) { }
  recommendations: { id: number, question: string}[] = [
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
  isRecommendation:boolean = true;
  isResponsePage:boolean = false;
  isSavedResponse:boolean = false;
  isOldResponse:boolean = false;
  isSubmitted: boolean = false;
  responseBtnDisable: boolean = false;
  selectedCurrency: string = "";
  recommadationSavedQuestionList:SavedReponseArray[] = []; 
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
  selectedData: any = {...this.selectedDataArray}
  
  courseDurationList:{ value: string}[] = [
    { value: '6 Months'},
    { value: '12 Months'},
    { value: '18 Months'},
    { value: '24 Months'},
    { value: '30 Months'},
    { value: '36 Months'},
    { value: '42 Months'},
    { value: '48 Months'},
    { value: '54 Months'},
    { value: '60 Months'},
  ];

  stayBackList: any[] = [
    { value: 'Upto 6 Months'},
    { value: 'Upto 12 Months'},
    { value: 'Upto 18 Months'},
    { value: 'Upto 24 Months'},
    { value: 'Upto 30 Months'},
    { value: 'Upto 36 Months'},
    { value: 'Upto 42 Months'},
    { value: 'Upto 48 Months'},
    { value: 'Upto 54 Months'},
    { value: 'Upto 60 Months'},
  ]
  notfilledArray: string[] = [];

  ngOnInit(): void {
    this.dropdownValues();
  }
  dropdownValues(){
    this.educationService.getDropdownValues().subscribe({
      next: response =>{
        this.countriesList = response.country;
        this.allUniversityList = response.university;
      }
    });
  }

  onChangeCountry(){
    let countryId = this.selectedData['country'];
    this.universityList = this.allUniversityList.filter(item =>{
      return countryId === item.country_id
    })
    let getCurrencyName = this.countriesList.find(u => u.id === this.selectedData['country']);
    this.selectedCurrency = getCurrencyName?.currency || '';  // Default to empty string
  }

  next(productId: number): void {
    this.isSubmitted = true;
    let fillables: any = [];
    this.notfilledArray = [];
    let isAllFieldsFields: boolean = true;
    
    if(productId === 1){
      fillables = ['country','university','course_duration','stay_back'];
    }else if(productId === 2){
      fillables = ['tution','accommodation','travel_expense','food_and_grocery','miscellaneous'];
    }
    
    fillables.forEach((element:any) => {
      if(!this.selectedData[element] || this.selectedData[element] === ''){
        isAllFieldsFields = false;
        this.notfilledArray.push(element);
      }
    });
    
    if(isAllFieldsFields){
      this.activePageIndex++;
      this.isSubmitted = false;
      this.notfilledArray = [];
    }
  }

  previous(){
    this.activePageIndex--;
  }

  submit(){
    this.isOldResponse = true;
    Object.entries(this.selectedData).forEach(([key, value]) =>{
      if(key === 'country'){
        let countryName = this.getCountryName();
        this.selectedData['country'] = countryName;
      }
      // if(value === null){
      //   this.selectedData[key] = "none";
      // }
    });
    this.travelService.getChatgptRecommendations(this.selectedData).subscribe({
      next: response =>{
        this.isResponsePage = true;
        this.isRecommendation = false;
        this.isSavedResponse = false;
        this.isOldResponse = false;
        let chatGptResponse = response.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
      }
    })
  }

  getCountryName(){
    let getCountryName = this.countriesList.find(u => u.id === this.selectedData['country']);
    return getCountryName?.country; //returns only the country name
  }

  goBack(){
    this.router.navigateByUrl('/pages/education-tools');
  }

  saveResponse(){
    let params:SaveResponse = {
      country_name: this.selectedData['country'],
      university_name: this.selectedData['university'],
      response: this.recommendationData
    };
    this.educationService.saveResponse(params).subscribe({
      next: response => {
        if(response.status && response.status == true){
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

  listOfSavedResponse(){
    this.educationService.getSavedRes().subscribe({
      next: response =>{
        this.recommadationSavedQuestionList = response.data;
        this.isSavedResponse = true;
        this.isRecommendation = false;
        this.isResponsePage = false;
      }
    })
  }

  showRecommandationData(response: string){
    this.recommendationData = response;
    this.isSavedResponse = false;
    this.isRecommendation = false;
    this.isResponsePage = true;
    this.isOldResponse = true;
  }

  resetRecommendation(){
    this.universityList = [];
    this.isSavedResponse = false;
    this.isRecommendation = true;
    this.isResponsePage = false;
    this.isOldResponse = false;
    this.activePageIndex = 0;
    this.notfilledArray = [];
    this.selectedData = {...this.selectedDataArray}
  }

  downloadResponse(){ 
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Marketing Analysis</h2>
				</div></div><p><strong>Input:<br></strong></p>
    <p style="color: #d32f2f;"><strong>Country of Study</strong></p>
    <p>${this.selectedData.country}</strong></p><br>
    <p style="color: #d32f2f;"><strong>University</strong></p>
    <p>${this.selectedData.university}</strong></p><br>
    <p style="color: #d32f2f;"><strong>Course Duration</strong></p>
    <p>${this.selectedData.course_duration}</strong></p><br>
    <p style="color: #d32f2f;"><strong>StayBack</strong></p>
    <p>${this.selectedData.stay_back} Period</strong></p><br>
    <p style="color: #d32f2f;"><strong>Overall Net Tution</strong></p>
    <p>${this.selectedData.tution} in ${this.selectedCurrency}</p><br>
    <p style="color: #d32f2f;"><strong>Accommodation</strong></p>
    <p>${this.selectedData.accommodation} / Month in ${this.selectedCurrency}</p><br>
    <p style="color: #d32f2f;"><strong>Travel Expenses</strong></p>
    <p>${this.selectedData.travel_expense} / Month in ${this.selectedCurrency}</p><br>
    <p style="color: #d32f2f;"><strong>Food & Grocerries</strong></p>
    <p>${this.selectedData.food_and_grocery} / Month in ${this.selectedCurrency}</p><br>
    <p style="color: #d32f2f;"><strong>Miscellaneous</strong></p>
    <p>${this.selectedData.miscellaneous} / Month in ${this.selectedCurrency}</p><br>
    <div class="divider"></div>
    <p><strong>Response</strong></p><br> ${this.recommendationData}`;

    let finalRecommendation = addingInput
    .replace(/```html|```/g, '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
    .replace(/SafeValue must use \[property\]=binding:/g, '')
    .replace(/class="container"/g, 'style="line-height:1.9"'); //because if i add container the margin will increase so i removed the container now the spacing is proper.
    let paramsData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Student Budget Planner",
      file_name: "student_budget_planner"
    }
    this.travelService.convertHTMLtoPDF(paramsData).then(() =>{
      console.log('PDF Download Successfully.');
    }).catch(error => {
      console.error("PDF having some issue",error);
    });
  }
}
