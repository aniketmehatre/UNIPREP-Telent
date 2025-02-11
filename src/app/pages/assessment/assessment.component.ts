import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'uni-assessment',
    templateUrl: './assessment.component.html',
    styleUrls: ['./assessment.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule]
})
export class AssessmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
