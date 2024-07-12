import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobToolComponent } from './job-tool.component';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { CoverLetterBuilderComponent } from './cover-letter-builder/cover-letter-builder.component';
import { CareerToolComponent } from './career-tool/career-tool.component';

const routes: Routes = [
  {
    path: '', component: JobToolComponent,
    children: [
      { path: 'cv-builder', component: CvBuilderComponent },
      { path: 'coverletter-builder', component: CoverLetterBuilderComponent },
      { path: 'career-tool', component: CareerToolComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobToolRoutingModule { }
