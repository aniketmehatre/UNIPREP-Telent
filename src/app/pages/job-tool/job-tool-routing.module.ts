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
import { PersonalityTestComponent } from './personality-test/personality-test.component';
import { PyshometricTestComponent } from './pyshometric-test/pyshometric-test.component';
import { EmployerTestComponent } from './employer-test/employer-test.component';
import { QuizTestListComponent } from './quiz-test-list/quiz-test-list.component';
import { EmployerSubcategoryComponent } from './employer-subcategory/employer-subcategory.component';

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
      { path: 'company-list', component: CompanyListComponent},
      { path: 'personality-test', component: PersonalityTestComponent },
      { path: 'pyshcometric-test', component: PyshometricTestComponent},
      { path: 'employer-test', component: EmployerTestComponent},
      { path: 'employer-sub-test/:id', component: EmployerSubcategoryComponent},
      { path: 'quiz/:name/list/:id', component: QuizTestListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobToolRoutingModule { }
