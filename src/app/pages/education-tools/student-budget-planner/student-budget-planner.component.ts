import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { AllCountryRes,UniversityRes,CurrencyList } from 'src/app/@Models/education-tools.model';
import { Router } from '@angular/router';
import { log } from 'console';
@Component({
  selector: 'uni-student-budget-planner',
  templateUrl: './student-budget-planner.component.html',
  styleUrls: ['./student-budget-planner.component.scss']
})
export class StudentBudgetPlannerComponent implements OnInit {

  constructor(private educationService: EducationToolsService, private travelService: TravelToolsService, private router: Router) { }
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
  selectedData: any = {
    country: null,
    university: null,
    course_duration: null,
    stay_back: null,
    currency: null,
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
  };
  
  notfilledArray: any = [];
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
        console.log(response, "currency list");
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
    let fillables: any = [];
    this.notfilledArray = [];
    let isAllFieldsFields: boolean = true;
    if(productId === 1){
      fillables = ['country','university','course_duration','stay_back'];
    }else if(productId === 2){
      fillables = ['currency','tution','accommodation','travel_expense','food_and_grocery','miscellaneous'];
    }
    fillables.forEach((element:any) => {
      if(!this.selectedData[element]){
        this.notfilledArray.push(element);
        isAllFieldsFields = false;
      }
    });
    if(isAllFieldsFields){
      this.activePageIndex++;
    }
    console.log(this.notfilledArray, "not fillables");
  }

  previous(){
    this.activePageIndex--;
  }

  submit(){
    console.log(this.selectedData, "before selected data");
    Object.entries(this.selectedData).forEach(([key, value]) =>{
      if(value === null){
        this.selectedData[key] = "none";
      }
    });
    console.log(this.selectedData, "after selected data");

    this.travelService.getChatgptRecommendations(this.selectedData).subscribe({
      next: response =>{
        this.recommendationData = response.response;
        console.log(this.recommendationData)
        this.isResponsePage = true;
        this.isRecommendation = false;
      }
    })
  }

  goBack(){
    this.router.navigateByUrl('/pages/education-tools');
  }
}
