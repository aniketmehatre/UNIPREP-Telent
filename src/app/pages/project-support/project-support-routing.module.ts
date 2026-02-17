import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'project-list', component: ProjectListComponent },
      { path: 'project-details/:id', component: ProjectViewComponent },
      { path: '', redirectTo: 'project-list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectSupportRoutingModule { }
