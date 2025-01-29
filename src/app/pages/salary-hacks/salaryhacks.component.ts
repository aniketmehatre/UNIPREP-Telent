import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "uni-salary-hacks",
  templateUrl: "./salaryhacks.component.html",
})
export class SalaryhacksComponent implements OnInit {
  @Input() prepData: any;
  ngOnInit(): void {}
  componentswitch = 1;
  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
