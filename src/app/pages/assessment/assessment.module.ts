import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment.component';
import { AssessmentRoutingModule } from './assessment-routing.module';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { IlearnChallengeComponent } from './ilearn-challenge/ilearn-challenge.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { TableModule } from 'primeng/table';
import { ContestRulesComponent } from './contest-rules/contest-rules.component';
import { AssessmentQuizComponent } from './assessment-quiz/assessment-quiz.component';



@NgModule({
  declarations: [
    AssessmentComponent,
    IlearnChallengeComponent,
    AssessmentListComponent,
    ContestRulesComponent,
    AssessmentQuizComponent
  ],
  imports: [
    CommonModule,
    AssessmentRoutingModule,
    SkeletonModule,
    TooltipModule,
    TableModule,
  ]
})
export class AssessmentModule { }
