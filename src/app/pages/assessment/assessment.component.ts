import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'uni-assessment',
    templateUrl: './assessment.component.html',
    styleUrls: ['./assessment.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AssessmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
