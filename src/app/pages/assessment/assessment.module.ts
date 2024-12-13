import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment.component';
import { AssessmentRoutingModule } from './assessment-routing.module';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { IlearnChallengeComponent } from './ilearn-challenge/ilearn-challenge.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    AssessmentComponent,
    IlearnChallengeComponent,
    AssessmentListComponent
  ],
  imports: [
    CommonModule,
    AssessmentRoutingModule,
    SkeletonModule,
    TooltipModule,
    TableModule
  ]
})
export class AssessmentModule { }
