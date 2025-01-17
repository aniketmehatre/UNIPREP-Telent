import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationToolsComponent } from './education-tools.component';
import { EducationToolsListComponent } from './education-tools-list/education-tools-list.component';
import { CourseNavigatorComponent } from './course-navigator/course-navigator.component';
import { PoliticianInsightsComponent } from './politician-insights/politician-insights.component';

const routes: Routes = [
  {
    path: '', component: EducationToolsComponent,
    children: [
      {
        path: '', component: EducationToolsListComponent
      },
      {
        path:'course-navigator', component:CourseNavigatorComponent
      },
      {
        path: 'politician-insights', component: PoliticianInsightsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationToolsRoutingModule { }
