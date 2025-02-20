import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';
import { riskAssessment } from './risk-assessment.data';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';

interface DropDown {
  [key: string]: string;
}

@Component({
    selector: 'uni-startup-risk-assessment',
    templateUrl: './startup-risk-assessment.component.html',
    styleUrls: ['./startup-risk-assessment.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class StartupRiskAssessmentComponent implements OnInit {
  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'What industry is your startup in?' },
    { id: 2, question: 'Can you describe your business model?' },
    { id: 3, question: 'What stage is your startup currently at?' },
    { id: 4, question: 'What are the key risks your startup has identified?' },
    { id: 5, question: 'What is the current financial status of your startup?' },
    { id: 6, question: 'What is the competitor in the market?' },
    { id: 7, question: 'Who is your target audience?' },
    { id: 8, question: 'What is the budget of allocated across diffrent areas of your business?' },
    { id: 9, question: 'What is the geographical focus of your startup?' }
  ];
  businessModelList: DropDown[] = riskAssessment.businessModel;
  startupStageList: DropDown[] = riskAssessment.startupStage;
  financialStatusList: DropDown[] = riskAssessment.financialSituation;
  competitiveMarketList: DropDown[] = riskAssessment.marketCompetition;
  targetAudienceList: DropDown[] = riskAssessment.targetAudience;
  keyRisksList: DropDown[] = riskAssessment.keyRisks;
  budgetAllocationList: DropDown[] = riskAssessment.budgetAllocation;
  geographicalList: DropDown[] = riskAssessment.geographicalFocus;
  industryList: DropDown[] = riskAssessment.Industry;

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
  currencyList: any = [];
  constructor(
    private fb: FormBuilder,
    private founderToolService: FounderstoolService,
    private router: Router,
    private toast: MessageService,
    private travelToolService: TravelToolsService
  ) { }

  ngOnInit(): void {
    console.log(this.businessModelList);
    this.getCurrenyandLocation();
    // this.getStartUpRiskAssesmentOptionsList();
  }

  getCurrenyandLocation() {
    this.founderToolService.getCurrencyAndCountries().subscribe((res: any) => {
      this.currencyList = res;
    });
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
      if (productId == 8) {
        if (this.selectedData[8].toString()?.length > 6) {
          this.inValidClass = true;
          return;
        }
      }
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.inValidClass = true;
    }
  }

  getRecommendation(productId: number) {
    this.inValidClass = false;
    if (!(productId in this.selectedData)) {
      this.inValidClass = true;
      return;
    }
    let data: any = {
      type: this.selectedData[1],
      model: this.selectedData[2],
      stage: this.selectedData[3],
      risks: [this.selectedData[4]],
      financial_status: this.selectedData[5],
      competitive_market: this.selectedData[6],
      customers: [this.selectedData[7]],
      budget: this.selectedData[8],
      geographical_focus: this.selectedData[9],
      currency: this.selectedData[10],
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

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let paramData: DownloadRespose = {
      response: this.recommendationData,
      module_name: "Startup Risk Assessment",
      file_name: "startup_risk_assessment"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }
}
