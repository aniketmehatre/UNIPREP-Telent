import { Component, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { DialogModule } from "primeng/dialog";
@Component({
  selector: "uni-fortune-companies",
  templateUrl: "./fortune-companies.component.html",
  standalone: false
})
export class FortuneCompaniesComponent implements OnInit {

  componentswitch = 1;
  @Input() prepData: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const companyId = Number(this.route.snapshot.paramMap.get("companyId"));
    const questionId = Number(this.route.snapshot.paramMap.get("questionId"));
    if(questionId){
      let data = {
        fortune_company_id: companyId,
        companyName: '',
        stage: 2,
        countryId: '',
        searchText: '',
        question_id: questionId
      }
      this.windowChange(data);
    }
  }

  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
