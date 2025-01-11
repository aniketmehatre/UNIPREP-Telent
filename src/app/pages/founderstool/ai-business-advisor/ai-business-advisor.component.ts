import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'uni-ai-business-advisor',
  templateUrl: './ai-business-advisor.component.html',
  styleUrls: ['./ai-business-advisor.component.scss']
})
export class AiBusinessAdvisorComponent implements OnInit {

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'What type of business are you running or planning to run?' },
    { id: 2, question: 'What are the primary goals of the business' },
    { id: 3, question: 'How long do you want the strategy to focus on' },
    { id: 4, question: 'What specfic challenges are you facing  in your business' },
    { id: 5, question: 'Who are your ideal Customers' },
    { id: 6, question: 'What is your budget for scaling your business' }
  ];
  activePageIndex: number = 0;
  form: FormGroup;
  inValidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  enableModule: boolean = false;
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
