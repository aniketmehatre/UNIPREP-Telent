import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';
import { businessAdvisor } from './business-advisor.data';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
    selector: 'uni-ai-business-advisor',
    templateUrl: './ai-business-advisor.component.html',
    styleUrls: ['./ai-business-advisor.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class AiBusinessAdvisorComponent implements OnInit {
  strategyBusinessList: any = businessAdvisor.strategies;
  industryList: { Industry: string }[] = businessAdvisor.Industry;
  businessGoalsList: { goal: string }[] = businessAdvisor.businessGoals;
  challengeList: { challenge: string }[] = businessAdvisor.challenges;
  targetAudienceList: { audience: string }[] = businessAdvisor.targetAudience;
  budgetList: { goal: string }[] = businessAdvisor.budgetGoals;
  durationList: { duration: string }[] = businessAdvisor.timeDuration;

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
  recommendationData: SafeHtml;
  activePageIndex: number = 0;
  form: FormGroup;
  inValidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  enableModule: boolean = false;
  isFromSavedData: boolean = false;
  currencyList: any = [];
  constructor(
    private fb: FormBuilder,
    private foundersToolService: FounderstoolService,
    private router: Router,
    private toast: MessageService,
    private travelToolService: TravelToolsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getCurrenyandLocation();
  }

  getCurrenyandLocation() {
    this.foundersToolService.getCurrenciesList().subscribe((res: any) => {
      this.currencyList = res;
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
      if (productId == 6) {
        if (this.selectedData[6].toString()?.length > 8) {
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
      goals: this.selectedData[2],
      duration: this.selectedData[3],
      challenges: this.selectedData[4],
      customers: this.selectedData[5],
      budget: this.selectedData[6],
      strategy: this.selectedData[7],
      currency: this.selectedData[8],
      mode: 'business_advisor'
    }
    this.foundersToolService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        let chatGptResponse = response.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
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

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Business Advisor</h2>
				</div></div>
        <p><strong>Input:<br></strong></p>`;

    this.recommendations.forEach(item => {
      addingInput += `<p style="color: #d32f2f;"><strong>${item.question}</strong></p>`;
      let currentAnswer = "";
      if (this.selectedData && this.selectedData[item.id]) {
        if (item.id == 6) {
          currentAnswer = this.selectedData[8] + ' ' + this.selectedData[item.id]
        }
        else if (item.id == 3) {
          currentAnswer = `${this.selectedData[item.id]} Months`;
        }
        else {
          currentAnswer = this.selectedData[item.id];
        }
      } else {
        currentAnswer = "No answer provided";
      }

      addingInput += `<p>${currentAnswer}</p><br>`;
    });

    let finalRecommendation = addingInput + '<p><strong>Response:<br></strong></p>' + this.recommendationData;
    finalRecommendation = finalRecommendation
			.replace(/```html|```/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
			.replace(/SafeValue must use \[property\]=binding:/g, '')
			.replace(/class="container"/g, 'style="line-height:1.9"'); //because if i add container the margin will increase so i removed the container now the spacing is proper.

    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Business Advisor",
      file_name: "business_advisor"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }


}
