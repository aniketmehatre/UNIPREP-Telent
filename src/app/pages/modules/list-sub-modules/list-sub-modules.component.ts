import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModuleListSub } from "../../../@Models/module.model";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { DataService } from "../../../data.service";
import { LocationService } from "../../../location.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PageFacadeService } from '../../page-facade.service';

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
  quizData: any[] = [];
  moduleList: any[] = [];
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
  infoMessage!: string;
  unlockMessage!: string;
  aboutModule!: string;
  moduleDetails!: string;
  upgradePlanMsg!: string;
  selectedModule!: string;
  planExpired!: boolean;
  countryName!: string;
  isSkeletonVisible: boolean = true;
  countryId: any;
  canShowQuestionList: boolean = false;
  howItWorksVideoLink: string = "";
  quizmoduleselectcountryidsetzero:any=0;
  selectSubmoduleName:string = "";
  ehitlabelIsShow:boolean=true;
  imagewhitlabeldomainname:any
  orgnamewhitlabel:any;
  orglogowhitelabel:any;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService, private authService: AuthService,
    private locationService: LocationService, private route: ActivatedRoute, private ngxService: NgxUiLoaderService,
    private confirmationService: ConfirmationService, private pageFacade: PageFacadeService) {
    this.countryId = Number(localStorage.getItem('countryId'));
    this.dataService.countryIdSource.subscribe((data) => {
      if (this.countryId != data) {
        this.ngOnInit();
      }
      //localStorage.setItem('countryId', data);
      //this.isSkeletonVisible = true
      this.dataService.countryNameSource.subscribe((data) => {
        this.countryName = data;
      });
    });
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

  allSearchedResult: any[] = []
  loopRange = Array.from({ length: 30 }).fill(0).map((_, index) => index);
  ngOnInit() {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
  this.imagewhitlabeldomainname=window.location.hostname;
  if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
    this.ehitlabelIsShow=true;
  }else{
    this.ehitlabelIsShow=false;
  }
    localStorage.setItem("modalcountryid",this.quizmoduleselectcountryidsetzero);
    this.init();
    this.moduleListService.getSubmodulesAndSpecialization().subscribe((res: any) => {
      this.allSearchedResult = res
    })
  }
  init() {
    this.currentCountryId = Number(localStorage.getItem('countryId'));
    this.currentModuleSlug = this.router.url.split('/').pop();
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    switch (this.currentModuleSlug) {
      case 'pre-admission':
        this.currentModuleId = 1;
        this.currentModuleName = 'Pre-Admission';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Pre-admission section',
          this.unlockMessage = 'Unlock the power of success with our exclusive Pre-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Scholarships, document checklist, Education loan, letter of Recommendation and many more!'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/Kae2KQnmWko?si=vjUQ7eyurP2Mbg-n";
        break;
      case 'travel-and-tourism':
        this.currentModuleId = 7;
        this.currentModuleName = 'Travel-and-Tourism';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the travel-and-tourism',
          this.unlockMessage = 'Unlock the power of success with our exclusive travel-and-tourism!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Visa, departure, healthcare, tuition fees and many more!'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/s35R5o7cOOU?si=DvR3LyQ1C8uRaAN3";
        break;
      case 'post-admission':
        this.currentModuleId = 3;
        this.currentModuleName = 'Post-Admission';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the post-admission',
          this.unlockMessage = 'Unlock the power of success with our exclusive post-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Post-admission offers information about:',
          this.moduleDetails = ' Arrival, student discounts, banking, full time jobs, post study work and many more!'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/Q9-cUbwFNZI?si=LIdazrVO_qAQKiFk";
        break;
      case 'career-hub':
        this.currentModuleId = 4;
        this.currentModuleName = 'Career Hub';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Career Hub',
          this.unlockMessage = '',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = ' Arrival, student discounts, banking, full time jobs, post study work and many more!'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/7ogHhrekZjE?si=NADxga9qB4_RkCtw";
        break;
      case 'university':
        this.currentModuleId = 5;
        this.currentModuleName = 'University';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.selectedModule = 'university'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/Bsg1CTnVmYc?si=cWYQIexHAoeXvsyR";
        break;
      case 'skill-mastery':
        this.currentModuleId = 10;
        this.currentModuleName = 'Skill Mastery';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Skill Mastery',
          this.unlockMessage = ' ',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = ' Arrival, student discounts, banking, full time jobs, post study work and many more!'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/dHhq2xrBn5s?si=2dMsQcwwOY17dDHi";
        break;
      case 'learning-hub':
        this.currentModuleId = 8;
        this.currentModuleName = 'Learning Hub';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Learning Hub',
          this.unlockMessage = 'Unlock the power of success with our exclusive Pre-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Scholarships, document checklist, Education loan, letter of Recommendation and many more!'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/n9ECpsB6IoI?si=4coiypva6WZfr3NL";
        break;
      default:
        this.currentModuleId = 6;
        this.currentModuleName = 'Life At ' + this.countryName;
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access information about life in your chosen destination',
          this.unlockMessage = 'Unlock the power of success with our exclusive destination',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Festivals, events, currency, budget, housing and many more!',
          this.selectedModule = 'life-at-country'
        this.howItWorksVideoLink = "https://www.youtube.com/embed/O35ypi2WJVI?si=CSxuFC1Zma9gk8SG";
        break;

    }
    /*FU
    // if (this.currentModuleId == 5) {
    //   return;
    // } */
    localStorage.setItem("currentmodulenameforrecently", this.currentModuleName);
    this.loadModuleAndSubModule();
    if (this.route.snapshot.paramMap.get('id') == '2') {
      this.startQuiz();
    }
    this.checkplanExpire();
    this.checkquizquestionmodule();
  }

  loadModuleAndSubModule() {

    this.currentCountryId = Number(localStorage.getItem('countryId'));
    //this.isSkeletonVisible = true;
    //this.subModules$ = this.moduleListService.subModuleList$();
    let data: any = {
      moduleId: this.currentModuleId,
    }
    if (this.currentModuleId == 8) {
      data.category_flag = 1;
    }
    else if (this.currentModuleId == 10) {
      data.country_id = 0;
    }
    else {
      data.country_id = this.currentCountryId;
      data.api_module_name = this.currentApiSlug;
    }
    //this.moduleListService.loadSubModules(data);
    this.locationService.GetQuestionsCount(data).subscribe(data => {

      this.isSkeletonVisible = false;
      this.subModuleList = data;
      if (this.currentModuleId == 8) {
        this.subModuleList.map(list => list.submodule_name = list.category);
      }

    });
    // this.subModules$.subscribe(event => {
    //   this.subModuleList = event;
    // });
    this.locationService.getUniPerpModuleList().subscribe((data: any) => {
      this.moduleList = data.modules;
      this.ngxService.stop();
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
    console.log(this.quizList$);

    this.quizList$.subscribe((data) => {
      console.log(data);
      if (data) {
        this.quizData = data.map((val: any) => {
          let moduleData = this.moduleList.filter(ind => ind.id == val.module_id)[0]!.module_name;
          let subModuleName = this.subModuleList.filter(ind => ind.id == val.submodule_id)[0]!.submodule_name;
          let number = 1;
          let dd = { ...val };
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
    this.breadCrumb = [{ label: cName }, { label: this.quizData[0]!.module_name },
    { label: this.quizData[0]!.sub_module_name }];
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
  restrict = false;
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

  quitQuiz(cd: any) {
    this.isStartQuiz = false;
    this.isInstructionVisible = false;
    this.isQuizSubmit = false;
    cd.accept();
  }

  startQuiz() {
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
    // let cName = "";
    // this.dataService.countryNameSource.subscribe(countryName => {
    //   cName = countryName;
    // });
    // this.quizData = [];
    // this.loadModuleAndSubModule();
    // this.getQuizData();
    // this.selectedQuiz = 1;
    // this.positionNumber = 1;
    // this.isInstructionVisible = true;
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

  onSubModuleClick(id: any, submodule: any) {
    console.log(id, "submodule-id");
    console.log(submodule, "submodule");
    this.selectSubmoduleName = submodule.submodule_name;
    // if(this.planExpired){
    //   this.restrict=true;
    //   return;
    // }
    if (this.currentModuleId == 8 && !this.canShowQuestionList) {
      let data: any = {
        moduleId: this.currentModuleId,
        category_id: this.subModuleList.find(list => list.submodule_id == id)?.category_id
      }
      this.isSkeletonVisible = true;
      this.locationService.GetQuestionsCount(data).subscribe(data => {
        this.isSkeletonVisible = false;
        this.subModuleList = data;
      });
      this.canShowQuestionList = true;
      return;
    }
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
      let dat = { ...data }
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

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
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
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  goBack() {
    this.isSkeletonVisible = true;
    this.loadModuleAndSubModule();
    this.canShowQuestionList = false;
  }
  clearRestriction() {
    this.restrict = false;
  }
  quizpercentage: any = 0
  checkquizquestionmodule() {
    var data = {
      moduleid: this.currentModuleId,
      countryid: this.currentCountryId
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress
    })
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  searchLearning: any
  filteredData: any[] = []
  performSearch(){
    if (this.searchLearning) {
      this.filteredData = this.allSearchedResult
          .filter((item: any) =>
              item.submodule_name.toLowerCase().includes(this.searchLearning.toLowerCase()) ||
              item.category_name.toLowerCase().includes(this.searchLearning.toLowerCase())
          )
          .map(item => ({
            title: item.category_name,
            subtitle: item.submodule_name,
            category_id: item.category_id,
            submodule_id: item.submodule_id
          }));
    } else {
      this.filteredData = [];
    }
  }

  takeMeToQuestion(data: any){
    this.router.navigate([`/pages/modules/learning-hub/question-list/${data.submodule_id}`]);
  }

  clearSearch() {
    this.searchLearning = '';
    this.filteredData = [];
  }
}
