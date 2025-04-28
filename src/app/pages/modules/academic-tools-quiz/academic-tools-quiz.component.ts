import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable, Subscription, interval, takeWhile } from "rxjs";
import { MenuItem, MessageService } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { DataService } from "../../../data.service";
import { LocationService } from "../../../location.service";
import { AuthService } from "src/app/Auth/auth.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Location } from "@angular/common";
import { GetAcademicListPayload, SubmitRecommendation, SubmitStreamResponse } from "src/app/@Models/academic-tools.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { AcademicService } from "../academic.service";
import { QuizResponse } from "src/app/@Models/career-tool-category.model";
;
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CarouselModule } from "primeng/carousel";
import { ButtonModule } from "primeng/button";
import { PdfViewerModule } from "ng2-pdf-viewer";
@Component({
  selector: "uni-academic-tools-quiz",
  templateUrl: "./academic-tools-quiz.component.html",
  styleUrls: ["./academic-tools-quiz.component.scss"],
  imports: [PdfViewerModule, DialogModule, CommonModule, CarouselModule, ButtonModule],
  standalone: true,
})
export class AcademicToolsQuizComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfViewer') pdfViewer: any;
  quizData: any[] = [];
  currentCountryId: any;
  currentModuleId: string = "15";
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
  selectedOptValue: string = "";
  responsiveOptions: any[] = [];
  answeredCorrect: number = 0;
  totalPercentage: number = 0;
  totalanswerquistionaftersubmited: number = 0;
  totalanswercorret: number = 0;
  claculatingSelectQuizPesrcentage: number = 0;
  totalpercentagequiztime: number = 0;
  // percentageValue: string = '';
  isQuizSubmit: boolean = false;
  timer: number = 0;
  timerSubscription: Subscription | null = null;
  restrict: boolean = false;
  planExpired: boolean = false;
  selectedQuizArrayForTimer: any[] = [];
  totalquiztime: any = 0;
  quizId: string = "";
  pieChartColors = [
    {
      backgroundColor: ["#EA801E", "#3F4C83", "#546496", "#6D80AF"],
    },
  ];

  // chartOptions: ChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   legend: {
  //     position: 'right',
  //   }
  // };
  pdfUrl: string = "";
  moduelName: string = "";
  showLoading: boolean = false;
  canShowRetry: boolean = false;
  submoduleId: string = "";
  pdfLoadError: boolean = false;

  constructor(private moduleListService: ModuleServiceService, private authService: AuthService, private router: Router, private dataService: DataService, private location: Location, private locationService: LocationService, private ngxService: NgxUiLoaderService, private toast: MessageService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private academicService: AcademicService) { }

  ngOnInit(): void {
    this.titleModule = ["Stream", "Recommendation", "Quiz"];
    this.activatedRoute.params.subscribe((res) => {
      this.submoduleId = res["id"];
      this.quizId = res["submoduleId"];
      this.categoryId = Number(res["categoryId"]);
      this.checkProgress();
      this.getList();
    });

    this.checkplanExpire();
  }

  init() {
    let cName = "";
    this.dataService.countryNameSource.subscribe((countryName) => {
      cName = countryName;
    });
    this.quizData = [];
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.currentModuleSlug = this.router.url.split("/").slice(-2, -1).pop();
    this.currentCountryId = 0;
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    this.responsiveOptions = [
      {
        breakpoint: "1199px",
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: "991px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
    // this.loadModuleAndSubModule();
    this.checkquizquestioncount();
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

  runQuiz() {
    this.isInstructionVisible = false;
    this.isStartQuiz = true;
    this.startTimer();
  }

  setPage(page: any) {
    let pageNum: number = 0;
    if (page.page < 0) {
      pageNum = this.quizData.length;
    } else {
      pageNum = page.page;
    }
    this.positionNumber = pageNum + 1;
  }

  selectAnswer(selectedOption: any, singleData: any, optNumber: number) {
    this.answerOptionClicked = false;
    this.selectedOptNumber = optNumber;
    this.selectedOptValue = selectedOption;
    let mappedQuiz = this.quizData.map((data: any) => {
      let dat = { ...data };
      if (dat.id == singleData.id) {
        dat.user_answered = optNumber;
        dat.user_answered_value = selectedOption;
        dat.useranswer = optNumber;
        return dat;
      }
      return dat;
    });
    this.quizData = mappedQuiz;
    this.claculatingSelectQuizPesrcentage = mappedQuiz.filter((obj) => obj.useranswer).length;
    this.totalpercentagequiztime = (this.claculatingSelectQuizPesrcentage / this.quizcount) * 100;
  }

  closeQuiz() {
    this.stopTimer();
    if (this.submoduleId) {
      if (window.history.length > 1) {
        this.router.navigate([`/pages/modules/academic-tools/${this.submoduleId}`]);
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
        if (dd.user_answered_value != "") {
          this.answerOptionClicked = false;
          dd.user_answered = this.selectedQuiz;
        }
        return dd;
      }
    });
    this.selectedQuiz = this.selectedQuiz - 1;
    let cName = "";
    this.dataService.countryNameSource.subscribe((countryName) => {
      cName = countryName;
    });
  }

  clickNextQuiz(carouselQuiz: any, event: any) {
    if (this.selectedQuiz > this.quizData.length - 1) {
      return;
    }
    let singleQuizData = this.quizData[this.selectedQuiz - 1];
    this.quizData = this.quizData.map((data: any) => {
      let dat = { ...data };
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
  }

  clickSubmitQuiz() {
    this.quizData = this.quizData.map((data: any) => {
      const { submodule_id, source_faqquestion, otp1, otp2, otp3, otp4, module_id, country_id, user_answered, user_answered_value, ...rest } = data;
      return rest;
    });
    this.stopTimer();
    var data = {
      module_id: this.currentModuleId,
      submodule_id: Number(this.quizId),
      quizquestion: this.quizData,
    };
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
    this.moduleListService.submitAcademicQuiz(data).subscribe(
      (res) => {
        this.totalPercentage = res.percentageCompleted;
        this.totalanswerquistionaftersubmited = res.totalquestions;
        this.totalanswercorret = res.answered;
        this.toast.add({
          severity: "success",
          summary: "success",
          detail: res.message,
        });
        this.isStartQuiz = false;
        this.isSubmitStreamAnswers = false;
        this.isSubmitRecommendationAnswer = false;
        this.checkProgress(true);
      },
      (error: Error) => {
        this.showLoading = false;
        console.log(error);
      }
    );
  }

  submitAcadamicRecommendationAnswers(data: any) {
    this.moduleListService.submitAcademicRecommendationQuiz(data).subscribe(
      (res) => {
        this.toast.add({
          severity: "success",
          summary: "success",
          detail: res.message,
        });
        this.isStartQuiz = false;
        this.isSubmitQuizAnswer = false;
        this.isSubmitStreamAnswers = false;
        this.checkProgress(true);
      },
      (error: Error) => {
        this.showLoading = false;
        console.log(error);
      }
    );
  }

  submitAcadamicStreamAnswers(data: any) {
    this.moduleListService.submitAcademicStreamQuiz(data).subscribe(
      (res) => {
        this.toast.add({
          severity: "success",
          summary: "success",
          detail: res.message,
        });
        this.isStartQuiz = false;
        this.isSubmitRecommendationAnswer = false;
        this.isSubmitQuizAnswer = false;
        this.checkProgress(true);
      },
      (error: Error) => {
        this.showLoading = false;
        console.log(error);
      }
    );
  }

  retryQuiz() {
    this.isReviewVisible = false;
    this.isQuizSubmit = false;
    this.totalPercentage = 0;
    this.totalanswerquistionaftersubmited = 0;
    this.totalanswercorret = 0;
    this.totalpercentagequiztime = 0;
    this.quizData = [];
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.isInstructionVisible = true;
    this.checkquizquestioncount();
    this.isSubmitQuizAnswer = false;
  }
  openReviewPopup(index?: number) {
    this.quizData = [];
    this.selectedQuiz = 1;
    this.isQuizSubmit = false;
    this.isReviewVisible = true;
    var data: any = {
      moduleId: this.currentModuleId,
      submoduleId: this.quizId,
    };
    if (index) {
      data.retry = index;
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
    });
  }
  quizcount: number = 0;
  checkquizquestioncount() {
    this.quizData = [];
    var data = {
      module_id: this.currentModuleId,
      submodule_id: this.quizId,
      category_type_id: this.categoryId,
    };
    this.moduleListService.getQuizQuestionList(data).subscribe((res) => {
      this.quizcount = res.count > 0 ? res.count : 0;
      if (res?.question !== "No data found") {
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
    });
  }

  takeAnotherquiz() {
    if (window.history.length > 1) {
      this.location.back();
    }
  }
  openReferAnswer(link: any) {
    window.open(link, "_blank");
  }
  startTimer(): void {
    this.totalquiztime = this.quizcount * 60;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timer = this.totalquiztime;
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timer > 0))
      .subscribe(() => {
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
    return num < 10 ? "0" + num : num.toString();
  }
  resetTimer(): void {
    this.startTimer();
  }
  timeIsOver() {
    if (window.history.length > 1) {
      this.location.back();
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

  downloadReport(index: number) {
    const pdfUrl = this.streamReportData?.report_url + this.streamReportData?.report_names[index];
    const fileName = "Stream_selector_report.pdf";

    fetch(pdfUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading the file:", error));
  }
  checkProgress(submitTrue?: boolean): void {
    this.academicService.getProgress({ categoryId: this.categoryId, moduleId: this.currentModuleId, submoduleId: this.quizId }).subscribe((res: any) => {
      this.showLoading = false;
      this.canShowRetry = false;
      if (res?.status === "true") {
        if (this.categoryId === 1) {
          let reportLength = 0;
          res?.report_names.forEach((name: string) => {
            reportLength += 1;
          });
          if (submitTrue) {
            //  checking submitTrue to verify its from quizsubmit or not if it from quiz submit it has to go to the submit page
            this.isQuizSubmit = true;
            this.isSubmitStreamAnswers = true;
          } else {
            if (res?.retry_count < 3) {
              this.canShowRetry = true;
              this.startQuiz();
            } else {
              this.isQuizSubmit = true;
              this.isSubmitStreamAnswers = true;
            }
          }
          this.streamReportData = res;
          this.pdfUrl = res?.report_url + res?.report_names[reportLength - 1];
        } else if (this.categoryId === 2) {
          this.submitRecommendationResponse = res;
          if (submitTrue) {
            //  checking submitTrue to verify its from quizsubmit or not if it from quiz submit it has to go to the submit page
            this.isQuizSubmit = true;
            this.isSubmitRecommendationAnswer = true;
          } else {
            if (res?.retry_count < 3) {
              this.canShowRetry = true;
              this.startQuiz();
            } else {
              this.isQuizSubmit = true;
              this.isSubmitRecommendationAnswer = true;
            }
          }
        } else {
          if (submitTrue) {
            //  checking submitTrue to verify its from quizsubmit or not if it from quiz submit it has to go to the submit page
            this.isQuizSubmit = true;
            this.isSubmitQuizAnswer = true;
            if (res?.retry < 3) {
              this.canShowRetry = true;
            }
          } else {
            if (res?.retry < 3) {
              this.canShowRetry = true;
              this.startQuiz();
            } else {
              this.isQuizSubmit = true;
              this.isSubmitQuizAnswer = true;
            }
          }
          this.totalPercentage = res?.percentageCompleted;
          this.totalanswerquistionaftersubmited = res?.totalquestions;
          this.totalanswercorret = res?.answered;
        }
      } else {
        this.isInstructionVisible = true;
      }
      this.init();
    });
  }
  getList() {
    const params: GetAcademicListPayload = {
      module_id: this.currentModuleId,
      category_id: this.submoduleId,
    };
    this.academicService.getAcadamicSubModuleList(params).subscribe((res: QuizResponse) => {
      this.moduelName = res.data.find((item) => item.id === Number(this.quizId))?.submodule_name as string;
    });
  }
  startQuiz() {
    let cName = "";
    this.dataService.countryNameSource.subscribe((countryName) => {
      cName = countryName;
    });
    this.selectedQuiz = 1;
    this.positionNumber = 1;
    this.currentModuleSlug = this.router.url.split("/").slice(-2, -1).pop();
    this.currentCountryId = 0;
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    this.responsiveOptions = [
      {
        breakpoint: "1199px",
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: "991px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
    this.quizData = [];
    var data = {
      module_id: this.currentModuleId,
      submodule_id: this.quizId,
      category_type_id: this.categoryId,
    };
    this.moduleListService.getQuizQuestionList(data).subscribe((res) => {
      this.quizcount = res.count > 0 ? res.count : 0;
      if (res?.question !== "No data found") {
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
      this.runQuiz();
    });
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(["/pages/modules/academic-tools"]);
    }
  }

  ngAfterViewInit() {
    if (this.pdfViewer) {
      this.pdfViewer.refresh();
    }
  }

  loadPdf(url: string) {
    try {
      this.pdfUrl = url;
      if (this.pdfViewer) {
        const encodedUrl = encodeURI(url);
        this.pdfViewer.pdfSrc = encodedUrl;
        this.pdfViewer.refresh();
      }
      this.pdfLoadError = false;
    } catch (error) {
      console.error('Error loading PDF:', error);
      this.pdfLoadError = true;
    }
  }

  onError(error: any) {
    console.error('PDF loading error:', error);
    this.pdfLoadError = true;
  }

  downloadPdf(url: string) {
    try {
      const encodedUrl = encodeURI(url);
      window.open(encodedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error downloading PDF file.' });
    }
  }
}
