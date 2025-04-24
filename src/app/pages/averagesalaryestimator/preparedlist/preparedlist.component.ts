import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../Auth/auth.service";
import { PageFacadeService } from "../../page-facade.service";
import { AveragesalaryestimatorService } from "../averagesalaryestimator.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from "../../prompt.service";
import { SkeletonModule } from "primeng/skeleton";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "uni-aspreparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule, PdfViewerModule, TabViewModule, RouterModule, CardModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule],
  providers: [MessageService, AveragesalaryestimatorService]
})
export class AverageSalaryPreparedListComponent implements OnInit {
  isSkeletonVisible: boolean = true;
  planExpired: boolean = false;
  restrict: boolean = false;
  page: number = 1;
  perpage: number = 25;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  totalDataCount: any = 0;
  ListData: any = [];
  EstimateResponse: SafeHtml;
  EstimateResponseVisibility = true;
  selectedJobRole: any;
  aiCreditCount: number = 0;
  userInputs: any;

  @Input() prepData: any;
  @Input() recommendationsData: { id: number, question: string }[];
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  readanswerpopubVisibility = false;
  constructor(
    private toast: MessageService,
    private authService: AuthService,
    private service: AveragesalaryestimatorService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private sanitizer: DomSanitizer,
    private promptService: PromptService
  ) { }
  ngOnInit(): void {
    this.userInputs = {
      role: this?.prepData?.role,
      location_name: this?.prepData?.location_name,
      workplace_type_name: this?.prepData?.workplace_type_name,
      worktype_name: this?.prepData?.worktype_name,
      experience: this?.prepData?.experience,
    }
    this.selectedJobRole = this?.prepData?.role;
    this.aiCreditCount = this.prepData.aiCredit;
    this.getEstimateResponse();
    this.getSavedResponse();
    this.checkPlanExpiry();
    this.imagewhitlabeldomainname = window.location.hostname;
    this.ehitlabelIsShow = [
      "*.uniprep.ai",
      "dev-student.uniprep.ai",
      "uniprep.ai",
      "localhost",
    ].includes(this.imagewhitlabeldomainname);
  }
  saveRoleResponse() {
    this.service
      .saveResponseByJobrole({
        jobrole: this.prepData.jobrole,
        answer: this.EstimateResponse,
      })
      .subscribe((response: any) => {
        this.isSkeletonVisible = false;
        this.ListData = response;
        this.totalDataCount = this.ListData.length;
      });
  }
  getAICreditCount(){
    this.promptService.getAicredits().subscribe({
      next: resp =>{
        this.aiCreditCount = resp;
      }
    })
  }
  downloadRecommadation() {
    let addingInput: string = '';
    this.recommendationsData.forEach(values => {
      addingInput += `<p style="color: #3f4c83;"><strong>${values.question}</strong></p>`;
      let currentAnswer = "";
      if (values.id == 1) {
        currentAnswer = this.userInputs.role;
      } else if (values.id == 2) {
        if (this.userInputs.experience === 1) {
          currentAnswer = " Fresher";
        } else {
          currentAnswer = `${this.userInputs.experience} ${this.userInputs.experience === 1 ? "Year" : "Years"}`;
        }
      } else if (values.id == 3) {
        currentAnswer = this.userInputs.worktype_name;
      } else if (values.id == 4) {
        currentAnswer = this.userInputs.location_name;
      } else if (values.id == 5) {
        currentAnswer = this.userInputs.workplace_type_name;
      } else if (values.id == 6) {
        currentAnswer = this.userInputs.currency;
      }
      addingInput += `<p>${currentAnswer}</p><br>`;
    });
    let params: any = {
      module_name: "Average Salary Estimator",
      file_name: "average_salary_estimator",
      response: this.EstimateResponse,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }

  getEstimateResponse() {
    this.service.getestimates(this.prepData).subscribe((response: any) => {
      this.EstimateResponse = this.sanitizer.bypassSecurityTrustHtml(response?.data);
      this.getAICreditCount();
      this.EstimateResponseVisibility = true;
      this.isSkeletonVisible = false;
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
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      const data = res.time_left;
      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    });
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  clearRestriction() {
    this.restrict = false;
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
    this.service.getcustomizedResponse(this.prepData).subscribe(
      (response: any) => {
        this.customizedResponse = response;
        this.readanswerpopubVisibility = true;
      },
      (error) => {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong in Fetch customized Answer",
        });
        this.readanswerpopubVisibility = true;
      }
    );
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
        this.readanswerpopubVisibility = false;
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

  readResponse = false;
  savedresponseData: any;
  readSavedResponse(savedResponse: any) {
    const encodedJson = savedResponse.user_inputs;
		const decodedInput = JSON.parse(encodedJson);
		this.userInputs = decodedInput;
    this.savedresponseData = savedResponse;
    this.EstimateResponse = savedResponse.answer;
    this.readResponse = true;
  }

  saveRecommadation(){
    this.getSavedResponse();
    this.EstimateResponseVisibility = false;
  }
}
