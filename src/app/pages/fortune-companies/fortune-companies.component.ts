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
    this.route.snapshot.queryParamMap.get('countryId')
    this.route.snapshot.queryParamMap.get('questionId')
  }

  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
