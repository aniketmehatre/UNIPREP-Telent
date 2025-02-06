import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-startup-risk-assessment',
    templateUrl: './startup-risk-assessment.component.html',
    styleUrls: ['./startup-risk-assessment.component.scss'],
    standalone: false
})
export class StartupRiskAssessmentComponent implements OnInit {
  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'What type of business are you running or planning to run?' },
    { id: 2, question: 'What is your business model' },
    { id: 3, question: 'What is stage in your startup' },
    { id: 4, question: 'What specfic risk are you concerned about' },
    { id: 5, question: 'Who is your current financial status' },
    { id: 6, question: 'How competitive is the your market?' },
    { id: 7, question: 'Who are your ideal customers?' },
    { id: 8, question: 'What is your budget for addressing risks?' }
  ];
  businessModelList = [{
    id: 1, name: 'option'
  }];
  startupStageList = [{
    id: 1, name: 'option'
  }];
  financialStatusList = [{
    id: 1, name: 'option'
  }];
  competitiveMarketList = [{
    id: 1, name: 'option'
  }];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  recommendationData: string = '';
  activePageIndex: number = 0;
  form: FormGroup;
  inValidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  enableModule: boolean = false;
  isFromSavedData: boolean = false;
  constructor(
    private fb: FormBuilder,
    private founderToolService: FounderstoolService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getStartUpRiskAssesmentOptionsList();
  }

  getStartUpRiskAssesmentOptionsList() {
    this.founderToolService.getStartUpRiskAssesmentOptionsList().subscribe((res: any) => {
      console.log(res);
      this.competitiveMarketList = res?.competitive;
      this.financialStatusList = res?.financialstatus;
      this.businessModelList = res?.models;
      this.startupStageList = res?.stages;
    });
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
      model: this.selectedData[2],
      stage: this.selectedData[3],
      risks: this.selectedData[4],
      financial_status: this.selectedData[5],
      competitive_market: this.selectedData[6],
      customers: this.selectedData[7],
      budget: this.selectedData[8],
      mode: 'startup_risk_assessment'
    }
    this.founderToolService.getChatgptRecommendations(data).subscribe({
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
      this.founderToolService.getAnalysisList('startup_risk_assessment').subscribe({
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
    this.router.navigateByUrl('/pages/founderstool/founderstoollist');
  }
}
