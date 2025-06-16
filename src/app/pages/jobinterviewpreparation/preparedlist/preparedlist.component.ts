import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
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
import { Meta } from "@angular/platform-browser";
import { SkeletonModule } from "primeng/skeleton";
import { SharedModule } from "src/app/shared/shared.module";
import { SavedJobInterviewQuestion } from "src/app/@Models/job-interview.model";
import { SocialShareService } from "src/app/shared/social-share.service";
import { DataService } from "src/app/data.service";
@Component({
  selector: "uni-preparedlist",
  templateUrl: "./preparedlist.component.html",
  styleUrls: ["./preparedlist.component.scss"],
  standalone: true,
  imports: [CommonModule, PaginatorModule, DialogModule, TabsModule, RouterModule, CardModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule],
  providers: [InterviewPreparationService]
})
export class JobPreparedListComponent implements OnInit {

  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();

  isSkeletonVisible: boolean = true;
  planExpired: boolean = false;
  page: number = 1;
  perpage: number = 25;
  totalDataCount: any;
  ListData: any[] = [];
  defaultListData: any[] = [];
  savedListData: SavedJobInterviewQuestion[] = [];
  selectedJobRole: any;
  readanswerpopubVisibility = false;
  isResponseSkeleton: boolean = false;
  selectedQuestion = "";
  selectedAnswer: any;
  customizedResponse: any;
  selectedQuestionId: any;
  tabValue: number = 0;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  constructor(private toast: MessageService, private authService: AuthService, private service: InterviewPreparationService,
    private pageFacade: PageFacadeService, private meta: Meta, private socialShareService: SocialShareService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.selectedJobRole = this.prepData.role;
    if (!this.prepData?.isFromHistory) {
      this.getDefaultQuestions();
    }
    this.getSavedQuestion();
  }

  getDefaultQuestions() {
    this.service.getquestionByJobrole({ jobrole: this.prepData.jobrole }).subscribe(response => {
      this.defaultListData = response;
      this.ListData = response;
      this.totalDataCount = this.ListData.length;
      this.isSkeletonVisible = false;
      if (this.prepData.questionid) {
        const quiz = this.ListData.find(item => item.id == this.prepData.questionid);
        if (quiz) {
          this.readAnswer(quiz);
        }
      }
    });
  }

  getSavedQuestion() {
    this.service.getsavedquestionByJobrole({ jobrole: this.prepData.jobrole }).subscribe(response => {
      this.savedListData = response;
      if (this.prepData.isFromHistory) {
        this.isSkeletonVisible = false;
        this.changeType(1);
      }
    });
  }

  backtoMain() {
    this.windowChange.emit(false);
  }

  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  readAnswer(quizdata: any) {
    this.customizedResponse = '';
    this.selectedQuestion = quizdata?.ques;
    this.selectedAnswer = quizdata?.ans;
    this.selectedQuestionId = quizdata?.id;
    this.prepData.questionid = quizdata?.id;
    this.readanswerpopubVisibility = true;
    if (quizdata?.customized_ans) {
      this.customizedResponse = quizdata?.customized_ans;
      return;
    }
    this.isResponseSkeleton = true;
    this.service.getcustomizedResponse(this.prepData).subscribe({
      next: response => {
        this.isResponseSkeleton = false;
        this.customizedResponse = response;
      },
      error: error => {
        this.toast.add({ severity: "error", summary: "Error", detail: "Something went wrong in Fetch customized Answer" });
        this.readanswerpopubVisibility = true;
        this.isResponseSkeleton = false;
      }
    });
  }
  saveInterviewQuestion() {
    if (this.savedListData.some(item => item?.ques === this.selectedQuestion)) {
      this.toast.add({ severity: "warn", summary: "Warning", detail: "This question has already been saved." });
      return;
    }
    let paramData = {
      questionid: this.selectedQuestionId,
      ques: this.selectedQuestion,
      ans: this.selectedAnswer,
      customized_ans: this.customizedResponse,
      jobrole_id: this.prepData.jobrole,
    };
    this.service.saveInterviewQuestion(paramData).subscribe({
      next: response => {
        this.toast.add({ severity: "success", summary: "Success", detail: response.message });
        this.readanswerpopubVisibility = false;
        this.getSavedQuestion();
      },
      error: error => {
        this.toast.add({ severity: "error", summary: "Error", detail: error.message });
      }
    });
  }
  changeType(event: any) {
    this.tabValue = event;
    if (this.tabValue == 0) {
      this.ListData = this.defaultListData;
    } else {
      this.ListData = this.savedListData;
    }
    this.totalDataCount = this.ListData.length;
  }

  onShowModal(value: any) {
    let socialShare = document.getElementById("socialSharingList") as HTMLDivElement;
    socialShare.style.display = "none";
  }

  showSocialSharingList() {
    let socialShare = document.getElementById("socialSharingList") as HTMLDivElement;
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const safeUrl = encodeURI(window.location.origin + '/pages/interviewprep');
    const params = new URLSearchParams();
    Object.keys(this.prepData).forEach(key => {
      params.append(key, this.prepData[key]);
    });
    const url = `${safeUrl}?${params.toString()}`;
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const safeUrl = encodeURI(window.location.origin + '/pages/interviewprep');
    const params = new URLSearchParams();
    Object.keys(this.prepData).forEach(key => {
      params.append(key, this.prepData[key]);
    });
    const textToCopy = `${safeUrl}?${params.toString()}`;
    this.socialShareService.copyQuestion(textToCopy);
  }

  openReport() {
    let data: any = {
      isVisible: true,
      moduleId: 32,
      questionId: this.prepData.questionid
    };
    this.dataService.openReportWindow(data);
  }
}
