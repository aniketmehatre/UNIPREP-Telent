import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import { Meta } from "@angular/platform-browser";
import { FortuneCompaniesService } from "../fortune-companies.service";
import { DataService } from "src/app/services/data.service";
import { SocialShareService } from "src/app/services/social-share.service";

@Component({
  selector: "uni-fortune-companies-data-list",
  templateUrl: "./data-list.component.html",
  styleUrls: ["./data-list.component.scss"],
  standalone: false,
})
export class FortuneCompaniesdataListsComponent implements OnInit {
  isSkeletonVisible: boolean = true;
  isQuestionAnswerVisible: boolean = false;
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
  module_id: any;
  SelectedCompany: any;
  selectedQuestion = "";
  selectedAnswer: any;
  customizedResponse: any;
  selectedQuestionId: any;

  constructor(
    private pageFacade: PageFacadeService,
    private meta: Meta,
    private service: FortuneCompaniesService,
    private dataService: DataService,
    private socialShareService: SocialShareService
  ) { }

  ngOnInit(): void {
    this.SelectedCompany = this.prepData.companyName;
    this.getList();
  }

  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }

  getList() {
    let data = {
       fortune_company_id: this.prepData.fortune_company_id,
        page: this.page,
        perpage: this.perpage,
        question_id:this.prepData.question_id
    }
    this.service.getfortunecompanyquestions(data).subscribe((response: any) => {
        this.ListData = response.data;
        this.module_id = response.module_id;
        this.totalDataCount = response.total_count;
        this.isSkeletonVisible = false;
        if(this.prepData.question_id){
          this.prepData.companyName = this.ListData[0].company_name;
          this.readSavedResponse(this.ListData[0]);
        }
      });
  }

  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }

  backtoMain() {
    this.windowChange.emit({
      stage: 1,
      countryId: this.prepData.countryId,
      searchText: this.prepData.searchText
    });
  }

  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.getList();
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
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
    const url = encodeURI(window.location.origin + '/pages/fortune-companies/' + this.prepData.fortune_company_id + '/' + this.selectedQuestionData?.id);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/fortune-companies/' + this.prepData.fortune_company_id + '/' + this.selectedQuestionData?.id);
    this.socialShareService.copyQuestion(textToCopy);
  }

  readSavedResponse(selectedData: any) {
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
