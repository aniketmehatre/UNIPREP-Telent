import { Component, Input, OnInit } from "@angular/core";
@Component({
  selector: "uni-career-hacks",
  templateUrl: "./careerhacks.component.html",
})
export class CareerhacksComponent implements OnInit {
  @Input() prepData: any;
  ngOnInit(): void {}
  componentswitch = 1;
  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
