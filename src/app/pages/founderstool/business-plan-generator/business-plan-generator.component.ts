import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'uni-business-plan-generator',
    templateUrl: './business-plan-generator.component.html',
    styleUrls: ['./business-plan-generator.component.scss'],
    standalone: false
})
export class BusinessPlanGeneratorComponent implements OnInit {

  recommendations: { stage: number, title: string }[] = [
    { stage: 1, title: 'Basic Information' },
    { stage: 2, title: 'Market Analysis' },
    { stage: 3, title: 'Finances' },
    { stage: 4, title: 'Marketing & Sales' },
    { stage: 5, title: 'Operations' }
  ];
  revenueModelList: { id: number, name: string }[] = [
    { id: 1, name: 'Product Sales' },
    { id: 2, name: 'Subscription' },
    { id: 3, name: 'Freemium' },
    { id: 4, name: 'Licensing' },
    { id: 5, name: 'Advertising' }
  ];
  activePageIndex: number = 0;
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      business_name: ["", [Validators.required]],
      target_market: ["", [Validators.required]],
      business_overview: ["", [Validators.required]],
      product_or_service: ["", [Validators.required]],
      unique_value: ["", [Validators.required]],
      revenue_model: ["", [Validators.required]],
      initial_funding: ["", [Validators.required]],
      project_revenue: ["", [Validators.required]],
      competitor: ["", [Validators.required]],
      sales_strategy: ["", [Validators.required]],
      opertions: ["", [Validators.required]],
      founders_key_term: ["", [Validators.required]],
    });
  }

  next() {
    this.submitted = false;
    const formData = this.form.value;
    if (this.activePageIndex == 0) {
      if (!formData.business_name || !formData.target_market || !formData.business_overview) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.product_or_service || !formData.unique_value) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.revenue_model || !formData.initial_funding || !formData.project_revenue) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 3) {
      if (!formData.competitor || !formData.sales_strategy) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  previous() {
    this.activePageIndex--;
  }
}
