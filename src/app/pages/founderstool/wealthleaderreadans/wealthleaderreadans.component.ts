import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';
import { Meta } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { StorageService } from "../../../services/storage.service";
import { SocialShareService } from 'src/app/services/social-share.service';
@Component({
  selector: 'uni-wealthleaderreadans',
  templateUrl: './wealthleaderreadans.component.html',
  styleUrls: ['./wealthleaderreadans.component.scss'],
  standalone: true,
  imports: [FormsModule, TooltipModule, InputIconModule, ReactiveFormsModule, PaginatorModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class WealthleaderreadansComponent implements OnInit {
  wealthleadersname: any;
  perpage: number = 50;
  pageno: number = 1;
  totalcount: number = 0;
  leaderId: any;
  wealthleadersqueslist: any[] = [];
  isQuestionAnswerVisible: boolean = false;
  wealthleaderanswer: any = [];
  constructor(private router: Router, private pageFacade: PageFacadeService,
    private service: FounderstoolService, private route: ActivatedRoute, private meta: Meta,
    private dataService: DataService, private storage: StorageService, private socialShareService: SocialShareService
  ) { }
  ngOnInit(): void {
    this.wealthleadersname = this.storage.get("wealthleadersname")
    this.leaderId = this.route.snapshot.paramMap.get('id');
    const questionId = this.route.snapshot.paramMap.get('questionId');
    if (questionId) {
      this.seeAnswer(questionId)
    }
    this.getWealthLeaders();
  }
  goBack() {
    let countryId = this.route.snapshot.queryParamMap.get('country');
    let searchText = this.route.snapshot.queryParamMap.get('search');
    this.router.navigate(['/pages/education-tools/wealthleaderslist'], { queryParams: { country: countryId, search: searchText } });
  }
  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("wealth-leaders");
  }
  answerid: any;
  seeAnswer(id: any) {
    this.answerid = id
    var data = {
      questionid: id
    }
    this.service.wealthLeadersans(data).subscribe((res: any) => {
      this.wealthleaderanswer = res.data;
      this.wealthleadersname = res.data[0].wealth_leader_name;
      this.isQuestionAnswerVisible = true;
    })
  }
  getWealthLeaders() {
    var data = {
      page: this.pageno,
      perPage: this.perpage,
      wealth_leader_id: this.leaderId,
    }
    this.service.wealthLeadersquestion(data).subscribe((res) => {
      this.wealthleadersqueslist = res.data;
      this.totalcount = res.total_count;
    })
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
    const url = encodeURI(window.location.origin + '/pages/education-tools/wealthleaderreadanswer/' + this.leaderId + '/' + this.answerid);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/education-tools/wealthleaderreadanswer/' + this.leaderId + '/' + this.answerid);
    this.socialShareService.copyQuestion(textToCopy);
  }

  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }
  paginate(event: any) {
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    this.getWealthLeaders();
  }
  openReport() {
    let data: any = {
      isVisible: true,
      moduleId: 24,
      questionId: this.answerid,
      // countryId:this.countryId,
    };
    this.dataService.openReportWindow(data);
  }

  onShowModal(value: any) {
    let socialShare: any = document.getElementById("socialSharingList");
    socialShare.style.display = "none";
  }
}
