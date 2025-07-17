import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { Router, RouterModule } from '@angular/router';
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
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { PageFacadeService } from '../../page-facade.service';
import { Location } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { SocialShareService } from 'src/app/services/social-share.service';

export interface Politician {
  name: string;
  country: string;
  occupation: string;
  description: string;
  imageUrl: string;
  flag: string;
}

@Component({
  selector: 'uni-politician-insights',
  templateUrl: './politician-insights.component.html',
  styleUrls: ['./politician-insights.component.scss'],
  standalone: true,
  imports: [PaginatorModule, SkeletonModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, 
    RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class PoliticianInsightsComponent implements OnInit {
  countrylist: any[] = [];
  isShowCountryData: boolean = false;
  isShowCountryQuesAns: boolean = false;
  questuionanswerlist: any[] = [];
  isQuestionAnswerVisible: boolean = false;
  dataanswerquestion: any;
  countryId: any;
  politicianId: any;
  totalPolitician: number = 0;
  politicians: Politician[] = [];
  isSkeletonVisible: boolean = false;
  isShowPoliticians: boolean = false;
  countryName: string = '';
  page: number = 1;
  pageSize: number = 10;
  first: number = 0;
  politicianNamesList: { id: number, name: string }[] = [];
  politicianOccupationList: { id: number, occupation: string }[] = [];
  selectedPolitician: string[] | null = [];
  selectedOccupation: string[] | null = [];
  questionId: number = 0;

  constructor(
    private pageFacade: PageFacadeService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private meta: Meta,
    private router: Router,
    private educationToolService: EducationToolsService,
    private location: Location,
    private authService: AuthService,
    private socialShareService: SocialShareService
  ) { }

  ngOnInit(): void {
    this.educationToolService.getPoliticianCountryList().subscribe((res: any) => {
      this.countrylist = res.countries;
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['countryId'] && params['politicianId']) {
        this.isShowCountryQuesAns = true;
        this.isShowCountryData = false;
        this.isShowPoliticians = false;
        this.countryId = Number(params['countryId']);
        this.politicianId = Number(params['politicianId']);
        this.questionId = Number(params['questionId']);
        this.getQuestionList(this.countryId, this.politicianId);
      }
      else if (params['countryId']) {
        this.isShowPoliticians = true;
        this.isShowCountryData = false;
        this.countryId = params['countryId'];
        this.getPoliticianList(params['countryId']);
        this.getPoliticianDropDownList();
      } else {
        this.isShowCountryQuesAns = false;
        this.isShowCountryData = true;
      }
    });
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("politician-insights");
  }

  get getCountryName() {
    const data = this.countrylist.find((item) => item.id == this.countryId);
    return data.country;
  }

  goBack() {
    if (this.isShowCountryData) {
      this.router.navigate(["/pages/education-tools"]);
    } else {
      this.location.back();
    }
    // else if (this.isShowPoliticians) {
    //   this.router.navigate(["/pages/education-tools/politician-insights", this.countryId]);
    // }
    // else if (this.isShowCountryQuesAns) {
    //   this.router.navigate(["/pages/education-tools/politician-insights", this.countryId, this.politicianId]);
    // }
  }

  showDatas(data: any) {
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.countryName = data?.country;
    this.politicians = [];
    this.router.navigate(['/pages/education-tools/politician-insights', data.id]);
  }

  showQuestionDatas(data: any) {
    this.questuionanswerlist = [];
    this.router.navigate(['/pages/education-tools/politician-insights', this.countryId, data]);
  }

  getQuestionList(id: any, politicianId: number) {
    this.isSkeletonVisible = true;
    const datas: any = {
      politician_id: politicianId
    };
    if (this.questionId) {
      datas.question_id = this.questionId;
    }
    this.educationToolService.getQuestionsListByPolitician(datas).subscribe(
      (res: any) => {
        this.isShowCountryData = false;
        this.isShowPoliticians = false;
        this.isShowCountryQuesAns = true;
        this.questuionanswerlist = res.politicianquestions;
        this.isSkeletonVisible = false;
        if (this.questionId) {
          this.showDataAnswer(res?.politicianquestions?.[0]);
        }
      },
      (error) => {
        console.error("Error fetching question data:", error);
        this.isShowCountryData = true;
      }
    );
  }

  getPoliticianDropDownList() {
    this.educationToolService.getPoliticianDropDownList(this.countryId).subscribe({
      next: response => {
        this.politicianNamesList = response?.politicians;
        this.politicianOccupationList = response?.occupations;
      },
      error: error => {
        console.error(error);
      }
    })
  }

  getPoliticianList(id: any) {
    this.isSkeletonVisible = true;
    const datas: any = {
      country: this.countryId,
      page: this.page,
      perpage: this.pageSize,
      politician_id: this.selectedPolitician ?? null,
      politician_occupation: this.selectedOccupation ?? null,
    };
    this.educationToolService.getPoliticiansListByCountry(datas).subscribe(
      (res: any) => {
        this.isShowCountryData = false;
        this.isShowPoliticians = true;
        this.isShowCountryQuesAns = false;
        this.politicians = res.politicians;
        this.totalPolitician = res.totalpoliticians;
        this.isSkeletonVisible = false;
      },
      (error) => {
        console.error("Error fetching question data:", error);
        this.isShowCountryData = true;
      }
    );
  }

  showDataAnswer(data: any) {
    this.dataanswerquestion = data;
    this.isQuestionAnswerVisible = true;
  }

  goToHome(data: any) {
    this.isQuestionAnswerVisible = false;
  }

  openReport() {
    const data = {
      isVisible: true,
      questionId: this.dataanswerquestion?.id,
      countryId: this.countryId,
    };
    this.dataService.openReportWindow(data);
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

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = encodeURI(window.location.origin + '/pages/education-tools/politician-insights/' + this.countryId + '/' + this.politicianId + '/' + this.dataanswerquestion?.id);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/education-tools/politician-insights/' + this.countryId + '/' + this.politicianId + '/' + this.dataanswerquestion?.id);
    this.socialShareService.copyQuestion(textToCopy);
  }

  getContentPreview(content: string): string {
    return content.length > 75 ? content.slice(0, 75) + ' ...' : content;
  }

  pageChange(event: any) {
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.isShowPoliticians ? this.getPoliticianList(this.countryId) : this.getQuestionList(this.countryId, this.politicianId);
  }

}
