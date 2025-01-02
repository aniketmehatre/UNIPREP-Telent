import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'uni-assessment-quiz-result',
  templateUrl: './assessment-quiz-result.component.html',
  styleUrls: ['./assessment-quiz-result.component.scss']
})
export class AssessmentQuizResultComponent implements OnInit {

  results: any;
  totalPercentage:any;

  constructor(private assessmentService: AssessmentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    var data = {
      result_id: this.route.snapshot.paramMap.get("resultid")
    }
    this.assessmentService.showResult(data).subscribe(response => {
      this.results = response;
      // alert(this.activeQuestionId);
    });

  }

  goToReview() {
    this.router.navigate([`/pages/national-exams/${this.route.snapshot.paramMap.get("categoryid")}/review/${this.route.snapshot.paramMap.get("resultid")}`]);
  }

  goToCats() {
    this.router.navigate(['/pages/national-exams', this.route.snapshot.paramMap.get("categoryid")]);
  }

  goToTest(testId: string) {
    this.router.navigate([`/pages/national-exams/${this.route.snapshot.paramMap.get("categoryid")}/questions/${testId}`]);
  }
}
