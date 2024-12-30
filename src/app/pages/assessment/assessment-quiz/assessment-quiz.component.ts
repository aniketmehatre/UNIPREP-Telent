import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'uni-assessment-quiz',
  templateUrl: './assessment-quiz.component.html',
  styleUrls: ['./assessment-quiz.component.scss']
})
export class AssessmentQuizComponent implements OnInit {

  isSkeletonVisible: boolean = true;

  constructor(private assessmentService: AssessmentService, private location: Location) { }

  ngOnInit(): void {
    this.getAssessmentsQuiz();
  }

  getAssessmentsQuiz() {
      this.assessmentService.getAssessmentsQuiz({moduleId:21,countryId:0}).subscribe({
        next: (response: any) => {
          this.isSkeletonVisible = false;
        },
        error: (error: any) => {
          this.isSkeletonVisible = false;
        }
      });
    }

  goBack() {
    this.location.back();
  }
}
