import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assessment } from 'src/app/@Models/assessment.model';
import { AssessmentService } from './assessment.service';

@Component({
  selector: 'uni-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {

  assessmentList: Assessment[] = [];
  isSkeletonVisible: boolean = true;
  loopRange = [0, 1, 2, 3, 4];
  
  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAssessmentList();
  }


  getAssessmentList() {
    this.assessmentService.getAssessments().subscribe({
      next: (response: Assessment[]) => {
        this.assessmentList = response;
        this.isSkeletonVisible = false;
      },
      error: (error: any) => {
        this.isSkeletonVisible = false;
      }
    });
  }

}
