import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../../education-tools.service';
import { QuestionsList } from 'src/app/@Models/country-insights.model';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'uni-country-insights-submodule',
  templateUrl: './country-insights-submodule.component.html',
  styleUrls: ['./country-insights-submodule.component.scss']
})
export class CountryInsightsSubmoduleComponent implements OnInit {
  questionsList: QuestionsList[] = [];
  first = 0;
  page = 1;
  pageSize = 25;
  moduleId: string = '';
  countryId: string = '';
  questionModal: boolean = false;
  questionDetail: any;
  totalQuizCount: number = 0;
  selectedIndex: number = 0;
  constructor(private educationToolService: EducationToolsService, private route: ActivatedRoute, private meta: Meta) {

  }

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.params?.['id'];
    this.countryId = localStorage.getItem('country_insights_country') || '';
    this.getQuizQuestionData();
  }

  getQuizQuestionData() {
    this.questionsList = [];
    let req = {
      module_id: this.moduleId,
      page: this.page,
      perpage: this.pageSize,
      country: this.countryId,
    }

    this.educationToolService.getQuizQuestion(req).subscribe(data => {
      this.questionsList = data?.questions;
      this.totalQuizCount = data.count;
    })

  }

  closeModal() {
    this.questionDetail = null;
    this.questionModal = false;
  }

  viewModal(data: QuestionsList) {
    this.questionDetail = data;
    this.questionModal = true;
  }

  showSocialSharingList(index: any): void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }
  shareViaWhatsapp(link: any) {
    let url = this.questionDetail
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram(link: any) {
    let url = this.questionDetail
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook(link: any) {
    let url = this.questionDetail
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn(link: any) {
    let url = this.questionDetail
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter(link: any) {
    let url = this.questionDetail
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail(link: any) {
    let url = this.questionDetail
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  copyLink(link: any) {
    const sanitizedCertificate = this.questionDetail || '';
    const textarea = document.createElement('textarea');
    textarea.textContent = sanitizedCertificate;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

}
