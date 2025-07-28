import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MenuItem, MessageService } from 'primeng/api';
import { interval, Observable, Subscription, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { ModuleServiceService } from '../../module-store/module-service.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FounderstoolService } from '../founderstool.service';
import { Location } from '@angular/common';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { StorageService } from "../../../services/storage.service";
@Component({
  selector: 'uni-entreprenuerquiz',
  templateUrl: './entreprenuerquiz.component.html',
  styleUrls: ['./entreprenuerquiz.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class EntreprenuerquizComponent implements OnInit {
  quizData: any[] = [];
  currentCountryId: any
  // quizmoduleredirectcountryid: any = 0;
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
  totalanswercorret: number = 0
  claculatingSelectQuizPesrcentage: number = 0
  totalpercentagequiztime: number = 0
  percentageValue: string = '';
  isQuizSubmit: boolean = false;
  timer: number = 0;
  timerSubscription: Subscription | null = null;
  restrict: boolean = false;
  selectedQuizArrayForTimer: any[] = [];
  totalquiztime: any = 0;
  submoduleidquiz: any;
  subModuleName: string = '';
  constructor(private router: Router, private dataService: DataService, private toast: MessageService,
    private service: FounderstoolService, private location: Location, private storage: StorageService) { }

  ngOnInit(): void {

    if (this.storage.get('conditionrevieworquiz') == '1') {
      this.forDirectReviewOpen();
      this.openReviewPopup();
    } else {
      // this.quizmoduleredirectcountryid = Number(this.storage.get('modalcountryid'));
      this.init();
    }
    // this.quizmoduleredirectcountryid = Number(this.storage.get('modalcountryid'));
    // this.init();
  }
  forDirectReviewOpen() {
    this.currentModuleSlug = this.router.url.split('/').slice(-2, -1).pop();
    switch (this.currentModuleSlug) {
      case 'entreprenuersectorproficiencytest':
        this.currentModuleId = 18;
        this.submoduleidquiz = this.storage.get("entrpreneursubid")
        this.universityidforquiz = null;
        this.currentModuleName = 'Entrepreneur Sector Proficiency Test';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Pre-admission section',
          this.unlockMessage = 'Unlock the power of success with our exclusive Pre-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Scholarships, document checklist, Education loan, letter of Recommendation and many more!'
        break;
      default:
        this.currentModuleId = 17;
        this.universityidforquiz = null;
        this.submoduleidquiz = this.storage.get("entrpreneursubid")
        this.currentModuleName = 'Entreprenuer Skill Test';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access information about life in your chosen destination',
          this.unlockMessage = 'Unlock the power of success with our exclusive destination',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Festivals, events, currency, budget, housing and many more!',
          this.selectedModule = 'life-at-country'
        break;

    }
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
    this.subModuleName = this.storage.get("submodulename") as string;
    switch (this.currentModuleSlug) {
      case 'entreprenuersectorproficiencytest':
        this.currentModuleId = 18;
        this.submoduleidquiz = this.storage.get("entrpreneursubid")
        this.universityidforquiz = null;
        this.currentModuleName = 'Entrepreneur Sector Proficiency Test';
        this.currentApiSlug = 'SubmoduleListForStudents';
        this.infoMessage = 'Upgrade to access the Pre-admission section',
          this.unlockMessage = 'Unlock the power of success with our exclusive Pre-admission!',
          this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
        this.aboutModule = 'Explore a vast database of Q&A about:',
          this.moduleDetails = 'Scholarships, document checklist, Education loan, letter of Recommendation and many more!'
        break;
      default:
        this.currentModuleId = 17;
        this.universityidforquiz = null;
        this.submoduleidquiz = this.storage.get("entrpreneursubid")
        this.currentModuleName = 'Entreprenuer Skill Test';
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
    this.storage.set("currentmodulenameforrecently", this.currentModuleName);
    this.loadModuleAndSubModule();
    this.checkquizquestioncount()
  }

  loadModuleAndSubModule() {
    let data = {
      // countryId:this.currentCountryId,
      submoduleId: this.submoduleidquiz,
      moduleId: this.currentModuleId
    }
    this.service.GetQuestionsCount(data).subscribe(data => {
      this.isSkeletonVisible = false;
      this.subModuleList = data;
    })
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
    console.log(mappedQuiz);
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
    this.stopTimer();
    this.router.navigate(['/pages/founderstool/founderstoollist']);
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
      const { submodule_id, source_faqquestion, otp1, otp2, otp3, otp4, module_id, country_id, user_answered, user_answered_value, ...rest } = data;
      return rest;
    });
    this.stopTimer();
    var data = {
      country_id: 0,
      module_id: this.currentModuleId,
      submodule_id: this.submoduleidquiz,
      quizquestion: this.quizData
    }
    this.service.submitQuiz(data).subscribe((res) => {
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
      // this.checkquizquestionmodule()
    })
    // this.totalPercentage = (this.answeredCorrect / this.quizData.length) * 100;
  }

  retryQuiz() {
    this.isReviewVisible = false;
    this.isQuizSubmit = false;
    this.totalPercentage = 0;
    this.totalanswerquistionaftersubmited = 0
    this.totalanswercorret = 0
    this.percentageValue = '';
    this.quizData = [];
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.totalpercentagequiztime = 0;
    this.isInstructionVisible = true;
    this.checkquizquestioncount()
    this.stopTimer();
  }
  openReviewPopup() {
    this.checkquizquestionmodule()
    this.quizData = [];
    this.selectedQuiz = 1
    this.isQuizSubmit = false;
    this.isReviewVisible = true;
    this.stopTimer();
    var data = {
      countryId: 0,
      moduleId: this.currentModuleId,
      submoduleId: this.submoduleidquiz
    }
    this.service.ReviewQuiz(data).subscribe((res) => {
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
      // countryId: 0,
      submoduleId: this.submoduleidquiz,
      moduleId: this.currentModuleId,
    }
    this.service.GetQuestionsCount(data).subscribe((res) => {
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
      countryid: 0,
      submoduleid: this.submoduleidquiz
    }
    this.service.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress
    })
  }
  openCertificate() {
    this.stopTimer();
    window.open(this.certificatesurl, '_blank');
  }
  takeAnotherquiz() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }
  openReferAnswer(link: any) {
    window.open(link, '_blank');
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
    this.router.navigate(['/pages/founderstool/founderstoollist']);
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
      this.router.navigate(['/pages/founderstool/entreprenuerproficiencymodule']);
    }
  }
}
