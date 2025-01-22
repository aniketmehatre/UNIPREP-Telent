import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment.component';
import { AssessmentRoutingModule } from './assessment-routing.module';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { IlearnChallengeComponent } from './ilearn-challenge/ilearn-challenge.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { TableModule } from 'primeng/table';
import { AssessmentQuizComponent } from './assessment-quiz/assessment-quiz.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { AssessmentQuizReviewComponent } from './assessment-quiz-review/assessment-quiz-review.component';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    AssessmentComponent,
    IlearnChallengeComponent,
    AssessmentListComponent,
    AssessmentQuizComponent,
    AssessmentQuizReviewComponent,
  ],
  imports: [
    CommonModule,
    AssessmentRoutingModule,
    SkeletonModule,
    TooltipModule,
    TableModule,
    RadioButtonModule,
    ProgressBarModule,
    DialogModule,
    FormsModule,
    DropdownModule
  ]
})
export class AssessmentModule { }
