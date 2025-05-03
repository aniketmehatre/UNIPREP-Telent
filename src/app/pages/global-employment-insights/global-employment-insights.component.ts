import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "uni-global-employment-insights",
  templateUrl: "./global-employment-insights.component.html",
  standalone: false
})
export class GlobalEmploymentComponent implements OnInit {
  @Input() prepData: any;
  componentswitch = 1;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const questionId = Number(this.route.snapshot.paramMap.get("questionId"));
    const countryId = Number(this.route.snapshot.paramMap.get("countryId"));
    if (questionId) {
      this.componentswitch = 2;
      this.prepData = {
        country_id: countryId,
        question_id: questionId,
        stage: 2,
      }
    }
  }
  windowChange(data: any) {
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
