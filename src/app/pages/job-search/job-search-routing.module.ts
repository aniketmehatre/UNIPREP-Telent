import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSearchComponent } from './job-search.component';
import { JobHuntComponent } from './job-hunt/job-hunt.component';
import { JobBoardComponent } from './job-board/job-board.component';

const routes: Routes = [
  {
    path: '', component: JobSearchComponent,
    children: [
      { path: 'job-search', component: JobHuntComponent },
      { path: 'job-tracker', component: JobBoardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSearchRoutingModule { }
