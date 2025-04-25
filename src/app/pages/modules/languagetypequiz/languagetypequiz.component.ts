import { LanguageArrayGlobalService } from './../../language-hub/language-array-global.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription, interval, takeWhile } from "rxjs";
import { ModuleListSub } from "../../../@Models/module.model";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { DataService } from "../../../data.service";
import { LocationService } from "../../../location.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { StorageService } from "../../../storage.service";
@Component({
  selector: 'uni-languagetypequiz',
  templateUrl: './languagetypequiz.component.html',
  styleUrls: ['./languagetypequiz.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, CarouselModule, ButtonModule],
})
export class LanguagetypequizComponent implements OnInit {

  quizData: any[] = [];
  currentCountryId: any
  currentModuleId: any;
  universityidforquiz: any = null;
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
  totalanswerquistionaftersubmited: number = 0;
  totalanswercorret: number = 0;
  claculatingSelectQuizPesrcentage: number = 0
  totalpercentagequiztime: number = 0
  percentageValue: string = '';
  isQuizSubmit: boolean = false;
  timer: number = 0;
  timerSubscription: Subscription | null = null;
  restrict: boolean = false;
  selectedQuizArrayForTimer: any[] = [];
  totalquiztime: any = 0;
  planExpired: boolean = false;
  menuView: any
  constructor(private moduleListService: ModuleServiceService, private authService: AuthService,
    private router: Router, private dataService: DataService, private location: Location,
    private locationService: LocationService, private ngxService: NgxUiLoaderService,
    private toast: MessageService, private lAGS: LanguageArrayGlobalService, private storage: StorageService) { }

  getFormattedValues(): string {
    return this.lAGS.getItems().join(' -> ');
  }

  ngOnInit(): void {
    this.menuView = this.storage.get('QuizModuleName');
    this.init();
    this.checkplanExpire();
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
    this.currentCountryId = 0;
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    switch (this.currentModuleSlug) {
      case 'language-hub':
        this.currentModuleId = 9;
        this.currentModuleName = 'Language Hub';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Learning Hub',
          this.unlockMessage = ' ',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = ' Arrival, student discounts, banking, full time jobs, post study work and many more!'
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
    this.storage.set("currentmodulenameforrecently", this.currentModuleName);
    this.loadModuleAndSubModule();
    this.checkquizquestioncount()
  }

  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

  loadModuleAndSubModule() {
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
      this.ngxService.stopBackground();
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
    this.startTimer();
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
    this.claculatingSelectQuizPesrcentage = mappedQuiz.filter(obj => obj.useranswer).length;
    this.totalpercentagequiztime = (this.claculatingSelectQuizPesrcentage / this.quizcount) * 100;
  }

  closeQuiz() {
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to Quit, All your current progress will be lost.',
    //   header: 'Confirmation',
    //   icon: 'fa-solid fa-circle-exclamation',
    // });
    this.router.navigate(["/pages/language-hub/languages"]);
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
    // time checking for same question or different quesion
    // const exists = this.selectedQuizArrayForTimer.some(item => item.id === singleQuizData.id);
    // if (!exists) {
    //   this.selectedQuizArrayForTimer.push(singleQuizData);
    //   this.resetTimer();
    // }
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
  certificatesurl: any = ""
  clickSubmitQuiz() {
    this.quizData = this.quizData.map((data: any) => {
      const { languagetype, language_id, submodule_id, source_faqquestion, otp1, otp2, otp3, otp4, module_id, country_id, user_answered, user_answered_value, ...rest } = data;
      return rest;
    });
    this.stopTimer();
    var data = {
      languagetype: this.storage.get("languagetypeidforquiz"),
      module_id: this.currentModuleId,
      language_id: this.storage.get("languageidforquiz"),
      quizquestion: this.quizData
    }
    this.moduleListService.submitLanguageghubquiz(data).subscribe((res) => {
      this.totalPercentage = res.percentageCompleted
      this.certificatesurl = res.certificate
      this.totalanswerquistionaftersubmited = res.totalquestions
      this.totalanswercorret = res.answered
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
    this.totalanswerquistionaftersubmited = 0
    this.totalanswercorret = 0;
    this.totalpercentagequiztime = 0;
    this.percentageValue = '';
    this.quizData = [];
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.isInstructionVisible = true;
    this.checkquizquestioncount()
  }
  openReviewPopup() {
    this.quizData = [];
    this.selectedQuiz = 1
    this.isQuizSubmit = false;
    this.isReviewVisible = true;
    var data = {
      languageId: this.storage.get("languageidforquiz"),
      module_id: this.currentModuleId,
      languagetype: this.storage.get("languagetypeidforquiz")
    }
    this.moduleListService.ReviewQuizLanguageHub(data).subscribe((res) => {
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
  quizcount: number = 0
  checkquizquestioncount() {
    this.quizData = [];
    var data = {
      languageId: this.storage.get("languageidforquiz"),
      moduleId: this.currentModuleId,
      languagetype: this.storage.get("languagetypeidforquiz")
    }
    this.moduleListService.languageghubquiz(data).subscribe((res) => {
      this.quizcount = res.count > 0 ? res.count : 0;
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
  quizpercentage: any = 0
  checkquizquestionmodule() {
    var data = {
      moduleid: this.currentModuleId,
      languageId: this.storage.get("languageidforquiz"),
      languagetype: this.storage.get("languagetypeidforquiz"),
    }
    this.moduleListService.checklanguageQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress
    })
  }
  openCertificate() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    window.open(this.certificatesurl, '_blank');
  }
  takeAnotherquiz() {
    this.router.navigate([`/pages/modules/quizmodule`]);
  }
  openReferAnswer(link: any) {
    const lastDigits = link.match(/(\d+)$/)[0];
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/pages/language-hub/translate-view/${lastDigits}`])
    );
    window.open(url, '_blank');
  }
  timeover: number = 0;
  startTimer(): void {
    this.timeover = 0;
    this.timer = this.quizcount * 60;
    this.totalquiztime = this.quizcount * 60;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timer > this.timeover)
    ).subscribe(() => {
      this.timer--;
      // console.log(`Timer: ${this.timer} seconds`);
      if (this.timer === this.timeover) {
        this.restrict = true;
      }
    });
  }
  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  resetTimer(): void {
    this.startTimer();
  }
  timeIsOver() {
    this.router.navigate(['/pages/modules/quizmodule'])
  }
  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/pages/modules/quizmodule']);
    }
  }
}
