import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
@Component({
  selector: "uni-career-hacks",
  templateUrl: "./careerhacks.component.html",
  standalone: true,
  imports: [RouterModule, DialogModule, CommonModule],
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
