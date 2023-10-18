import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ListQuestion } from 'src/app/@Models/question-list.model';
import { DataService } from 'src/app/data.service';
import { ModuleServiceService } from '../module-store/module-service.service';
import { ReadQuestion } from 'src/app/@Models/read-question.model';
import { RecentlyaddedquestionService } from './recentlyaddedquestion.service';

@Component({
  selector: 'uni-recentlyaddedquestions',
  templateUrl: './recentlyaddedquestions.component.html',
  styleUrls: ['./recentlyaddedquestions.component.scss']
})
export class RecentlyaddedquestionsComponent implements OnInit {
  // listQuestion$!: Observable<ListQuestion[]>;
  listQuestion:any[]=[];
  readQue$!: Observable<ReadQuestion[]>;
  isQuestionAnswerVisible: boolean = false;
  countryId: any;
  subModuleId: any;
  currentSubModuleSlug: any;
  currentModuleSlug: any;
  currentModuleName: any;
  currentModuleId: any
  currentCountryId: any
  currentApiSlug: any;
  responsiveOptions: any[] = [];
  message: string = '';
  videoLinks: any [] = [];
  refLink: any [] = [];
  selectedQuestion: number = 0;
  selectedQuestionId: number = 0;
  selectedModule: number = 0;
  selectedSubModule: number = 0;
  selectedVideo: number = 0;
  selectedRefLink: number = 0;
  positionNumber: number = 0;
  selectedQuestionData: any;
  popUpItemVideoLink: any;
  reviewedByOrgList: any;
  data: any;
  isRecommendedLinksVisible: boolean = false;
  isRecommendedVideoVisible: boolean = false;
  isReviewedByVisible: boolean = false;
  isAnswerDialogVisiblePrev: boolean = false;
  isAnswerDialogVisibleNext: boolean = false;
  constructor(private route: ActivatedRoute,private dataService: DataService,private moduleListService: ModuleServiceService,private service:RecentlyaddedquestionService) { }

  ngOnInit(): void {
    this.loadInit()
  }
  loadInit(){
    this.countryId = Number(localStorage.getItem('countryId'));

    // this.subModuleId = this.route.snapshot.paramMap.get('id');
    this.currentSubModuleSlug = localStorage.getItem("currentmodulenameforrecently");
  console.log(this.currentSubModuleSlug);
  
    switch (this.currentSubModuleSlug) {
      case 'Pre Application':
        this.currentModuleId = 1;
        this.currentModuleName = 'Pre Application';
        this.currentApiSlug = 'getpreapplicationsubmoduleqcount';
        break;
      case 'Post Application':
        this.currentModuleId = 2;
        this.currentModuleName = 'Post Application';
        this.currentApiSlug = 'getpostapplicationsubmoduleqcount';
        break;
      case 'Post Admission':
        this.currentModuleId = 3;
        this.currentModuleName = 'Post Admission';
        this.currentApiSlug = 'getpostadmissionsubmoduleqcount';
        break;
      case 'Career Hub':
        this.currentModuleId = 4;
        this.currentModuleName = 'Career Hub';
        this.currentApiSlug = 'getcareerhubsubmoduleqcount';
        break;
      case 'University':
        this.currentModuleId = 5;
        this.currentModuleName = 'University';
        this.currentApiSlug = 'getuniversitysubmoduleqcount';
        break;
        case 'University':
          this.currentModuleId = 6;
          this.currentModuleName = 'University';
          this.currentApiSlug = 'Life At Country';
          break;
      default:
        this.currentModuleId = "";
        this.currentModuleName = 'Recently Added Question';
        this.currentApiSlug = 'getlifeincountrysubmoduleqcount';
        break;
    }
    let data1 = {
      getcountry_id: this.countryId,
      getmoduleid: this.currentModuleId,
      // submoduleId: Number(this.subModuleId)
    }
    this.readQuestion(data1)
    console.log(this.currentModuleId);
    console.log(this.countryId);
    // this.getSubmoduleName(this.countryId);

    // this.dataService.currentMessage.subscribe(message => this.message = message)
    // this.breadCrumb = [{ label: this.currentModuleName,command: (event) =>this.gotomodulebreadcrump() }, { label: this.moduleName, command: (event) =>this.goToHomebreadcrump() }, { label: 'Question' }];

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    // this.listQuestion$ = this.moduleListService.questionList$();
    let data = {
      countryId: Number(localStorage.getItem('countryId')),
      moduleId: this.currentModuleId,
      // submoduleId: Number(this.subModuleId)
    }
    // this.moduleListService.loadQuestionList(data);
  }
  onQuestionClick(selectedData: any) {
    console.log(selectedData);
    
    // this.listQuestion.subscribe((event:any) => {
    //   this.data = event
    // })
    
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion - 1;
    let index = this.data.findIndex((x: any) => x.id === selectedData.id);
    this.selectedQuestion = index;
    this.positionNumber = index;

    // this.breadCrumb = [{ label: this.currentModuleName,command: (event) =>this.gotomodulebreadcrump() }, { label: this.moduleName, command: (event) => this.goToHomebreadcrump() }, { label: `Question ${index + 1}` }];

    this.isQuestionAnswerVisible = true;
    this.data.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.imagelink;
        this.videoLinks = res.videolink;
      }
    });
    let data1 = {
      getcountry_id: this.countryId,
      getmoduleid: this.currentModuleId,
      // submoduleId: Number(this.subModuleId)
    }
    let data = {
      questionId: selectedData.id,
      getcountry_id: this.countryId,
      getmoduleid: this.currentModuleId,
      submoduleId: Number(this.subModuleId)
    }
    if (this.selectedQuestion < 1) {
      this.isAnswerDialogVisiblePrev = false;
    }else{
      this.isAnswerDialogVisiblePrev = true;
    }
    if (this.selectedQuestion >= this.data.length - 1) {
      this.isAnswerDialogVisibleNext = false;
    }else{
      this.isAnswerDialogVisibleNext = true;
    }
    // this.readQuestion(data);
  }
  readQuestion(data:any){
    // this.moduleListService.readQuestion(data);
    // this.readQue$ = this.moduleListService.readQuestionMessage$();
 
    // this.service.getrecentquestionadd(data).subscribe((res) => {
    //   console.log(res);
      
    //   this.listQuestion = res.recentlyaddedfaqquestions;
    // })
    // this.listQuestion = []
    // this.moduleListService.loadQuestionList(data1);
  
  }

  goToHome(eve:any){

  }
  clickPrevious(carousel: any, event: any) {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion <= 1) {
      this.isAnswerDialogVisiblePrev = false;
    }
    if (this.selectedQuestion <= 0) {
      return;
    }
    let selectedData = this.data[this.selectedQuestion-1];
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion - 1;
    this.data.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    carousel.navBackward(event, this.selectedQuestion);
    let data = {
      questionId: selectedData.id,
      countryId: this.countryId
    }

    this.readQuestion(data);
  }
  clickNext(carousel: any, event: any) {
    this.isAnswerDialogVisiblePrev = true;
    this.isAnswerDialogVisibleNext = true;
    if (this.selectedQuestion >= this.data.length - 2) {
      this.isAnswerDialogVisibleNext = false;
    }
    if (this.selectedQuestion >= this.data.length - 1) {
      return;
    }
    let selectedData = this.data[this.selectedQuestion+1];
    this.selectedQuestionData = selectedData;
    this.selectedModule = selectedData.module_id;
    this.selectedSubModule = selectedData.submodule_id;
    this.selectedQuestionId = selectedData.id;
    this.selectedQuestion = this.selectedQuestion + 1;
    this.data.filter((res: any) => {
      if (res.id == selectedData.id) {
        this.refLink = res.reflink;
        this.videoLinks = res.videolink;
      }
    });
    carousel.navForward(event, this.selectedQuestion)
    let data = {
      questionId: selectedData.id,
      countryId: this.countryId
    }
    this.readQuestion(data);
  }
  openReport(){

  }
  reviewBy(){

  }
  setPage(eve:any){

  }
  onClickAsk(){
    
  }
}
