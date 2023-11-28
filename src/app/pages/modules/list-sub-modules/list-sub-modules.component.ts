import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {ModuleListSub} from "../../../@Models/module.model";
import {ConfirmationService, MenuItem} from "primeng/api";
import {ModuleServiceService} from "../../module-store/module-service.service";
import {DataService} from "../../../data.service";
import {LocationService} from "../../../location.service";

@Component({
  selector: 'uni-list-sub-modules',
  templateUrl: './list-sub-modules.component.html',
  styleUrls: ['./list-sub-modules.component.scss'],
  providers: [ConfirmationService]
})
export class ListSubModulesComponent implements OnInit {
  subModules$!: Observable<ModuleListSub[]>;
  quizList$!: Observable<any>;
  selectedSubModule: any;
  answeredCorrect: number = 0;
  totalPercentage: number = 0;
  percentageValue: string = '';
  subModuleList: any[] = [];
  isStartQuiz: boolean = false;
  isQuizSubmit: boolean = false;
  isReviewVisible: boolean = false;
  responsiveOptions: any[] = [];
  quizData: any [] = [];
  moduleList: any [] = [];
  selectedQuiz: number = 1;
  selectedOptNumber: number = 1;
  selectedOptValue: string = '';
  positionNumber: number = 0;
  breadCrumb: MenuItem[] = [];
  answerOptionClicked: boolean = true
  isInstructionVisible: boolean = false
  currentModuleSlug: any;
  currentModuleName: any;
  currentModuleId: any
  currentCountryId: any
  currentApiSlug: any;


  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
              private locationService: LocationService, private route: ActivatedRoute,
              private confirmationService: ConfirmationService) {
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
        numScroll: 1,
      }
    ];
  }

  ngOnInit(): void {
    this.currentCountryId = Number(localStorage.getItem('countryId'));
    let countryName: any
    this.currentModuleSlug = this.router.url.split('/').pop();
    this.dataService.countryNameSource.subscribe((data) => {
      countryName = data;
    });
    switch (this.currentModuleSlug) {
      case 'pre-application':
        this.currentModuleId = 1;
        this.currentModuleName = 'Pre-Application';
        this.currentApiSlug = 'GetQuestionsCount';
        break;
      case 'post-application':
        this.currentModuleId = 2;
        this.currentModuleName = 'Post-Application';
        this.currentApiSlug = 'GetQuestionsCount';
        break;
      case 'post-admission':
        this.currentModuleId = 3;
        this.currentModuleName = 'Post-Admission';
        this.currentApiSlug = 'GetQuestionsCount';
        break;
      case 'career-hub':
        this.currentModuleId = 4;
        this.currentModuleName = 'Career Hub';
        this.currentApiSlug = 'GetQuestionsCount';
        break;
      case 'university':
        this.currentModuleId = 5;
        this.currentModuleName = 'University';
        this.currentApiSlug = 'GetQuestionsCount';
        break;
      default:
        this.currentModuleId = 6;
        this.currentModuleName = 'Life At '+countryName;
        this.currentApiSlug = 'GetQuestionsCount';
        break;
      
    }
    localStorage.setItem("currentmodulenameforrecently",this.currentModuleName);
    this.loadModuleAndSubModule();
    if (this.route.snapshot.paramMap.get('id') == '2') {
      this.startQuiz();
    }
  }

  loadModuleAndSubModule() {
    this.subModules$ = this.moduleListService.subModuleList$();
    let data = {
      countryId: this.currentCountryId,
      moduleId: this.currentModuleId,
      api_module_name: this.currentApiSlug
    }
    this.moduleListService.loadSubModules(data);
    this.subModules$.subscribe(event => {
      this.subModuleList = event;
    });
    this.locationService.getUniPerpModuleList().subscribe((data: any) => {
      this.moduleList = data.modules;
    });
  }

  getQuizData() {

    let data = {
      countryId: this.currentCountryId,
      moduleId: this.currentModuleId,
      submoduleId: 1
    }
    this.moduleListService.quizList(data);
    this.quizList$ = this.moduleListService.quizList$();

    this.quizList$.subscribe((data) => {
      if(data){
        this.quizData = data.map((val: any) => {
          let moduleData = this.moduleList.filter(ind => ind.id == val.module_id)[0]!.module_name;
          let subModuleName = this.subModuleList.filter(ind => ind.id == val.submodule_id)[0]!.submodule_name;
          let number = 1;
          let dd = {...val};
          dd.module_name = moduleData
          dd.sub_module_name = subModuleName
          dd.otp1 = dd.option1 + dd.id + number++;
          dd.otp2 = dd.option2 + dd.id + number++;
          dd.otp3 = dd.option3 + dd.id + number++;
          dd.otp4 = dd.option4 + dd.id + number++;
          return dd;
        });
      }
    });

  }

  nextModule() {
    this.router.navigateByUrl(`/pages/modules/${this.currentModuleSlug}/question-list`)
  }

  runQuiz() {
    this.isInstructionVisible = false;
    this.isStartQuiz = true;
    let cName = "";
    this.dataService.countryNameSource.subscribe(countryName => {
      cName = countryName;
    });
    this.breadCrumb = [{label: cName}, {label: this.quizData[0]!.module_name},
      {label: this.quizData[0]!.sub_module_name}];
  }

  clickPreviousQuiz(carouselQuiz: any, event: any) {
    if (this.selectedQuiz <= 1) {
      return;
    }
    let singleQuizData = this.quizData[this.selectedQuiz - 2];
    this.quizData.map((data: any) => {
      let dd = {...data};

      if (dd.id == singleQuizData.id) {
        this.selectedOptNumber = dd.user_answered;
        if (dd.user_answered_value != '') {
          this.answerOptionClicked = false;
          dd.user_answered = this.selectedQuiz;
        }
        return dd;
      }
    });
    this.selectedQuiz = this.selectedQuiz - 1;
    let cName = "";
    this.dataService.countryNameSource.subscribe(countryName => {
      cName = countryName;
    });
    this.breadCrumb = [{label: cName}, {label: singleQuizData.module_name},
      {label: singleQuizData.sub_module_name}];
    carouselQuiz.navBackward(event, this.selectedQuiz);
  }

  clickNextQuiz(carouselQuiz: any, event: any) {
    if (this.selectedQuiz > this.quizData.length - 1) {
      return;
    }

    let singleQuizData = this.quizData[this.selectedQuiz - 1];
    this.quizData = this.quizData.map((data: any) => {
      let dat = {...data}
      if (dat.id == singleQuizData.id) {
        if (!dat.user_answered_value) {
          dat.user_answered = this.selectedOptNumber;
          dat.user_answered_value = this.selectedOptValue;
          this.answerOptionClicked = true;
        } else {
          this.answerOptionClicked = false;
        }
        return dat;
      }
      return dat;
    });
    let sing = this.quizData[this.selectedQuiz];
    if (!sing.user_answered_value) {
      this.answerOptionClicked = true;
    }
    this.selectedQuiz = this.selectedQuiz + 1;

    let cName = "";
    this.dataService.countryNameSource.subscribe(countryName => {
      cName = countryName;
    });

    this.breadCrumb = [{label: cName}, {label: singleQuizData.module_name},
      {label: singleQuizData.sub_module_name}];
    carouselQuiz.navForward(event, this.selectedQuiz);
  }

  clickSubmitQuiz() {
    this.quizData.forEach((data) => {
      if (data.answer == data.user_answered) {
        this.answeredCorrect++;
      }
    });
    this.totalPercentage = (this.answeredCorrect / this.quizData.length) * 100;
    if (this.totalPercentage < 40) {
      this.percentageValue = 'Average';
    } else if (this.totalPercentage >= 40 && this.totalPercentage <= 80) {
      this.percentageValue = 'Good';
    } else {
      this.percentageValue = 'Excellent';
    }
    this.isStartQuiz = false;
    this.isQuizSubmit = true;
  }

  closeAllHome() {
    this.isStartQuiz = false;
    this.isInstructionVisible = false;
    this.isQuizSubmit = false;
  }

  closeQuiz() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Quit, All your current progress will be lost.',
      header: 'Confirmation',
      icon: 'fa-solid fa-circle-exclamation',
    });
  }

  quitQuiz(cd: any){
    this.isStartQuiz = false;
    this.isInstructionVisible = false;
    this.isQuizSubmit = false;
    cd.accept();
  }

  startQuiz() {
    let cName = "";
    this.dataService.countryNameSource.subscribe(countryName => {
      cName = countryName;
    });
    this.quizData = [];
    this.loadModuleAndSubModule();
    this.getQuizData();
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.isInstructionVisible = true;
  }

  setPage(page: any) {
    let pageNum: number = 0
    if (page.page < 0) {
      pageNum = this.quizData.length;
    } else {
      pageNum = page.page
    }
    this.positionNumber = pageNum + 1;

  }

  onSubModuleClick(id: any) {
    this.subModuleList.forEach((element: any) => {
      if (element.id === id) {
        this.selectedSubModule = element.country;
      }
    });
    this.selectedSubModule = id;
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/question-list/${this.selectedSubModule}`]);

  }

  selectAnswer(selectedOption: any, singleData: any, optNumber: number) {
    this.answerOptionClicked = false;
    this.selectedOptNumber = optNumber;
    this.selectedOptValue = selectedOption;
    let mappedQuiz = this.quizData.map((data: any) => {
      let dat = {...data}
      if (dat.id == singleData.id) {

        dat.user_answered = optNumber;
        dat.user_answered_value = selectedOption;
        return dat;
      }
      return dat;
    });
    this.quizData = mappedQuiz;
  }

  openReviewPopup() {
    this.isQuizSubmit = false;
    this.isReviewVisible = true;
  }

  retryQuiz() {
    this.isReviewVisible = false;
    this.isQuizSubmit = false;
    this.totalPercentage = 0;
    this.percentageValue = '';
    this.quizData = [];
    this.getQuizData();
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.isInstructionVisible = true;
  }
}
