import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSearchComponent } from './job-search.component';
import { JobHuntComponent } from './job-hunt/job-hunt.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { CoverLetterBuilderComponent } from './cover-letter-builder/cover-letter-builder.component';

const routes: Routes = [
  {
    path: '', component: JobSearchComponent,
    children: [
      { path: 'job-hunt', component: JobHuntComponent },
      { path: 'job-board', component: JobBoardComponent },
      { path: 'cv-builder', component: CvBuilderComponent },
      { path: 'coverletter-builder', component: CoverLetterBuilderComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSearchRoutingModule { }
