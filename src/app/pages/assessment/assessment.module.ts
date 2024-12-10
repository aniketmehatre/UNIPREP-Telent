import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment.component';
import { AssessmentRoutingModule } from './assessment-routing.module';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [
    AssessmentComponent
  ],
  imports: [
    CommonModule,
    AssessmentRoutingModule,
    SkeletonModule,
    TooltipModule
  ]
})
export class AssessmentModule { }
