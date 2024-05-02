import { Component, OnInit } from '@angular/core';
import { CareerPlannerService } from './career-planner.service';
interface Specialisation {
  id: number;
  subject_id: number;
  specialisation_name: string;
}
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
      arrayName: "subjects",
      placeholder:"Select your subject",
    },
    {
      id: 6,
      question: "Did you specialize in a particular area during your internship?",
      arrayName: "internshipSpecilisation",
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
      arrayName: "subjects",
      placeholder:"Select your subject",
    },
    {
      id: 9,
      question: "Did you specialise in a particular area during your work experience?",
      arrayName: "wrkExpSpecilisation",
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
  ];
  
  selectedData: { [key: string]: any } = {};
  enableModule!: boolean;
  activePageIndex: number = 0;
  invalidClass: boolean = false;
  specilisation:any = [];
  nxtOrRecommendBtn:boolean = false;
  careerListData:any[] = [];
  jobSiteData:any[] = [];

  arrayMap: any = {
    'highLevelStudy': this.highLevelStudy,
    'YesOrNo': this.YesOrNo,
    'subjects': [],
    'specilisation': [],
    'internshipSpecilisation': [],
    'wrkExpSpecilisation': [],
  };

  constructor(private careerPlannerService:CareerPlannerService) { }

  ngOnInit(): void {
    this.checkCareerPlanExist();
    
  }

  checkCareerPlanExist(){
    this.careerPlannerService.checkCareerPlanExist().subscribe((res)=>{
      console.log(res);
      if(res == "Exist"){
        this.enableModule = true;
        this.listPageDataLoading();
      }else{
        this.selectboxValueLoading();
      }
    })
  }

  selectboxValueLoading(){
    this.careerPlannerService.loadSelectBoxValues().subscribe((responce)=>{
      this.arrayMap.subjects = responce.subject;
      this.specilisation = responce.specilisation;
      console.log(this.arrayMap);
    })
  }

  listPageDataLoading(){
    this.careerPlannerService.loadListPageData().subscribe((res)=>{
      console.log(res);
      this.careerListData = res.career_data;
      this.jobSiteData = res.job_site;
    });
  }

  previous(productId: number): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      if(productId == 7 && this.selectedData[4] == 2){
        this.activePageIndex = 3;
      }else{
        this.activePageIndex--; // Decrement the active page index if it's not the first page
      }
    }
  }

  next(productId: number): void {
    this.invalidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.products.length - 1) {
        if(productId === 4 || productId === 7){
          if(this.selectedData[productId] == 2){
            if(productId === 4){
              // if the product id 8 and 9 is already choose so the values are stored. again i go to give the product id value is 4 the values are still exist in the array so i removed
              const entries = Object.entries(this.selectedData);
              const filteredEntries = entries.filter(([key, _]) => key !== '5' && key !== '6');
              this.selectedData = Object.fromEntries(filteredEntries);
            }
            this.activePageIndex += 3;
          }else{
            this.activePageIndex++;
          }
        }else{
          this.activePageIndex++;
        }
      }
    } else {
      this.invalidClass = true;
    }
    let selectedSubjectResult:any = [];

    this.specilisation.forEach((element:Specialisation) => {
      if(element.subject_id == this.selectedData[productId]){ //filter the subject specialization
        selectedSubjectResult.push(element);
      }
    });
    
    //if i use same array, i went next page the array values are changed so i use separate array for every place
    if(productId === 2 ){
      this.arrayMap.specilisation = selectedSubjectResult;
    }else if(productId === 5){
      this.arrayMap.internshipSpecilisation = selectedSubjectResult;
    }else if(productId === 8){
      this.arrayMap.wrkExpSpecilisation = selectedSubjectResult;
    }
  }

  getRecommendation(productId: number){
    
    if(productId == 7 && this.selectedData[productId] == 2){ //if 4th page value is no if i click the previous button needs to redirect direcly 4th page 
      // if the product id 8 and 9 is already choose so the values are stored. again i go to give the product id value is 7 the values are still exist in the array so i removed
      const entries = Object.entries(this.selectedData);
      const filteredEntries = entries.filter(([key, _]) => key !== '8' && key !== '9');
      this.selectedData = Object.fromEntries(filteredEntries);
    }
    console.log(this.selectedData);

    this.careerPlannerService.storeCareerPlans(this.selectedData).subscribe((res)=>{
      console.log(res);
    })
  }

  onClickRadioButton(productId: number) {
    this.invalidClass = false;
    if(productId == 7){
      if(this.selectedData[productId] == 2){
        this.nxtOrRecommendBtn = true;
      }else{
        this.nxtOrRecommendBtn = false;
      }
      
    }
    // if (this.activePageIndex < this.products.length - 1) {
    //   this.activePageIndex++;
    // }
  }
}
