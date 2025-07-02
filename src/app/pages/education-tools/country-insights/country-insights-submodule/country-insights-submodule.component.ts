import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../../education-tools.service';
import { QuestionsList } from 'src/app/@Models/country-insights.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { StorageService } from "../../../../storage.service";
import { PaginatorModule } from 'primeng/paginator';
import { DataService } from 'src/app/data.service';
import { SocialShareService } from 'src/app/shared/social-share.service';
import { PageFacadeService } from 'src/app/pages/page-facade.service';
@Component({
  selector: 'uni-country-insights-submodule',
  templateUrl: './country-insights-submodule.component.html',
  styleUrls: ['./country-insights-submodule.component.scss'],
  standalone: true,
  imports: [DialogModule, FormsModule, ReactiveFormsModule, PaginatorModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class CountryInsightsSubmoduleComponent implements OnInit {
  questionsList: QuestionsList[] = [];
  first = 0;
  page = 1;
  pageSize = 25;
  moduleId: number = 0;
  countryId: number = 0;
  questionModal: boolean = false;
  questionDetail: any;
  totalQuizCount: number = 0;
  selectedIndex: number = 0;
  countryname: string = '';
  isSkeletonVisible: boolean = false;
  questionId: number = 0;

  constructor(private educationToolService: EducationToolsService, private route: ActivatedRoute, private meta: Meta,
    private storage: StorageService, private dataService: DataService, private socialShareService: SocialShareService,
  private pageFacade: PageFacadeService) {

  }

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get("id"));
    this.countryId = Number(this.route.snapshot.paramMap.get("countryId"));
    this.questionId = Number(this.route.snapshot.paramMap.get("questionId"));
    this.countryname = this.storage.get('country_insights_country_name') || '';
    this.getQuizQuestionData();
  }

  getQuizQuestionData() {
    this.isSkeletonVisible = true;
    this.questionsList = [];
    let req: any = {
      module_id: this.moduleId,
      page: this.page,
      perpage: this.pageSize,
      country: this.countryId,
    }
    if (this.questionId) {
      req.question_id = this.questionId;
    }
    this.educationToolService.getQuizQuestion(req).subscribe(data => {
      this.questionsList = data?.questions;
      this.totalQuizCount = data.count;
      this.isSkeletonVisible = false;
      if (this.questionId) {
        this.countryname = this.questionsList[0].country_name;
        this.viewModal(this.questionsList[0]);
      }
    })

  }

  openReport() {
    const data = {
      isVisible: true,
      moduleId: this.moduleId,
      questionId: this.questionDetail?.id,
      countryId: this.countryId,
    };
    this.dataService.openReportWindow(data);
  }

  closeModal() {
    this.questionDetail = null;
    this.questionModal = false;
  }

  viewModal(data: QuestionsList) {
    this.questionDetail = data;
    this.questionModal = true;
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }

  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList")
    socialShare.style.display = "none"
  }

  showSocialSharingList(index: any): void {
    let socialShare: any = document.getElementById("socialSharingList");
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = encodeURI(window.location.origin + '/pages/education-tools/country-insights/' + this.moduleId + '/' + this.countryId + '/' + this.questionDetail?.id);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/education-tools/country-insights/' + this.moduleId + '/' + this.countryId + '/' + this.questionDetail?.id);
    this.socialShareService.copyQuestion(textToCopy);
  }

  paginate(event: any) {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.getQuizQuestionData();
  }

   openVideoPopup(){
    this.pageFacade.openHowitWorksVideoPopup("country-insights");
  }
}
