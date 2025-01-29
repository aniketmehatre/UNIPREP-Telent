import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { AllCountryRes,UniversityRes,CurrencyList } from 'src/app/@Models/education-tools.model';
import { Router } from '@angular/router';
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
  selectedData: any = {};
  notfilledArray: any = [];
  courseDurationList:{id: number, value: string}[] = [
    { id: 6,value: '6 Months'},
    { id: 12,value: '12 Months'},
    { id: 18,value: '18 Months'},
    { id: 24,value: '24 Months'},
    { id: 30,value: '30 Months'},
    { id: 36,value: '36 Months'},
    { id: 42,value: '42 Months'},
    { id: 48,value: '48 Months'},
    { id: 60,value: '60 Months'},
  ];

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

    let getStayBack = this.countriesList.find(item =>
      countryId === item.id
    )
    this.selectedData['stay_back'] = getStayBack?.stay_back;
  }

  next(productId: number): void {
    let fillables: any = [];
    this.notfilledArray = [];
    let isAllFieldsFields: boolean = true;
    if(productId === 1){
      fillables = ['country','university','course_duration','stay_back'];
    }else if(productId === 2){
      fillables = ['currency','tution','accommodation','travel_expense','food_and_grocery','miscellaneous'];
    }else if(productId === 3){
      fillables = ['education_loan','family_loan','monthly_payment','repayment_period'];
    }else if(productId === 3){
      fillables = ['part_time_income','full_time_income','other_income'];
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
    console.log(this.selectedData, "submited data");
  }

  goBack(){
    this.router.navigateByUrl('/pages/education-tools');
  }
}
