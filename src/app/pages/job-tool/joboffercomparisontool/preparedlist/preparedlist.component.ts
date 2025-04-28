import { Component, EventEmitter, input, Input, OnInit, Output } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { AuthService } from "../../../../Auth/auth.service";
import { PageFacadeService } from "../../../page-facade.service";
import { JobOfferComparisionService } from "../joboffercomparison.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { SidebarModule } from "primeng/sidebar"
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { RadioButtonModule } from "primeng/radiobutton"
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from "src/app/pages/travel-tools/travel-tools.service";
import { PromptService } from "src/app/pages/prompt.service";

@Component({
  selector: "uni-jopreparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule, SidebarModule, PdfViewerModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, RadioButtonModule]
})
export class JobOfferPreparedListComponent implements OnInit {
  isSkeletonVisible: boolean = true;
  planExpired: boolean = false;
  page: number = 1;
  perpage: number = 25;
  totalDataCount: any = 0;
  ListData: any = [];
  ComparisonResponse: SafeHtml;
  ComparisonResponseVisibility = true;
  userAnswers: any = [];
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter<any>();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  constructor(
    private toast: MessageService,
    private authService: AuthService,
    private service: JobOfferComparisionService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private sanitizer: DomSanitizer,
    private travelService: TravelToolsService,
    private promptService: PromptService
  ) { }
  ngOnInit(): void {
    this.getjobofferResponse();
    this.getSavedResponse();
    this.checkPlanExpiry();
  }
  saveRoleResponse() {
    this.service
      .saveResponseByJobrole({
        jobrole: this.prepData.jobrole,
        answer: this.ComparisonResponse,
      })
      .subscribe((response: any) => {
        this.isSkeletonVisible = false;
        this.ListData = response;
        this.totalDataCount = this.ListData.length;
      });
  }
  selectedCompanies: any;
  getjobofferResponse() {
    this.selectedCompanies = this.prepData.jobs.map((data: any) => data.company).join(' and ');
    this.service.getcomparisonResponse(this.prepData).subscribe((response: any) => {
      this.ComparisonResponse = this.sanitizer.bypassSecurityTrustHtml(response.response);
      this.ComparisonResponseVisibility = true;
      this.isSkeletonVisible = false;
      this.userAnswers = this.sanitizer.bypassSecurityTrustHtml(response.questions);
    }, (error: any) => {
      this.windowChange.emit("error_arrived");
      console.log(error);
    });
  }
  getSavedResponse() {
    this.service.getavgsalarysavedresponse().subscribe((response: any) => {
      this.ListData = response;
      this.totalDataCount = this.ListData.length;
    });
  }
  backtoMain() {
    if (this.readResponse) {
      this.readResponse = false;
      return;
    }
    this.windowChange.emit(false);
  }
  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
  }

  checkPlanExpiry(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }

  }

  downloadRecommadation() {
    let params: any = {
      module_name: "Job Offer Comparison Tool",
      file_name: "job_offer_comparison_tool",
      response: this.ComparisonResponse,
      inputString: this.userAnswers
    };
    this.promptService.responseBuilder(params);
  }


  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  selectedQuestion = "";
  selectedAnswer: any;
  customizedResponse: any;
  selectedQuestionId: any;
  readAnswer(quizdata: any) {
    this.selectedQuestion = quizdata?.ques;
    this.selectedAnswer = quizdata?.ans;
    this.selectedQuestionId = quizdata?.id;
    this.prepData.questionid = quizdata?.id;
    // this.service.getcustomizedResponse(this.prepData).subscribe(
    //   (response: any) => {
    //     this.customizedResponse = response;
    //     this.readanswerpopubVisibility = true;
    //   },
    //   (error) => {
    //     this.toast.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: "Something went wrong in Fetch customized Answer",
    //     });
    //     this.readanswerpopubVisibility = true;
    //   }
    // );
  }
  saveInterviewQuestion() {
    let paramData = {
      questionid: this.selectedQuestionId,
      ques: this.selectedQuestion,
      ans: this.selectedAnswer,
      customized_ans: this.customizedResponse,
      jobrole_id: this.prepData.jobrole,
    };
    this.service.saveInterviewQuestion(paramData).subscribe(
      (response) => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
      },
      (error) => {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      }
    );
  }
  savedClick() {
    //this.getSavedResponse();
    this.isSkeletonVisible = false;
    this.ComparisonResponseVisibility = false;
  }
  readResponse = false;
  savedresponseData: any;
  readSavedResponse(savedResponse: any) {
    this.savedresponseData = savedResponse;
    this.readResponse = true;
  }
}
