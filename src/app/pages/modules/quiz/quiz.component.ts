import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModuleListSub } from "../../../@Models/module.model";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { DataService } from "../../../data.service";
import { LocationService } from "../../../location.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'uni-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quizData: any[] = [];
  currentCountryId: any
  currentModuleId: any;
  universityidforquiz:any=null;
  currentModuleSlug: any;
  quizList$!: Observable<any>;
  moduleList: any[] = [];
  currentApiSlug: any;
  countryName!: string;
  currentModuleName: any;
  infoMessage!: string;
  unlockMessage!: string;
  aboutModule!: string;
  moduleDetails!: string;
  upgradePlanMsg!: string;
  selectedModule!: string;
  isSkeletonVisible: boolean = true;
  subModuleList: any[] = [];
  selectedQuiz: number = 1;
  positionNumber: number = 0;
  isStartQuiz: boolean = false;
  isInstructionVisible: boolean = false;
  isReviewVisible: boolean = false;
  breadCrumb: MenuItem[] = [];
  answerOptionClicked: boolean = true;
  selectedOptNumber: number = 1;
  selectedOptValue: string = '';
  responsiveOptions: any[] = [];
  answeredCorrect: number = 0;
  totalPercentage: number = 0;
  claculatingSelectQuizPesrcentage:number=0
  totalpercentagequiztime:number=0
  percentageValue: string = '';
  isQuizSubmit: boolean = false;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService, private ngxService: NgxUiLoaderService, private toast: MessageService,) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    let cName = "";
    this.dataService.countryNameSource.subscribe(countryName => {
      cName = countryName;
    });
    this.quizData = [];
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.isInstructionVisible = true;
    this.currentModuleSlug = this.router.url.split('/').slice(-2, -1).pop();
    this.currentCountryId = Number(localStorage.getItem('countryId'));
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    console.log(this.currentModuleSlug);
    switch (this.currentModuleSlug) {
      case 'pre-admission':
        this.currentModuleId = 1;
        this.universityidforquiz=null;
        this.currentModuleName = 'Pre-Admission';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Pre-admission section',
          this.unlockMessage = 'Unlock the power of success with our exclusive Pre-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Scholarships, document checklist, Education loan, letter of Recommendation and many more!'
        break;
      case 'travel-and-tourism':
        this.currentModuleId = 7;
        this.universityidforquiz=null;
        this.currentModuleName = 'Travel-and-Tourism';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the travel-and-tourism',
          this.unlockMessage = 'Unlock the power of success with our exclusive travel-and-tourism!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Visa, departure, healthcare, tuition fees and many more!'
        break;
      case 'post-admission':
        this.currentModuleId = 3;
        this.universityidforquiz=null;
        this.currentModuleName = 'Post-Admission';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the post-admission',
          this.unlockMessage = 'Unlock the power of success with our exclusive post-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Post-admission offers information about:',
          this.moduleDetails = ' Arrival, student discounts, banking, full time jobs, post study work and many more!'
        break;
      case 'career-hub':
        this.currentModuleId = 4;
        this.universityidforquiz=null;
        this.currentModuleName = 'Career Hub';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Career Hub',
          this.unlockMessage = '',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = ' Arrival, student discounts, banking, full time jobs, post study work and many more!'
        break;
      case 'university':
        this.universityidforquiz=localStorage.getItem('universityidforquiz')
        this.currentModuleId = 5;
        this.currentModuleName = 'University';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.selectedModule = 'university'
        break;
      default:
        this.currentModuleId = 6;
        this.universityidforquiz=null;
        this.currentModuleName = 'Life At ' + this.countryName;
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access information about life in your chosen destination',
          this.unlockMessage = 'Unlock the power of success with our exclusive destination',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Festivals, events, currency, budget, housing and many more!',
          this.selectedModule = 'life-at-country'
        break;

    }
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
    /*FU
    // if (this.currentModuleId == 5) {
    //   return;
    // } */
    localStorage.setItem("currentmodulenameforrecently", this.currentModuleName);
    this.loadModuleAndSubModule();
    this.checkquizquestioncount()
  }


  loadModuleAndSubModule() {
    this.currentCountryId = Number(localStorage.getItem('countryId'));
    //this.isSkeletonVisible = true;
    //this.subModules$ = this.moduleListService.subModuleList$();
    let data = {
      countryId: this.currentCountryId,
      moduleId: this.currentModuleId,
      api_module_name: this.currentApiSlug
    }
    //this.moduleListService.loadSubModules(data);
    this.locationService.GetQuestionsCount(data).subscribe(data => {
      this.isSkeletonVisible = false;
      this.subModuleList = data;
    })
    // this.subModules$.subscribe(event => {
    //   this.subModuleList = event;
    // });
    this.locationService.getUniPerpModuleList().subscribe((data: any) => {
      this.moduleList = data.modules;
      this.ngxService.stop();
    });
  }

  runQuiz() {
    this.isInstructionVisible = false;
    this.isStartQuiz = true;
    let cName = "";
    this.dataService.countryNameSource.subscribe(countryName => {
      cName = countryName;
    });
    this.breadCrumb = [{ label: cName }, { label: this.quizData[0]!.module_name },
    { label: this.quizData[0]!.sub_module_name }];
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
  selectAnswer(selectedOption: any, singleData: any, optNumber: number) {
    this.answerOptionClicked = false;
    this.selectedOptNumber = optNumber;
    this.selectedOptValue = selectedOption;
    console.log(selectedOption);
    console.log(singleData);
    console.log(optNumber);
    let mappedQuiz = this.quizData.map((data: any) => {
      let dat = { ...data }
      if (dat.id == singleData.id) {
        dat.user_answered = optNumber;
        dat.user_answered_value = selectedOption;
        dat.useranswer = optNumber;
        return dat;
      }
      return dat;
    });
    this.quizData = mappedQuiz;
    this.claculatingSelectQuizPesrcentage=mappedQuiz.filter(obj => obj.useranswer).length;
    this.totalpercentagequiztime=(this.claculatingSelectQuizPesrcentage/ this.quizcount) * 100;
    console.log(this.claculatingSelectQuizPesrcentage);
  }

  closeQuiz() {
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to Quit, All your current progress will be lost.',
    //   header: 'Confirmation',
    //   icon: 'fa-solid fa-circle-exclamation',
    // });
  }

  clickPreviousQuiz(carouselQuiz: any, event: any) {
    if (this.selectedQuiz <= 1) {
      return;
    }
    let singleQuizData = this.quizData[this.selectedQuiz - 2];
    this.quizData.map((data: any) => {
      let dd = { ...data };

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
    this.breadCrumb = [{ label: cName }, { label: singleQuizData.module_name },
    { label: singleQuizData.sub_module_name }];
    carouselQuiz.navBackward(event, this.selectedQuiz);
  }

  clickNextQuiz(carouselQuiz: any, event: any) {
    if (this.selectedQuiz > this.quizData.length - 1) {
      return;
    }

    let singleQuizData = this.quizData[this.selectedQuiz - 1];
    this.quizData = this.quizData.map((data: any) => {
      let dat = { ...data }
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

    this.breadCrumb = [{ label: cName }, { label: singleQuizData.module_name },
    { label: singleQuizData.sub_module_name }];
    carouselQuiz.navForward(event, this.selectedQuiz);
  }
  certificatesurl:any=""
  clickSubmitQuiz() {
    this.quizData = this.quizData.map((data: any) => {
      const { submodule_id, source_faqquestion, otp1, otp2, otp3, otp4, module_id, country_id, user_answered, user_answered_value, ...rest } = data;
      return rest;
    });
    console.log(this.quizData);
    var data = {
      country_id: this.currentCountryId,
      module_id: this.currentModuleId,
      submodule_id: this.universityidforquiz,
      quizquestion: this.quizData
    }
    this.moduleListService.submitQuiz(data).subscribe((res) => {
      console.log(res);
      this.totalPercentage = res.percentageCompleted
      this.certificatesurl=res.certificate
      if (this.totalPercentage < 40) {
        this.percentageValue = 'Average';
      } else if (this.totalPercentage >= 40 && this.totalPercentage <= 80) {
        this.percentageValue = 'Good';
      } else {
        this.percentageValue = 'Excellent';
      }
      this.toast.add({
        severity: "success",
        summary: "success",
        detail: res.message,
      });
      this.isStartQuiz = false;
      this.isQuizSubmit = true;
      this.checkquizquestionmodule()
    })
    // this.totalPercentage = (this.answeredCorrect / this.quizData.length) * 100;
  }

  retryQuiz() {
    this.isReviewVisible = false;
    this.isQuizSubmit = false;
    this.totalPercentage = 0;
    this.percentageValue = '';
    this.quizData = [];
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.isInstructionVisible = true;
    this.checkquizquestioncount()
  }
  openReviewPopup() {
    this.quizData = [];
    this.selectedQuiz=1
    this.isQuizSubmit = false;
    this.isReviewVisible = true;
    var data = {
      countryId: this.currentCountryId,
      moduleId: this.currentModuleId,
      submoduleId: this.universityidforquiz
    }
    this.moduleListService.ReviewQuiz(data).subscribe((res) => {
      console.log(res);
      this.quizData = res.userquiz.map((val: any) => {
        let number = 1;
        let dd = { ...val };
        dd.otp1 = dd.option1 + dd.id + number++;
        dd.otp2 = dd.option2 + dd.id + number++;
        dd.otp3 = dd.option3 + dd.id + number++;
        dd.otp4 = dd.option4 + dd.id + number++;
        return dd;
      });
    })
  }
  quizcount: any
  checkquizquestioncount() {
    this.quizData = [];
    var data = {
      countryId: this.currentCountryId,
      moduleId: this.currentModuleId,
      submoduleId: this.universityidforquiz
    }
    this.moduleListService.quizCount(data).subscribe((res) => {
      this.quizcount = res.count
      console.log(res);
      this.quizData = res.quizquestion.map((val: any) => {
        let number = 1;
        let dd = { ...val };
        dd.otp1 = dd.option1 + dd.id + number++;
        dd.otp2 = dd.option2 + dd.id + number++;
        dd.otp3 = dd.option3 + dd.id + number++;
        dd.otp4 = dd.option4 + dd.id + number++;
        return dd;
      });
    })
  }
  quizpercentage:any=0
  checkquizquestionmodule(){
    var data={
      moduleid:this.currentModuleId,
      countryid: this.currentCountryId
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage=res.progress
    })
  }
  openCertificate(){
    window.open(this.certificatesurl, '_blank');
  }
}
