import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { AllCountryRes,UniversityRes,CurrencyList,SaveResponse,SavedReponseArray } from 'src/app/@Models/education-tools.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'uni-student-budget-planner',
  templateUrl: './student-budget-planner.component.html',
  styleUrls: ['./student-budget-planner.component.scss']
})
export class StudentBudgetPlannerComponent implements OnInit {

  constructor(
    private educationService: EducationToolsService, 
    private travelService: TravelToolsService, 
    private router: Router, 
    private toastr: MessageService,
  ) { }
  recommendations: { id: number, question: string}[] = [
    {
      id: 1, question: 'Student Information'
    },
    {
      id: 2, question: 'Student Expenses'
    },
    {
      id: 3, question: 'Financials'
    },
    {
      id: 4, question: 'Project Income'
    }
  ];
  activePageIndex: number = 0;
  countriesList: AllCountryRes[] = [];
  allUniversityList: UniversityRes[] = [];
  currencyList: CurrencyList[] = [];
  universityList: any[] = [];
  recommendationData: string = "";
  isRecommendation:boolean = true;
  isResponsePage:boolean = false;
  isSavedResponse:boolean = false;
  isOldResponse:boolean = false;
  isSubmitted: boolean = false;
  responseBtnDisable: boolean = false;
  recommadationSavedQuestionList:SavedReponseArray[] = []; 
  selectedDataArray: any = {
    country: null,
    university: null,
    course_duration: null,
    stay_back: null,
    currency: '',
    tution: null,
    accommodation: null,
    travel_expense: null,
    food_and_grocery: null,
    miscellaneous: null,
    education_loan: null,
    family_loan: null,
    monthly_payment: null,
    repayment_period: null,
    part_time_income: null,
    full_time_income: null,
    other_income: null,
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

    this.travelService.getCurrencies().subscribe({
      next: response =>{
        this.currencyList = response;
      }
    })
  }

  onChangeCountry(){
    let countryId = this.selectedData['country'];
    this.universityList = this.allUniversityList.filter(item =>{
      return countryId === item.country_id
    })
  }

  next(productId: number): void {
    this.isSubmitted = true;
    let fillables: any = [];
    let isAllFieldsFields: boolean = true;
    if(productId === 1){
      fillables = ['country','university','course_duration','stay_back'];
    }else if(productId === 2){
      fillables = ['currency','tution','accommodation','travel_expense','food_and_grocery','miscellaneous'];
    }
    fillables.forEach((element:any) => {
      if(!this.selectedData[element]){
        isAllFieldsFields = false;
      }
    });
    if(isAllFieldsFields){
      this.activePageIndex++;
      this.isSubmitted = false;
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
      if(value === null){
        this.selectedData[key] = "none";
      }
    });
    this.travelService.getChatgptRecommendations(this.selectedData).subscribe({
      next: response =>{
        this.recommendationData = response.response;
        this.isResponsePage = true;
        this.isRecommendation = false;
        this.isSavedResponse = false;
        this.isOldResponse = false;
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
    this.selectedData = {...this.selectedDataArray}
  }

  downloadResponse(){
    let downloadString:string = "This is a paragraph with some text and emojis 😊🎉. Markdown processing with emojis works!";
    html2pdf()
    .from(downloadString)
    .set({
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .toPdf()
    .get('pdf')
    .then((pdf: any) => {
      pdf.internal.scaleFactor = 1; // Ensure scaling is correct
      pdf.setProperties({ title: 'Generated PDF' }); // Optional: Set PDF properties
    })
    .save();

  }
}
