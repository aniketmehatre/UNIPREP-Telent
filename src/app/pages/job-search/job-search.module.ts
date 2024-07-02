import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobSearchComponent } from './job-search.component';
import { JobHuntComponent } from './job-hunt/job-hunt.component';
import { JobBoardComponent } from './job-board/job-board.component';

@NgModule({
  declarations: [
    JobSearchComponent,
    JobHuntComponent,
    JobBoardComponent
  ],
  imports: [
    CommonModule,
    JobSearchRoutingModule
  ]
})
export class JobSearchModule { }
