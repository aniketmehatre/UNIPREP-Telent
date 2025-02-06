import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-ai-business-advisor',
    templateUrl: './ai-business-advisor.component.html',
    styleUrls: ['./ai-business-advisor.component.scss'],
    standalone: false
})
export class AiBusinessAdvisorComponent implements OnInit {
  strategyBusinessList: any = [{
    id: 1, name: 'option'
  }];
  recommadationSavedQuestionList: any = [];
  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'What industry are you operating in?' },
    { id: 2, question: 'What are your primary business goals for the specified duration?' },
    { id: 3, question: 'What is the duration in which you want to achieve your goals?' },
    { id: 4, question: 'What challenges your business is currently facing?' },
    { id: 5, question: 'Who is your target audience?' },
    { id: 6, question: 'What is your budget for your business goals?' },
    { id: 7, question: 'What is the overall strategy you want to align with?' }
  ];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: string = '';
  activePageIndex: number = 0;
  form: FormGroup;
  inValidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  enableModule: boolean = false;
  isFromSavedData: boolean = false;
  constructor(
    private fb: FormBuilder,
    private foundersToolService: FounderstoolService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  previous(): void {
    this.inValidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number): void {
    this.inValidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.inValidClass = true;
    }
  }

  getRecommendation() {
    let data: any = {
      type: this.selectedData[1],
      goals: this.selectedData[2],
      duration: [this.selectedData[3]],
      challenges: this.selectedData[4],
      customers: this.selectedData[5],
      budget: this.selectedData[6],
      strategy: this.selectedData[7],
      mode: 'business_advisor'
    }
    this.foundersToolService.getChatgptRecommendations(data).subscribe({
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
    this.selectedData = { 3: 1 };
    this.isRecommendationQuestion = true;
    this.isRecommendationData = false;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = false;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.foundersToolService.getAnalysisList('business_advisor').subscribe({
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
    this.router.navigateByUrl('/pages/founderstool');
  }


}
