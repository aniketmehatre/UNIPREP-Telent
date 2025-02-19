import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NationalExamService } from '../national-exam-categories/national-exam.service';
import { NationalExamResult } from 'src/app/@Models/nationl-exams.model';

@Component({
  selector: 'uni-national-exam-result',
  templateUrl: './national-exam-result.component.html',
  styleUrls: ['./national-exam-result.component.scss']
})
export class NationalExamResultComponent implements OnInit {
  results!: NationalExamResult;
  totalPercentage: number = 0;

  constructor(private service: NationalExamService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var data = {
      result_id: this.route.snapshot.paramMap.get("resultid")
    }
    this.service.GetResult(data).subscribe(response => {
      this.results = response;
      this.totalPercentage = Number(response.score.split('/')?.[0] + 0);
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


