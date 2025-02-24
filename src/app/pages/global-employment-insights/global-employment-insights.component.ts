import { Component, Input, OnInit } from "@angular/core";
@Component({
    selector: "uni-global-employment-insights",
    templateUrl: "./global-employment-insights.component.html",
    standalone: false
})
export class GlobalEmploymentComponent implements OnInit {
  @Input() prepData: any;
  ngOnInit(): void {}
  componentswitch = 1;
  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
