import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';
import { riskAssessment } from './risk-assessment.data';

interface DropDown<T> {
  T: string;
}

@Component({
  selector: 'uni-startup-risk-assessment',
  templateUrl: './startup-risk-assessment.component.html',
  styleUrls: ['./startup-risk-assessment.component.scss']
})
export class StartupRiskAssessmentComponent implements OnInit {
  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'What industry is your startup in?' },
    { id: 2, question: 'Can you describe your business model?' },
    { id: 3, question: 'What stage is your startup currently at?' },
    { id: 4, question: 'What are the key risks your startup has identified?' },
    { id: 5, question: 'What is the current financial status of your startup?' },
    { id: 6, question: 'Who are your main competitors in the market?' },
    { id: 7, question: 'Who is your target audience?' },
    { id: 8, question: 'How have you allocated your budget across different areas of your business?' },
    { id: 9, question: 'What is the geographical focus of your startup?' }
  ];
  businessModelList: any = riskAssessment.businessModel;
  startupStageList: any = riskAssessment.startupStage;
  financialStatusList: any = riskAssessment.financialSituation;
  competitiveMarketList: any = riskAssessment.marketCompetition;
  targetAudienceList: any = riskAssessment.targetAudience;
  keyRisksList: any = riskAssessment.keyRisks;
  budgetAllocationList: any = riskAssessment.budgetAllocation;
  geographicalList: any = riskAssessment.geographicalFocus;
  industryList: any = riskAssessment.industry;

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
    console.log(this.businessModelList);
    // this.getStartUpRiskAssesmentOptionsList();
  }

  // getStartUpRiskAssesmentOptionsList() {
  //   this.founderToolService.getStartUpRiskAssesmentOptionsList().subscribe((res: any) => {
  //     console.log(res);
  //     this.competitiveMarketList = res?.competitive;
  //     this.financialStatusList = res?.financialstatus;
  //     this.businessModelList = res?.models;
  //     this.startupStageList = res?.stages;
  //   });
  // }

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
      geopraphical: this.selectedData[9],
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
