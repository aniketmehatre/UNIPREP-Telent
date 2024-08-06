import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobToolComponent } from './job-tool.component';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { CoverLetterBuilderComponent } from './cover-letter-builder/cover-letter-builder.component';
import { CareerToolComponent } from './career-tool/career-tool.component';
import { CostOfLivingComponent } from './cost-of-living/cost-of-living.component';
import { ComparisionComponent } from './cost-of-living/comparision/comparision.component';
import {SalaryConverterComponent} from "./salary-converter/salary-converter.component";
import { CareerPlannerComponent } from '../career-planner/career-planner.component';
import { CompanyListComponent } from '../company-list/company-list.component';

const routes: Routes = [
  {
    path: '', component: JobToolComponent,
    children: [
      { path: 'cv-builder', component: CvBuilderComponent },
      { path: 'coverletter-builder', component: CoverLetterBuilderComponent },
      { path: 'career-tool', component: CareerToolComponent },
      { path: 'cost-of-living', component: CostOfLivingComponent },
      { path: 'salary-converter', component: SalaryConverterComponent },
      { path: 'career-planner', component: CareerPlannerComponent},
      { path: 'company-list', component: CompanyListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobToolRoutingModule { }
