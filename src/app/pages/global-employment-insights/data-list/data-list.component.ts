import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { MenuItem, MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { PageFacadeService } from "../../page-facade.service";
import { AuthService } from "src/app/Auth/auth.service";
import { Meta } from "@angular/platform-browser";
import { GlobalEmploymentService } from "../global-employment-insights.service";
import { DataService } from "src/app/services/data.service";
import { SocialShareService } from "src/app/services/social-share.service";

@Component({
  selector: "uni-global-employment-data-list",
  templateUrl: "./data-list.component.html",
  styleUrls: ["./data-list.component.scss"],
  standalone: false
})
export class GlobalEmploymentDataListComponent implements OnInit {
  isSkeletonVisible: boolean = true;
  isQuestionAnswerVisible: boolean = false;
  planExpired: boolean = false;
  restrict: boolean = false;
  page: number = 1;
  perpage: number = 50;
  totalDataCount: any = 0;
  ListData: any = [];
  selectedQuestionData: any;
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toast: MessageService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private authService: AuthService,
    private meta: Meta,
    private service: GlobalEmploymentService,
    private dataService: DataService,
    private socialShareService: SocialShareService
  ) { }

  ngOnInit(): void {
    this.getList();
    this.checkPlanExpiry();

  }
  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }
  module_id: any;
  getList() {
    this.service
      .getdata({
        country_id: this.prepData.country_id,
        page: this.page,
        perpage: this.perpage,
        question_id: this.prepData?.question_id
      })
      .subscribe((response: any) => {
        this.ListData = response.data;
        this.module_id = response.module_id;
        this.totalDataCount = response.totalcount;
        this.isSkeletonVisible = false;
        if (this.prepData?.question_id) {
          this.prepData = { ...this.prepData, country: this.ListData[0].country_name };
          this.readAnswer(this.ListData[0]);
        }
      });
  }
  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }
  backtoMain() {
    this.windowChange.emit({ stage: 1 });
  }
  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.getList();
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

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("global-employment-insights");
  }

  showSocialSharingList() {
    let socialShare: any = document.getElementById("socialSharingList");
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    } else {
      socialShare.style.display =
        socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = encodeURI(window.location.origin + '/pages/global-employment-insights/' + this.prepData.country_id + '/' + this.selectedQuestionData?.id);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/global-employment-insights/' + this.prepData.country_id + '/' + this.selectedQuestionData?.id);
    this.socialShareService.copyQuestion(textToCopy);
  }

  readAnswer(selectedData: any) {
    this.selectedQuestionData = selectedData;
    this.isQuestionAnswerVisible = true;
  }
  getContentPreview(content: string): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 75 ? plainText.slice(0, 75) + ' ...' : plainText;

  }
  openReport() {
    let data: any = {
      isVisible: true,
      moduleId: this.module_id,
      questionId: this.selectedQuestionData?.id,
      countryId: this.selectedQuestionData.country_id,
    };
    this.dataService.openReportWindow(data);
  }
}
