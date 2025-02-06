import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
@Component({
  selector: "uni-salary-hacks",
  templateUrl: "./salaryhacks.component.html",
  standalone: true,
  imports: [CommonModule, RouterModule],
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
