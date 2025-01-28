import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EducationToolsService } from '../education-tools.service';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { EducatiionsRec } from 'src/app/@Models/course-navigator.model';

@Component({
  selector: 'uni-course-navigator',
  templateUrl: './course-navigator.component.html',
  styleUrls: ['./course-navigator.component.scss']
})
export class CourseNavigatorComponent implements OnInit {

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'Select your Specialization' },
    { id: 2, question: 'Choose Your Degree' }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  specializationList: { id: number, specialization_name: string }[] = [];
  specializations: { id: number, specialization_name: string }[] = [];
  educationList: { id: number, name: string }[] = [
    { id: 1, name: 'Bachelors' },
    { id: 2, name: 'Masters' }
  ];
  recommendationDataList: EducatiionsRec[] = [];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any[] = [];
  recommadationQuestionList: any[] = [];
  isQuestionAnswerVisible: boolean = false;
  oneQuestionContent: any;
  stateOptions = [{ label: 'Default', value: 'default' }, { label: 'Saved', value: 'saved' }];
  selectedState: string = 'default';
  selectedQuestionData: any;
  countryId: any;
  specializationFilter: string = '';
  recommandedQandAList: any[] = [];

  constructor(
    private educationToolsService: EducationToolsService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,

  ) { }

  ngOnInit(): void {
    this.getCurrentSpecializations();
  }

  getCurrentSpecializations() {
    this.educationToolsService.getCurrentSpecializations().subscribe({
      next: response => {
        this.specializationList = response;
        this.specializations = response;
      },
      error: error => {
      }
    });
  }

  customFilterFunction() {
    if (this.specializationFilter === "") {
      this.specializationList = this.specializations;
      return;
    }
    this.specializationList = this.specializations.filter(item =>
      item?.specialization_name?.toLowerCase().includes(this.specializationFilter.toLowerCase())
    );
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    this.invalidClass = !(itemId in this.selectedData);
    if (!this.invalidClass) {
      this.activePageIndex < this.recommendations.length - 1 ? this.activePageIndex++ : this.getRecommendation();
    }
  }

  getRecommendation() {
    let data: any = {
      spec_id: this.selectedData[1],
      edu_id: this.selectedData[2]
    }
    this.educationToolsService.getDegreeRecommadations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        this.recommendationDataList = response;
      },
      error: error => {
        this.isRecommendationData = false;
      }
    });
  }

  resetRecommendation() {
    this.activePageIndex = 0;
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.selectedData = {};
  }

  getCourseQandAList(degree_id: number) {
    this.educationToolsService.getCourseQandA(degree_id).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = false;
        this.isRecommendationSavedData = true;
        this.recommadationQuestionList = response;
        this.recommandedQandAList = response;
      },
      error: error => {
      }
    });
    this.getCNUserSavedQuestions();
  }

  addCNUserQuestions(question: any) {
    let data = {
      question_id: question.id
    }
    this.educationToolsService.addCNUserQuestions(data).subscribe({
      next: response => {
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        this.recommadationSavedQuestionList.push(question);
      },
      error: error => {
        this.toast.add({
          severity: "error",
          summary: "Warning",
          detail: error.message,
        });
      }
    });
  }

  getCNUserSavedQuestions() {
    this.educationToolsService.getCNUserSavedQuestions().subscribe({
      next: response => {
        this.recommadationSavedQuestionList = response;
      },
      error: error => {
      }
    });
  }

  onChangeSelect(event: any) {
    this.recommandedQandAList = event.value == 'default' ? this.recommadationQuestionList : this.recommadationSavedQuestionList;
  }

  viewOneQuestion(data: any) {
    this.isQuestionAnswerVisible = true;
    this.oneQuestionContent = data;
    this.selectedQuestionData = data;
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
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail() {
    let url = window.location.href + '/' + this.selectedQuestionData?.id
    console.log(url);
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
    const selectedQuestionId = this.selectedQuestionData?.id || '';
    const safeCountryId = this.countryId || '';

    // Combine data with a safe format
    textarea.textContent = `${safeUrl}/${selectedQuestionId}`;

    // Append the textarea safely
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
  }
  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }
}