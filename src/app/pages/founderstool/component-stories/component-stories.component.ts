import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../../page-facade.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LocationService } from 'src/app/location.service';
import { FounderstoolService } from '../founderstool.service';
import { MessageService } from 'primeng/api';
import { Meta } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { AuthService } from 'src/app/Auth/auth.service';
@Component({
  selector: 'uni-component-stories',
  templateUrl: './component-stories.component.html',
  styleUrls: ['./component-stories.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule, RouterModule]
})
export class ComponentStoriesComponent implements OnInit {

  constructor(private pageFacade: PageFacadeService, private dataService: DataService, private activatedRoute: ActivatedRoute,
    private meta: Meta, private toast: MessageService, private router: Router, private service: FounderstoolService,
    private locationService: LocationService, private authService: AuthService) { }
  countrylist: any[] = [];
  currentRoute: string = '';
  headertooltipname: any;
  isShowCountryData: boolean = false;
  isShowCountryQuesAns: boolean = false;
  countrydatas: any[] = [];
  modename: any;
  questuionanswerlist: any[] = [];
  isQuestionAnswerVisible: boolean = false;
  dataanswerquestion: any;
  countryId: any;
  moduleid: any;
  countryname: any;
  ngOnInit(): void {
    this.locationService.getAllCountryList().subscribe((res: any) => {
      this.countrylist = res.data
    })
    this.currentRoute = this.router.url;
    if (this.currentRoute.includes('startup-funding-hacks')) {
      this.headertooltipname = "Startup Funding Hacks"
      this.modename = "startup_funding_hacks";
      this.moduleid = 23;
    } else if (this.currentRoute.includes('founder-success-stories')) {
      this.headertooltipname = "Founder Success Stories"
      this.modename = "founder_success_stories";
      this.moduleid = 24;
    } else if (this.currentRoute.includes('founder-failure-stories')) {
      this.modename = "founder_failure_stories";
      this.headertooltipname = "Founder Failure Stories"
      this.moduleid = 25;
    } else if (this.currentRoute.includes('startup-success-stories')) {
      this.modename = "startup_success_stories";
      this.headertooltipname = "Startup Success Stories"
      this.moduleid = 26;
    } else if (this.currentRoute.includes('startup-failure-stories')) {
      this.headertooltipname = "Startup Failure Stories"
      this.modename = "startup_failure_stories";
      this.moduleid = 27;
    }
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] && params['question_id']) {
        this.isShowCountryQuesAns = true;
        this.isShowCountryData = false;
        this.countryId = params['id']
        this.getQueAns(params['id'], params['question_id'])
      }
      else if (params['id']) {
        this.isShowCountryQuesAns = true;
        this.isShowCountryData = false;
        this.countryId = params['id']
        this.getQueAns(params['id'])
      } else {
        this.isShowCountryQuesAns = false;
        this.isShowCountryData = true;
      }
    });
    this.countryname = localStorage.getItem("countrynameforcomponentstorie")
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  goBack() {
    if (this.isShowCountryData) {
      this.router.navigate(["/pages/founderstool/founderstoollist"])
    } else {
      this.isShowCountryData = true;
      this.isShowCountryQuesAns = false;
    }
  }
  showDatas(data: any) {
    if (this.authService.isInvalidSubscription('founders_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    // get all country ,question, answer api
    localStorage.setItem("countrynameforcomponentstorie", data.country)
    this.countryname = data.country;
    this.questuionanswerlist = [];
    if (this.currentRoute.includes('startup-funding-hacks')) {
      this.router.navigate(['/pages/founderstool/startup-funding-hacks', data.id]);
    } else if (this.currentRoute.includes('founder-success-stories')) {
      this.router.navigate(['/pages/founderstool/founder-success-stories', data.id]);
    } else if (this.currentRoute.includes('founder-failure-stories')) {
      this.router.navigate(['/pages/founderstool/founder-failure-stories', data.id]);
    } else if (this.currentRoute.includes('startup-success-stories')) {
      this.router.navigate(['/pages/founderstool/startup-success-stories', data.id]);
    } else if (this.currentRoute.includes('startup-failure-stories')) {
      this.router.navigate(['/pages/founderstool/startup-failure-stories', data.id]);
    }
  }
  getQueAns(id: any, question_id?: any) {
    const datas: any = {
      mode: this.modename,
      country: id,
      ...(question_id ? { share_link_question_id: question_id } : {}) // Include question_id only if it's truthy
    };

    this.service.entrepreneurToolsSuccess(datas).subscribe(
      (res: any) => {
        this.isShowCountryData = false;
        this.isShowCountryQuesAns = true;
        this.questuionanswerlist = res.data; // Assign the response data to the list

        if (question_id) {
          this.showDataAnswer(res.data[0]);
        }
      },
      (error) => {
        console.error("Error fetching question data:", error); // Handle errors
        this.isShowCountryData = true; // Fallback to show general data if API fails
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
    let data: any = {
      isVisible: true,
      moduleId: this.moduleid,
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
  shareViaWhatsapp() {
    let url = window.location.href + '/' + this.dataanswerquestion?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram() {
    let url = window.location.href + '/' + this.dataanswerquestion?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook() {
    let url = window.location.href + '/' + this.dataanswerquestion?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn() {
    let url = window.location.href + '/' + this.dataanswerquestion?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter() {
    let url = window.location.href + '/' + this.dataanswerquestion?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail() {
    let url = window.location.href + '/' + this.dataanswerquestion?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  copyLink() {
    const textarea = document.createElement('textarea');

    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    const safeUrl = encodeURI(window.location.href);
    const selectedQuestionId = this.dataanswerquestion?.id || '';
    // const safeCountryId = this.countryId || '';

    // Combine data with a safe format
    textarea.textContent = `${safeUrl}/${selectedQuestionId}`;

    // Append the textarea safely
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
  }
  getContentPreview(content: string): string {
    // const plainText = content.replace(/<[^>]*>/g, '');
    // return plainText.length > 75 ? plainText.slice(0, 75) + ' ...' : plainText;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const paragraph = doc.querySelector("p")?.textContent || '';
    return paragraph.length > 75 ? paragraph.slice(0, 75) + ' ...' : paragraph;
  }
}
