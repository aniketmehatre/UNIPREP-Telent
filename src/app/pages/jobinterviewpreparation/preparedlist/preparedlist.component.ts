import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../Auth/auth.service";
import { PageFacadeService } from "../../page-facade.service";
import { InterviewPreparationService } from "../interviewpreparation.service";

@Component({
  selector: "uni-preparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
})
export class JobPreparedListComponent implements OnInit {
  isSkeletonVisible: boolean = true;
  planExpired: boolean = false;
  restrict: boolean = false;
  page: number = 1;
  perpage: number = 25;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  totalDataCount: any;
  ListData: any = [];
  selectedJobRole: any;
  @Input() prepData: any;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  readanswerpopubVisibility = false;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toast: MessageService,
    private authService: AuthService,
    private service: InterviewPreparationService,
    private router: Router,
    private pageFacade: PageFacadeService
  ) {}
  ngOnInit(): void {
    this.selectedJobRole = this.prepData.role;
    this.service
      .getquestionByJobrole({
        jobrole: this.prepData.jobrole,
      })
      .subscribe((response: any) => {
        this.isSkeletonVisible = false;
        this.ListData = response;
        this.totalDataCount = this.ListData.length;
      });
    this.checkPlanExpiry();
    this.imagewhitlabeldomainname = window.location.hostname;
    this.ehitlabelIsShow = [
      "dev-student.uniprep.ai",
      "uniprep.ai",
      "localhost",
    ].includes(this.imagewhitlabeldomainname);
  }

  resetRecommendation() {}
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
  customizedResponse:any;
  readAnswer(quizdata: any) {
    this.selectedQuestion = quizdata?.ques;
    this.selectedAnswer = quizdata?.ans;
    this.service
      .getcustomizedResponse(this.prepData)
      .subscribe((response: any) => {
        this.customizedResponse=response;
        this.readanswerpopubVisibility = true;
      });
  }
}
