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
  countryname: string = '';
  isSkeletonVisible: boolean = false;
  constructor(private educationToolService: EducationToolsService, private route: ActivatedRoute, private meta: Meta) {

  }

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.params?.['id'];
    this.countryId = localStorage.getItem('country_insights_country') || '';
    this.countryname = localStorage.getItem('country_insights_country_name') || '';
    this.getQuizQuestionData();
  }

  getQuizQuestionData() {
    this.isSkeletonVisible = true;
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
      this.isSkeletonVisible = false;
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
    const { title, answer } = this.questionDetail || {};
    const message = `*${title}*\n${answer}`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaInstagram(link: any) {
    const { title, answer } = this.questionDetail || {};
    const message = `${title}\n${answer}`;
    // Instagram doesn't support direct text sharing via URLs.
    alert('Instagram sharing requires manual pasting. Text has been copied to your clipboard.');
    this.copyTextToClipboard(message);
  }

  shareViaFacebook(link: any) {
    const { title, answer } = this.questionDetail || {};
    const url = encodeURIComponent(`${title}\n${answer}`);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank');
  }

  shareViaLinkedIn(link: any) {
    const { title, answer } = this.questionDetail || {};
    const url = encodeURIComponent(`${title}\n${answer}`);
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${url}`;
    window.open(shareUrl, '_blank');
  }

  shareViaTwitter(link: any) {
    const { title, answer } = this.questionDetail || {};
    const message = `${title}\n${answer}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaMail(link: any) {
    const { title, answer } = this.questionDetail || {};
    const message = `${title}\n\n${answer}`;
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  }

  copyLink(link: any) {
    const { title, answer } = this.questionDetail || {};
    const message = `${title}\n${answer}`;
    this.copyTextToClipboard(message);
  }

  private copyTextToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    alert('Text copied to clipboard!');
  }


}
