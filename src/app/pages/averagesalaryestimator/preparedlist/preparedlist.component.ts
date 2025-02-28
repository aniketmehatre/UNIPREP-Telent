import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../Auth/auth.service";
import { PageFacadeService } from "../../page-facade.service";
import { AveragesalaryestimatorService } from "../averagesalaryestimator.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { SidebarModule } from "primeng/sidebar"
import { PdfJsViewerModule } from "ng2-pdfjs-viewer"
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
import { TravelToolsService } from "../../travel-tools/travel-tools.service";
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';

@Component({
  selector: "uni-aspreparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule,PdfJsViewerModule, TabViewModule, RouterModule, CardModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
  providers: [MessageService,AveragesalaryestimatorService]
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
  EstimateResponse: any;
  EstimateResponseVisibility = true;
  selectedJobRole: any;
  @Input() prepData: any;
  @Input() recommendationsData: {id: number, question: string}[];
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  readanswerpopubVisibility = false;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toast: MessageService,
    private authService: AuthService,
    private service: AveragesalaryestimatorService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private travelService: TravelToolsService
  ) {}
  ngOnInit(): void {
    this.selectedJobRole = this?.prepData?.role;
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
  downloadRecommendation(){
    let addingInput = `<p><strong>Input:<br></strong></p>`;
    this.recommendationsData.forEach(values =>{
      addingInput += `<p><strong>${values.question}</strong></p>`;
      let currentAnswer = "";
      if(values.id == 1){
        currentAnswer = this.prepData.role;
      }else if(values.id == 2){
        currentAnswer = this.prepData.experience+ " Years";
      }else if(values.id == 3){
        currentAnswer = this.prepData.worktype_name;
      }else if(values.id == 4){
        currentAnswer = this.prepData.location_name;
      }else if(values.id == 5){
        currentAnswer = this.prepData.workplace_type_name;
      }else if(values.id == 6){
        currentAnswer = this.prepData.currency;
      }
      addingInput += `<p>${currentAnswer}</p><br>`;
    });
    let finalRecommendation = addingInput+ '<p><strong>Response:<br></strong></p>' + this.EstimateResponse;
    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Average Salary Estimator",
      file_name: "average_salary_estimator"
    };

    this.travelService.convertHTMLtoPDF(paramData).then(() =>{
      console.log("PDF genrated Successfully.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    })
  }
  getEstimateResponse() {
    this.service.getestimates(this.prepData).subscribe((response: any) => {
      this.EstimateResponse = response?.data;
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
    if(this.readResponse){
      this.readResponse=false;
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
  changeType(event: any) {
    let tabIndex = event.index;
    if (tabIndex == 0) {
      this.getEstimateResponse();
      this.EstimateResponseVisibility = true;
    } else {
      this.getSavedResponse();
      this.EstimateResponseVisibility = false;
    }
  }
  readResponse = false;
  savedresponseData: any;
  readSavedResponse(savedResponse: any) {
    this.savedresponseData = savedResponse;
    this.readResponse=true;
  }
}
