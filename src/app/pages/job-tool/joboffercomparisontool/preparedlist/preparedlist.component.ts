import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../Auth/auth.service";
import { PageFacadeService } from "../../../page-facade.service";
import { JobOfferComparisionService } from "../joboffercomparison.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
@Component({
  selector: "uni-jopreparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule]
})
export class JobOfferPreparedListComponent implements OnInit {
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
  ComparisonResponse: any;
  ComparisonResponseVisibility = true;
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toast: MessageService,
    private authService: AuthService,
    private service: JobOfferComparisionService,
    private router: Router,
    private pageFacade: PageFacadeService
  ) {}
  ngOnInit(): void {
    this.getjobofferResponse();
    this.getSavedResponse();
    this.checkPlanExpiry();
    this.imagewhitlabeldomainname = window.location.hostname;
    this.ehitlabelIsShow = [
      "dev-student.uniprep.ai",
      "uniprep.ai",
      "localhost",
    ].includes(this.imagewhitlabeldomainname);
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
    this.selectedCompanies=this.prepData.jobs.map((data:any)=>data.company).join(' and ');
    this.service
      .getcomparisonResponse(this.prepData)
      .subscribe((response: any) => {
        this.ComparisonResponse = response;
        this.ComparisonResponseVisibility = true;
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
    this.isSkeletonVisible=false;
    this.ComparisonResponseVisibility = false;
  }
  readResponse = false;
  savedresponseData: any;
  readSavedResponse(savedResponse: any) {
    this.savedresponseData = savedResponse;
    this.readResponse = true;
  }
}
