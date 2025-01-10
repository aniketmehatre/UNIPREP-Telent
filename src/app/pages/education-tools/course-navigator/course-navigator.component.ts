import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EducationToolsService } from '../education-tools.service';

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
  specializationList: { id: number, name: string }[] = [
    { id: 1, name: 'Computer Science and Engineering' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Diploma in Computer Applications' }
  ];
  DegreeList: { id: number, name: string }[] = [
    { id: 1, name: 'BE' },
    { id: 2, name: 'BTech' },
    { id: 3, name: 'BSC' }
  ];
  recommendationData: string = '';
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any[] = [{}];
  isFromSavedData: boolean = false;

  constructor(
    private educationToolsService: EducationToolsService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(itemId: number) {
    this.invalidClass = false;
    if (itemId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  getRecommendation() {
    let data: any = {
      current_specialization: this.selectedData[1],
      degree: this.selectedData[2]
    }
    this.educationToolsService.getEduRecommadations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        this.recommendationData = response.response;
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
    this.isFromSavedData = false;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.educationToolsService.getEduSavedRecommadations('').subscribe({
        next: response => {
          this.isRecommendationQuestion = false;
          this.isRecommendationData = false;
          this.isRecommendationSavedData = true;
          this.recommadationSavedQuestionList = response.data;
        },
        error: error => {
        }
      });
    }
  }

  showRecommandationData(data: string) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationData = data;
  }

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }
}