import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EducationToolsService } from '../education-tools.service';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CourseNavigator, EducatiionsRec, CourseSubmodulesList } from 'src/app/@Models/course-navigator.model';
import { CurrentSpecialization, BasicType, RecommandationQuestion } from 'src/app/@Models/recommandation-question.model';
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
import { environment } from '@env/environment';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'uni-course-navigator',
  templateUrl: './course-navigator.component.html',
  styleUrls: ['./course-navigator.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class CourseNavigatorComponent implements OnInit {

  recommendations: RecommandationQuestion[] = [
    { id: 1, question: 'Select your Specialization' },
    { id: 2, question: 'Choose Your Degree' }
  ];
  educationList: BasicType[] = [
    { id: 1, name: 'Bachelors' },
    { id: 2, name: 'Masters' }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  specializationList: CurrentSpecialization[] = [];
  recommendationDataList: EducatiionsRec[] = [];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  isCourseSubmodule: boolean = false;
  recommadationSavedQuestionList: CourseNavigator[] = [];
  recommadationQuestionList: CourseNavigator[] = [];
  isQuestionAnswerVisible: boolean = false;
  // stateOptions = [{ label: 'Default', value: 'default' }, { label: 'Saved', value: 'saved' }];
  selectedState: string = 'default';
  selectedQuestionData: CourseNavigator;
  recommandedQandAList: CourseNavigator[] = [];
  courseSubmodules: CourseSubmodulesList[] = [
    {
      id: 1,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/career-choice.svg`,
      submodule_name: "Career Opportunities & Job Roles"
    },
    {
      id: 2,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/job-description.svg`,
      submodule_name: "Industry Relevance & Practical Exposure"
    },
    {
      id: 3,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/skills.svg`,
      submodule_name: "Skills & Compentency Developement"
    },
    {
      id: 4,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/worldwide.svg`,
      submodule_name: "Global & Regional Career Scope"
    },
    {
      id: 5,
      icon: `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/education-tools/return-of-investment.svg`,
      submodule_name: "ROI (Return on Investment) & Financial Aspects"
    },
  ];
  selectedDegreeId: number;
  selectedDegreeName: string = '';

  constructor(
    private educationToolsService: EducationToolsService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,
    private route: ActivatedRoute,
    private dataService: DataService

  ) { }

  ngOnInit(): void {
    this.getCurrentSpecializations();
    const degreeId = Number(this.route.snapshot.paramMap.get("degreeId"));
    const courseId = Number(this.route.snapshot.paramMap.get("courseId"));
    const questionId = Number(this.route.snapshot.paramMap.get("questionId"));
    if (degreeId && courseId && questionId) {
      this.selectedDegreeId = degreeId;
      this.getCourseQandAList(courseId, questionId);
    }
  }

  getCurrentSpecializations() {
    this.educationToolsService.getCurrentSpecializations().subscribe({
      next: response => {
        this.specializationList = response;
      },
      error: error => {
      }
    });
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
    this.isCourseSubmodule = false;
    this.selectedData = {};
  }

  getCourseSubmodules(data: EducatiionsRec) {
    this.selectedDegreeId = data.id;
    this.selectedDegreeName = data.degree_name;
    this.isRecommendationQuestion = false;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isCourseSubmodule = true;
  }

  getCourseQandAList(courseId: number, questionId?: number) {
    this.educationToolsService.getCourseQandA(this.selectedDegreeId, courseId, questionId).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = false;
        this.isRecommendationSavedData = true;
        this.recommadationQuestionList = response;
        this.recommandedQandAList = response;
        this.isCourseSubmodule = false;
        if (questionId) {
          this.viewOneQuestion(this.recommandedQandAList[0]);
          this.selectedDegreeName = this.recommadationQuestionList[0].degree_name;
        }
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
        this.toast.add({ severity: "success", summary: "Success", detail: response.message, });
        this.recommadationSavedQuestionList.push(question);
      },
      error: error => {
        this.toast.add({ severity: "error", summary: "Warning", detail: error.message, });
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

  viewOneQuestion(data: CourseNavigator) {
    this.isQuestionAnswerVisible = true;
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
    let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaInstagram() {
    let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaFacebook() {
    let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaLinkedIn() {
    let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaTwitter() {
    let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaMail() {
    let url = window.location.href + '/' + this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    const safeUrl = encodeURI(window.location.href);
    const selectedDegreeId = this.selectedQuestionData?.degree_id || '';
    const selectedCourseId = this.selectedQuestionData?.course_id || '';
    const selectedQuestionId = this.selectedQuestionData?.id || '';
    const textToCopy = `${safeUrl}/${selectedDegreeId}/${selectedCourseId}/${selectedQuestionId}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
      })
      .catch((err) => {
        this.toast.add({ severity: "error", summary: "Warning", detail: 'Failed to copy the question' });
        console.error('Failed to copy text: ', err);
      });
  }

  goBack(type?: string) {
    if (type == 'questions') {
      this.isRecommendationSavedData = false;
      this.isCourseSubmodule = true;
    }
    if (type == 'submodule') {
      this.isCourseSubmodule = false;
      this.isRecommendationData = true;
    }
    if (!type) {
      this.router.navigateByUrl('/pages/education-tools');
    }
  }

  getContentPreview(content: string): string {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.innerText || div.textContent || "";
    const sentences = text.split(". ");
    let paragraph = sentences[0] ? sentences[0] : "";
    return paragraph.length > 75 ? paragraph.slice(13, 85) + ' ...' : paragraph;
  }

  openReport() {

  }
}