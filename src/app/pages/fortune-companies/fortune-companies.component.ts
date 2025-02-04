import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "uni-fortune-companies",
  templateUrl: "./fortune-companies.component.html",
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
