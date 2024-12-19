import { Component, OnInit } from '@angular/core';
import { Assessment, ModuleDaum } from 'src/app/@Models/assessment.model';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'uni-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {

  assessmentList: ModuleDaum[] = [];
  isSkeletonVisible: boolean = true;
  loopRange = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  overallScore: number;
  
  constructor(
    private assessmentService: AssessmentService,
  ) { }

  ngOnInit(): void {
    this.getAssessmentList();
  }


  getAssessmentList() {
    this.assessmentService.getAssessments().subscribe(
      (response: Assessment) => {
        this.assessmentList = response.module_data; 
        this.overallScore = response.overall_score;
        this.isSkeletonVisible = false;
      },
      (error) => {
        console.error('Error:', error);
        this.isSkeletonVisible = false;
      }
    );
  }
  

}
