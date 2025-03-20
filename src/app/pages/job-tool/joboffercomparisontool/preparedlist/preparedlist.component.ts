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
import {PdfViewerModule} from "ng2-pdf-viewer";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from "src/app/pages/travel-tools/travel-tools.service";

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
  restrict: boolean = false;
  page: number = 1;
  perpage: number = 25;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  totalDataCount: any = 0;
  ListData: any = [];
  ComparisonResponse: SafeHtml;
  ComparisonResponseVisibility = true;
  userAnswers:any = [];
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
    private travelService: TravelToolsService
  ) {}
  ngOnInit(): void {
    this.getjobofferResponse();
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
    this.service.getcomparisonResponse(this.prepData).subscribe((response: any) => {
        let chatGptResponse = response.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
				this.ComparisonResponse = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
        this.ComparisonResponseVisibility = true;
        this.isSkeletonVisible = false;
        this.userAnswers = response.questions;
        this.userAnswers = this.userAnswers
            .replace(/####/g, '<br>').replace(/- \*\*/g, '<br>**');
      }, (error: any) =>{
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
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      const data = res.time_left;
      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    });
  }
  
  downloadRecommadation(){
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;page-break-before: auto;">
    <div style="text-align: center;">
      <h2 style="margin: 0; color: #1a237e;">Job Offer Comparison Between ${ this.selectedCompanies }</h2>
    </div></div><p><strong>Input:<br></strong></p> ${ this.userAnswers }<div class="divider"></div><p><strong>Response</strong></p><br> ${this.ComparisonResponse}`;
    let finalRecommendation = addingInput
    .replace(/```html|```/g, '')
    .replace(/\*\*(.*?)\*\*/g, '<p style="color: #d32f2f;" ><strong>$1</strong></p>')
    .replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
    .replace(/SafeValue must use \[property\]=binding:/g, '')
    .replace(/class="container"/g, 'style="line-height:1.9"'); //because if i add container the margin will increase so i removed the container now the spacing is proper.
    let paramsData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Job Offer Comparison Tool",
      file_name: "job_offer_comparison_tool"
    }
    this.travelService.convertHTMLtoPDF(paramsData).then(() =>{
      console.log('PDF Download Successfully.');
    }).catch(error => {
      console.error("PDF having some issue",error);
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
