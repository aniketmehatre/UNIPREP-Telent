import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-career-planner',
  templateUrl: './career-planner.component.html',
  styleUrls: ['./career-planner.component.scss']
})
export class CareerPlannerComponent implements OnInit {
  products:any = [
    {
      id: 1,
      question: "What is the highest level of study degree you have completed?",
      arrayName: "highLevelStudy",
      placeholder:"",
    },
    {
      id: 2,
      question: "What subject did you study?",
      arrayName: "subjects",
      placeholder:"Select your subject",
    },
    {
      id: 3,
      question: "What was your specialisation?",
      arrayName: "specilisation",
      placeholder:"Select your specialisation",
    },
    {
      id: 4,
      question: "Have you completed any internships?",
      arrayName: "YesOrNo",
      placeholder:"",
    },
    {
      id: 5,
      question: "What was the subject of your intership?",
      arrayName: "subjectOfInternship",
      placeholder:"Select your subject",
    },
    {
      id: 6,
      question: "Did you specialize in a particular area during your internship?",
      arrayName: "internshipSpecialization",
      placeholder:"Select your specialisation",
    },
    {
      id: 7,
      question: "Do you have work experience?",
      arrayName: "YesOrNo",
      placeholder:"",
    },
    {
      id: 8,
      question: "What field do you have work experience in?",
      arrayName: "fieldOfWrkExp",
      placeholder:"Select your subject",
    },
    {
      id: 9,
      question: "Did you specialise in a particular area during your work experience?",
      arrayName: "specilisationOfWrkExp",
      placeholder:"Select your field",
    },
  ];

  highLevelStudy:any = [
    {
      id: 1,
      value: "Masters",
    },
    {
      id: 2,
      value: "Bachelors",
    },
    {
      id: 3,
      value: "PG Diploma",
    },
    {
      id: 4,
      value: "Diploma",
    },
    {
      id: 5,
      value: "None in List",
    },
  ];

  YesOrNo:any = [
    {
      id: 1,
      value: "Yes",
    },{
      id: 2,
      value: "No",
    },
  ]
  
  selectedData: { [key: string]: any } = {};
  enableModule!: boolean;
  activePageIndex: number = 0;
  invalidClass: boolean = false;

  arrayMap: any = {
    'highLevelStudy': this.highLevelStudy,
    'YesOrNo': this.YesOrNo,
    // Add more arrays here as needed
  };
  currentArray:any = [];

  constructor() { }

  ngOnInit(): void {
    this.currentArray = this.highLevelStudy;
  }

  previous(productId: number): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--; // Decrement the active page index if it's not the first page
    }
  }

  next(productId: number): void {
    this.invalidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.products.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  getRecommendation(productId: number){

  }

  onClickRadioButton() {
    this.invalidClass = false;
    if (this.activePageIndex < this.products.length - 1) {
      this.activePageIndex++;
    }
  }
}
