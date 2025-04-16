import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobToolComponent } from './job-tool.component';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { CoverLetterBuilderComponent } from './cover-letter-builder/cover-letter-builder.component';
import { CareerToolComponent } from './career-tool/career-tool.component';
import { CostOfLivingComponent } from './cost-of-living/cost-of-living.component';
import {SalaryConverterComponent} from "./salary-converter/salary-converter.component";
import { CareerPlannerComponent } from '../career-planner/career-planner.component';
import { CompanyListComponent } from '../company-list/company-list.component';
import { QuizTestListComponent } from './quiz-test-list/quiz-test-list.component';
import { EmployerSubcategoryComponent } from './employer-subcategory/employer-subcategory.component';
import { CareerCategoryListComponent } from './career-category-list/career-category-list.component';
import { CareerGrowthCheckerComponent } from '../career-growth-checker/career-growth-checker.component';
// import { CarrerplannerlistComponent } from './carrerplannerlist/carrerplannerlist.component';
import { CareerplannercountrywiseComponent } from './careerplannercountrywise/careerplannercountrywise.component';
import { GlobalTravelVisaComponent } from '../travel-tools/global-travel-visa/global-travel-visa.component';

const routes: Routes = [
  {
    path: '', component: JobToolComponent,
    children: [
      {path: '',  redirectTo: 'career-tool', pathMatch: 'full'},
      { path: 'cv-builder', component: CvBuilderComponent },
      { path: 'coverletter-builder', component: CoverLetterBuilderComponent },
      { path: 'career-tool', component: CareerToolComponent },
      { path: 'cost-of-living', component: CostOfLivingComponent },
      { path: 'salary-converter', component: SalaryConverterComponent },
      { path: 'career-planner', component: CareerPlannerComponent},
      { path: 'company-list', component: CompanyListComponent},
      { path: 'list/:name/:id', component: CareerCategoryListComponent },
      { path: 'employer-sub-test/:id', component: EmployerSubcategoryComponent},
      { path: 'quiz/:name/list/:id', component: QuizTestListComponent},
      { path: 'career-growth-checker', component: CareerGrowthCheckerComponent},
      // { path: 'careerplannerlist', component: CarrerplannerlistComponent},
      { path: 'careerplannercountrywise', component: CareerplannercountrywiseComponent},
      { path: 'global-work-visa', component: GlobalTravelVisaComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobToolRoutingModule { }
