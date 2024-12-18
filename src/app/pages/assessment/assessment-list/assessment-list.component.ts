import { Component, OnInit } from '@angular/core';
import { Assessment, AssessmentResponse } from 'src/app/@Models/assessment.model';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'uni-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {

  assessmentList: Assessment[] = [];
  overAllScore: number = 0;
  isSkeletonVisible: boolean = true;
  loopRange = [0, 1, 2, 3, 4];
  
  constructor(
    private assessmentService: AssessmentService,
  ) { }

  ngOnInit(): void {
    this.getAssessmentList();
  }


  getAssessmentList() {
    this.assessmentService.getAssessments().subscribe({
      next: (response: AssessmentResponse) => {
        this.assessmentList = response.module_data;
        this.overAllScore = response.overall_score;
        this.isSkeletonVisible = false;
      },
      error: (error: any) => {
        this.isSkeletonVisible = false;
      }
    });
  }

}
