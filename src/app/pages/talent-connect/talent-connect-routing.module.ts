import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobTrackerComponent } from './job-tracker/job-tracker.component';
import { CompanyTrackerComponent } from './company-tracker/company-tracker.component';
import {MainListComponent} from "./main-list/main-list.component";
import { CompanyConnectComponent } from './company-connect/company-connect.component';

const routes: Routes = [

  {
    path: 'list',
    component: MainListComponent,
  },
  {
    path: 'job-tracker',
    component: JobTrackerComponent
  },
  {
    path: 'company-tracker',
    component: CompanyTrackerComponent
  },
  {
    path: 'company-connect',
    component: CompanyConnectComponent
  },
  {
    path: '',
    redirectTo: 'list', // Redirect to a default route
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
