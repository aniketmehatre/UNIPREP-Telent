import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable, Subscription, interval, takeWhile } from "rxjs";
import { MenuItem, MessageService } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { DataService } from "../../../data.service";
import { LocationService } from "../../../location.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Location } from '@angular/common';
import { GetAcademicListPayload, SubmitRecommendation, SubmitStreamResponse } from 'src/app/@Models/academic-tools.model';
import { ChartOptions } from 'chart.js';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AcademicService } from '../academic.service';
import { QuizResponse } from 'src/app/@Models/career-tool-category.model';

@Component({
  selector: 'uni-academic-tools-quiz',
  templateUrl: './academic-tools-quiz.component.html',
  styleUrls: ['./academic-tools-quiz.component.scss']
})
export class AcademicToolsQuizComponent implements OnInit {
  quizData: any[] = [];
  currentCountryId: any
  currentModuleId: any;
  categoryId: any;
  universityidforquiz: any = null;
  currentModuleSlug: any;
  quizList$!: Observable<any>;
  moduleList: any[] = [];
  currentApiSlug: any;
  countryName!: string;
  infoMessage!: string;
  unlockMessage!: string;
  titleModule: any;
  aboutModule!: string;
  moduleDetails!: string;
  upgradePlanMsg!: string;
  selectedModule!: string;
  submitRecommendationResponse!: SubmitRecommendation;
  isSkeletonVisible: boolean = true;
  subModuleList: any[] = [];
  selectedQuiz: number = 1;
  positionNumber: number = 0;
  isStartQuiz: boolean = false;
  isInstructionVisible: boolean = false;
  isReviewVisible: boolean = false;
  isSubmitRecommendationAnswer: boolean = false;
  isSubmitStreamAnswers: boolean = false;
  isSubmitQuizAnswer: boolean = false;
  breadCrumb: MenuItem[] = [];
  answerOptionClicked: boolean = true;
  streamReportData!: SubmitStreamResponse;
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
  restrict1: boolean = false;
  planExpired: boolean = false;
  selectedQuizArrayForTimer: any[] = [];
  totalquiztime: any = 0;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  quizId: string = '';
  pieChartColors = [
    {
      backgroundColor: ['#EA801E', '#3F4C83', '#546496', '#6D80AF'],
    }
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right',
    }
  };
  pdfUrl: string = '';
  moduelName: string = '';
  showLoading: boolean = false;
  canShowRetry: boolean = false;

  constructor(private moduleListService: ModuleServiceService, private authService: AuthService, private router: Router, private dataService: DataService,
    private location: Location, private locationService: LocationService, private ngxService: NgxUiLoaderService, private toast: MessageService, private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer, private academicService: AcademicService) { }

  ngOnInit(): void {
    this.titleModule = ['Stream', 'Recommendation', 'Quiz'];
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.activatedRoute.params.subscribe(res => {
      this.currentModuleId = res['id'];
      this.quizId = res['submoduleId'];
      this.categoryId = Number(res['categoryId']);
      this.checkProgress();
      this.getList();
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
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
    this.currentModuleSlug = this.router.url.split('/').slice(-2, -1).pop();
    this.currentCountryId = 0;
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
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
    // this.loadModuleAndSubModule();
    this.checkquizquestioncount();
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict1 = false;
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' ||
        subscription_exists_status?.subscription_plan === "free_trail") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }

  // loadModuleAndSubModule() {
  //   let data = {
  //     countryId: this.currentCountryId,
  //     moduleId: this.currentModuleId,
  //     api_module_name: this.currentApiSlug
  //   }
  //   this.locationService.GetQuestionsCount(data).subscribe(data => {
  //     this.isSkeletonVisible = false;
  //   })
  //   this.locationService.getUniPerpModuleList().subscribe((data: any) => {
  //     this.moduleList = data.modules;
  //     this.ngxService.stop();
  //   });
  // }

  runQuiz() {
    this.isInstructionVisible = false;
    this.isStartQuiz = true;
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
    this.stopTimer();
    if (this.currentModuleId == 15 || this.currentModuleId == 16) {
      if (window.history.length > 1) {
        this.router.navigate([`/pages/modules/academic-tools/${this.currentModuleId}`]);
      }
    }
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
    // this.breadCrumb = [{ label: cName }, { label: singleQuizData.module_name },
    // { label: singleQuizData.sub_module_name }];
    // carouselQuiz.navBackward(event, this.selectedQuiz);
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
    // let cName = "";
    // this.dataService.countryNameSource.subscribe(countryName => {
    //   cName = countryName;
    // });

    // this.breadCrumb = [{ label: cName }, { label: singleQuizData.module_name },
    // { label: singleQuizData.sub_module_name }];
    // carouselQuiz.navForward(event, this.selectedQuiz);
  }
  certificatesurl: any = ""

  clickSubmitQuiz() {
    this.quizData = this.quizData.map((data: any) => {
      const { submodule_id, source_faqquestion, otp1, otp2, otp3, otp4, module_id, country_id, user_answered, user_answered_value, ...rest } = data;
      return rest;
    });
    this.stopTimer();
    var data = {
      module_id: this.currentModuleId,
      submodule_id: Number(this.quizId),
      quizquestion: this.quizData
    }
    this.showLoading = true;
    switch (this.categoryId) {
      case 1:
        this.submitAcadamicStreamAnswers(data);
        break;
      case 2:
        this.submitAcadamicRecommendationAnswers(data);
        break;
      case 3:
        this.submitAcadamicQuizAnswers(data);
        break;
      default:
        break;
    }
  }

  submitAcadamicQuizAnswers(data: any) {
    this.moduleListService.submitAcademicQuiz(data).subscribe((res) => {
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
      this.isSubmitStreamAnswers = false;
      this.isSubmitQuizAnswer = true;
      this.checkquizquestionmodule()
    }, (error: Error) => {
      this.showLoading = false;
      console.log(error);
    });
  }

  submitAcadamicRecommendationAnswers(data: any) {
    this.moduleListService.submitAcademicRecommendationQuiz(data).subscribe((res) => {
      this.submitRecommendationResponse = res;
      this.toast.add({
        severity: "success",
        summary: "success",
        detail: res.message,
      });
      this.isStartQuiz = false;
      this.isSubmitRecommendationAnswer = true;
      this.isSubmitQuizAnswer = false;
      this.isSubmitStreamAnswers = false;
      this.isQuizSubmit = true;
      this.checkquizquestionmodule()
    },
      (error: Error) => {
        this.showLoading = false;
        console.log(error);
      });
  }

  submitAcadamicStreamAnswers(data: any) {
    this.moduleListService.submitAcademicStreamQuiz(data).subscribe((res) => {
      this.streamReportData = res;
      this.pdfUrl = res?.report_url;
      this.toast.add({
        severity: "success",
        summary: "success",
        detail: res.message,
      });
      this.isStartQuiz = false;
      this.isQuizSubmit = true;
      this.isSubmitStreamAnswers = true;
      this.isSubmitRecommendationAnswer = false;
      this.isSubmitQuizAnswer = false;
      this.checkquizquestionmodule()
    }, (error: Error) => {
      this.showLoading = false;
      console.log(error);
    });
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
      moduleId: this.currentModuleId,
      submoduleId: this.quizId
    }
    this.moduleListService.reviewAcademicQuiz(data).subscribe((res) => {
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
      module_id: this.currentModuleId,
      submodule_id: this.quizId,
      category_type_id: this.categoryId
    }
    this.moduleListService.getQuizQuestionList(data).subscribe((res) => {
      this.quizcount = res.count > 0 ? res.count : 0;
      if (res?.question !== 'No data found') {
        this.quizData = res.question.map((val: any) => {
          let number = 1;
          let dd = { ...val };
          dd.otp1 = dd.option1 + dd.id + number++;
          dd.otp2 = dd.option2 + dd.id + number++;
          dd.otp3 = dd.option3 + dd.id + number++;
          dd.otp4 = dd.option4 + dd.id + number++;
          return dd;
        });
      } else {
        this.quizData = [];
      }
    })
  }
  quizpercentage: any = 0
  checkquizquestionmodule() {
    var data = {
      moduleid: this.currentModuleId,
      countryid: this.currentCountryId,
      submoduleid: localStorage.getItem("learninghubsubmoduleid")
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress;
      this.showLoading = false;
    },
      (error: Error) => {
        this.showLoading = false;
        console.log(error);
      });
  }
  openCertificate() {
    if (this.planExpired) {
      this.restrict1 = true;
      return;
    }
    window.open(this.certificatesurl, '_blank');
  }
  takeAnotherquiz() {
    if (window.history.length > 1) {
      this.location.back()
    }
  }
  openReferAnswer(link: any) {
    window.open(link, '_blank');
  }
  startTimer(): void {
    this.totalquiztime = this.quizcount * 60;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timer = this.totalquiztime;
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timer > 0)
    ).subscribe(() => {
      this.timer--;
      if (this.timer === 0) {
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
    if (window.history.length > 1) {
      this.location.back()
    }
  }
  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  result() {
    this.isReviewVisible = false;
    this.isQuizSubmit = true;
  }



  downloadReport() {
    const pdfUrl = this.pdfUrl;
    const fileName = 'Stream_selector_report.pdf';

    fetch(pdfUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading the file:', error));
  }
  checkProgress(): void {
    this.academicService.getProgress({ categoryId: this.categoryId, moduleId: this.currentModuleId, submoduleId: this.quizId }).subscribe((res: any) => {
      if (res?.status === 'true') {
        this.isQuizSubmit = true;
        if (this.categoryId === 1) {
          this.isSubmitStreamAnswers = true;
          let reportLength = 0;
          res?.report_names.forEach((name: string) => {
            reportLength += 1;
          });
          if(res?.retry_count<3){
            this.canShowRetry=true
          }
          this.pdfUrl = res?.report_url + res?.report_names[reportLength - 1];
        }
        else if (this.categoryId === 2) {
          this.isSubmitRecommendationAnswer = true;
          this.submitRecommendationResponse = res;
        }
        else {
          this.isSubmitQuizAnswer = true;
          this.totalPercentage = res?.percentageCompleted;
          this.certificatesurl = res?.certificate;
          this.totalanswerquistionaftersubmited = res?.totalquestions;
          this.totalanswercorret = res?.answered;
          if (this.totalPercentage < 40) {
            this.percentageValue = 'Average';
          } else if (this.totalPercentage >= 40 && this.totalPercentage <= 80) {
            this.percentageValue = 'Good';
          } else {
            this.percentageValue = 'Excellent';
          }
        }
      } else {
        this.isInstructionVisible = true;
      }
      this.init();
    })
  }
  getList() {
    const params: GetAcademicListPayload = {
      module_id: this.currentModuleId,
    }
    this.academicService.getAcadamicSubModuleList(params).subscribe((res: QuizResponse) => {
      this.moduelName = res.data.find(item => item.id === Number(this.quizId))?.submodule_name as string;
    });
  }
}
