import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationToolsComponent } from './education-tools.component';
import { EducationToolsListComponent } from './education-tools-list/education-tools-list.component';
import { CourseNavigatorComponent } from './course-navigator/course-navigator.component';
import { PoliticianInsightsComponent } from './politician-insights/politician-insights.component';
import { GlobalTravelVisaComponent } from '../travel-tools/global-travel-visa/global-travel-visa.component';
import { CountryInsightsComponent } from './country-insights/country-insights.component';
import { CountryInsightsSubmoduleComponent } from './country-insights/country-insights-submodule/country-insights-submodule.component';
import { StudentBudgetPlannerComponent } from './student-budget-planner/student-budget-planner.component';
import { WealthleaderreadansComponent } from '../founderstool/wealthleaderreadans/wealthleaderreadans.component';
import { WealthleaderslistComponent } from '../founderstool/wealthleaderslist/wealthleaderslist.component';
import { UniCompareComponent } from './uni-compare/uni-compare.component';
import { GlobalEdufitComponent } from './global-edufit/global-edufit.component';

const routes: Routes = [
  {
    path: '', component: EducationToolsComponent,
    children: [
      {
        path: '', component: EducationToolsListComponent
      },
      {
        path: 'course-navigator', component: CourseNavigatorComponent
      },
      {
        path: 'course-navigator/:degreeId/:questionId', component: CourseNavigatorComponent // Question Share
      },
      {
        path: 'politician-insights', component: PoliticianInsightsComponent
      },
      {
        path: 'country-insights',
        component: CountryInsightsComponent,
      },
      {
        path: 'country-insights/:id',
        component: CountryInsightsSubmoduleComponent
      },
      {
        path: 'study-visa', component: GlobalTravelVisaComponent
      },
      {
        path:'student-budget-planner', component: StudentBudgetPlannerComponent
      },
      {
        path: 'wealthleaderslist', component: WealthleaderslistComponent
      },
      {
        path: 'wealthleaderreadanswer/:id', component: WealthleaderreadansComponent
      },
      {
        path: 'uni-compare', component: UniCompareComponent
      },
      {
        path: 'global-edufit', component: GlobalEdufitComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationToolsRoutingModule { }
