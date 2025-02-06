import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
@Component({
  selector: "uni-job-seeker-success-stories",
  templateUrl: "./job-seeker-success-stories.component.html",
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class JobSeekersComponent implements OnInit {
  @Input() prepData: any;
  ngOnInit(): void {}
  componentswitch = 1;
  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
