import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { AllCountryRes,UniversityRes } from 'src/app/@Models/education-tools.model';
@Component({
  selector: 'uni-student-budget-planner',
  templateUrl: './student-budget-planner.component.html',
  styleUrls: ['./student-budget-planner.component.scss']
})
export class StudentBudgetPlannerComponent implements OnInit {

  constructor(private educationService: EducationToolsService) { }
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
  universityList: UniversityRes[] = [];
  selectedData: any[] = [];

  ngOnInit(): void {
    this.dropdownValues();
  }

  dropdownValues(){
    this.educationService.getDropdownValues().subscribe({
      next: response =>{
        this.countriesList = response.country;
        this.universityList = response.university;
        console.log(this.countriesList, "countries list");
        console.log(this.universityList, "universityList list");
      }
    });
  }
}
