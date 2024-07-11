import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobToolComponent } from './job-tool.component';
const routes: Routes = [
  {
    path: '', component: JobToolComponent,
    // children: [
    //   { path: 'job-search', component: JobHuntComponent },
    //   { path: 'job-tracker', component: JobBoardComponent },
    //   { path: 'cv-builder', component: CvBuilderComponent },
    //   { path: 'coverletter-builder', component: CoverLetterBuilderComponent },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobToolRoutingModule { }
