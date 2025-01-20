import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'uni-startup-risk-assessment',
  templateUrl: './startup-risk-assessment.component.html',
  styleUrls: ['./startup-risk-assessment.component.scss']
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
  activePageIndex: number = 0;
  form: FormGroup;
  inValidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  enableModule: boolean = false;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // this.form = this.fb.group({
    //   business_type: ["", [Validators.required]],
    //   business_primary_goals: ["", [Validators.required]],
    //   business_time: ["", [Validators.required]],
    //   business_challenges: ["", [Validators.required]],
    //   ideal_customers: ["", [Validators.required]],
    //   business_budget: ["", [Validators.required]],
    // });
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
}
