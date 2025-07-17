import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EducationToolsService } from '../education-tools.service';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CourseNavigator, EducatiionsRec, CourseSubmodulesList } from 'src/app/@Models/course-navigator.model';
import { CurrentSpecialization, RecommandationQuestion } from 'src/app/@Models/recommandation-question.model';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from 'src/app/Auth/auth.service';
import { SocialShareService } from 'src/app/services/social-share.service';
import { PageFacadeService } from '../../page-facade.service';
import { CourseSubmodules } from './course-navigator.data';

@Component({
  selector: 'uni-course-navigator',
  templateUrl: './course-navigator.component.html',
  styleUrls: ['./course-navigator.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule, IconFieldModule, InputIconModule]
})
export class CourseNavigatorComponent implements OnInit {

  recommendations: RecommandationQuestion[] = [
    { id: 1, question: 'Select your Specialization' },
    { id: 2, question: 'Choose Your Degree' }
  ];
  activePageIndex: number = 0;
  specializationList: CurrentSpecialization[] = [];
  specializations: CurrentSpecialization[] = [];
  recommendationDataList: EducatiionsRec[] = [];
  degreeList: EducatiionsRec[] = [];
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
  courseSubmodules: CourseSubmodulesList[] = CourseSubmodules;
  selectedDegreeId: number = 0;
  selectedDegreeName: string = '';
  specializationFilter: string = '';
  degreeFilter: string = '';
  selectedSpecialization: string = '';

  constructor(
    private educationToolsService: EducationToolsService,
    private router: Router,
    private meta: Meta,
    private toast: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private socialShareService: SocialShareService,
    private pageFacade: PageFacadeService
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
        this.specializations = response;
      },
      error: error => {
      }
    });
  }

  performSearch(type: string) {
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (type == 'specialization') {
      const searchValue = this.specializationFilter.toLowerCase();
      this.specializationList = this.specializations.filter((item) => {
        return item.specialization_name.toLowerCase().includes(searchValue);
      });
    }
    else {
      const searchValue = this.degreeFilter.toLowerCase();
      this.recommendationDataList = this.degreeList.filter((item) => {
        return item.degree_name.toLowerCase().includes(searchValue);
      });
    }
  }

  getCourseList(value: CurrentSpecialization) {
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.selectedSpecialization = value.specialization_name;
    let data = {
      spec_id: value.id,
    }
    this.educationToolsService.getDegreeRecommadations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        this.recommendationDataList = response;
        this.degreeList = response;
      },
      error: error => {
        this.isRecommendationData = false;
      }
    });
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("course-navigator");
  }

  resetRecommendation() {
    this.activePageIndex = 0;
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isCourseSubmodule = false;
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
          this.selectedSpecialization = this.recommadationQuestionList[0].specialization_name;
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

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = encodeURI(window.location.origin + '/pages/education-tools/course-navigator/' +
      this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/education-tools/course-navigator/' +
      this.selectedQuestionData?.degree_id + '/' + this.selectedQuestionData?.course_id + '/' + this.selectedQuestionData?.id);
    this.socialShareService.copyQuestion(textToCopy);
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
    if (type == 'recommandation') {
      this.isRecommendationData = false;
      this.isRecommendationQuestion = true;
      this.degreeFilter = '';
    }
    if (!type) {
      this.router.navigateByUrl('/pages/education-tools');
    }
  }

  openReport() {

  }
}