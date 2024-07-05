import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobSearchComponent } from './job-search.component';
import { JobHuntComponent } from './job-hunt/job-hunt.component';
import { JobBoardComponent } from './job-board/job-board.component';
import {InputTextModule} from 'primeng/inputtext';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { CoverLetterBuilderComponent } from './cover-letter-builder/cover-letter-builder.component';

@NgModule({
  declarations: [
    JobSearchComponent,
    JobHuntComponent,
    JobBoardComponent,
    CvBuilderComponent,
    CoverLetterBuilderComponent
  ],
  imports: [
    CommonModule,
    JobSearchRoutingModule,
    InputTextModule
  ]
})
export class JobSearchModule { }
