import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../Auth/auth.service";
import { PageFacadeService } from "../../page-facade.service";
import { InterviewPreparationService } from "../interviewpreparation.service";
import { CommonModule } from "@angular/common";
import { PaginatorModule } from "primeng/paginator";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TabsModule } from "primeng/tabs";
@Component({
  selector: "uni-preparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
  standalone: true,
  imports: [CommonModule, PaginatorModule, DialogModule,TabsModule, RouterModule, CardModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
  providers: [MessageService,InterviewPreparationService]
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
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  readanswerpopubVisibility = false;
  constructor(private location: Location, private route: ActivatedRoute, private toast: MessageService, private authService: AuthService, private service: InterviewPreparationService, private router: Router, private pageFacade: PageFacadeService) {}
  ngOnInit(): void {
    this.selectedJobRole = this.prepData.role;
    this.getDefaultQuestions();
    this.checkPlanExpiry();
    this.imagewhitlabeldomainname = window.location.hostname;
    this.ehitlabelIsShow = ["*.uniprep.ai","dev-student.uniprep.ai", "uniprep.ai", "localhost"].includes(this.imagewhitlabeldomainname);
  }
  getDefaultQuestions() {
    this.service
      .getquestionByJobrole({
        jobrole: this.prepData.jobrole,
      })
      .subscribe((response: any) => {
        this.isSkeletonVisible = false;
        this.ListData = response;
        this.totalDataCount = this.ListData.length;
      });
  }
  getSavedQuestion() {
    this.service
      .getsavedquestionByJobrole({
        jobrole: this.prepData.jobrole,
      })
      .subscribe((response: any) => {
        this.isSkeletonVisible = false;
        this.ListData = response;
        this.totalDataCount = this.ListData.length;
      });
  }
  backtoMain() {
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
    let tabIndex = event;
    if (tabIndex == 0) {
      this.getDefaultQuestions();
    } else {
      this.getSavedQuestion();
    }
  }

  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }

  showSocialSharingList() {
    let socialShare: any = document.getElementById("socialSharingList");
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareViaWhatsapp() {
    // let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    // this.meta.updateTag({ property: 'og:url', content: url });
    // const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
  }

  shareViaInstagram() {
    // let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    // this.meta.updateTag({ property: 'og:url', content: url });
    // const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
  }

  shareViaFacebook() {
    // let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    // this.meta.updateTag({ property: 'og:url', content: url });
    // const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
  }

  shareViaLinkedIn() {
    // let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    // this.meta.updateTag({ property: 'og:url', content: url });
    // const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
  }

  shareViaTwitter() {
    // let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    // this.meta.updateTag({ property: 'og:url', content: url });
    // const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
  }

  shareViaMail() {
    // let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    // this.meta.updateTag({ property: 'og:url', content: url });
    // const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    // window.open(shareUrl, '_blank');
  }

  copyLink() {
    // const safeUrl = encodeURI(window.location.href);
    // const selectedDegreeId = this.selectedQuestionData?.degree_id || '';
    // const selectedCourseId = this.selectedQuestionData?.course_id || '';
    // const selectedQuestionId = this.selectedQuestionData?.id || '';
    // const textToCopy = `${safeUrl}/${selectedDegreeId}/${selectedCourseId}/${selectedQuestionId}`;
    // navigator.clipboard.writeText(textToCopy)
    //   .then(() => {
    //     this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
    //   })
    //   .catch((err) => {
    //     this.toast.add({ severity: "error", summary: "Warning", detail: 'Failed to copy the question' });
    //     console.error('Failed to copy text: ', err);
    //   });
  }
  
  openReport() {

  }
}
