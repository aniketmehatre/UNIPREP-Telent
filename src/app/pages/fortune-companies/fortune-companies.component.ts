import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "uni-fortune-companies",
  templateUrl: "./fortune-companies.component.html",
  standalone: false
})
export class FortuneCompaniesComponent implements OnInit {
  @Input() prepData: any;
  ngOnInit(): void {}
  componentswitch = 1;
  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
