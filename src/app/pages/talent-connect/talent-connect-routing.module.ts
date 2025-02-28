import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentConnectComponent } from './talent-connect.component';
import { JobTrackerComponent } from './job-tracker/job-tracker.component';
import { CompanyTrackerComponent } from './company-tracker/company-tracker.component';
import {MainListComponent} from "./main-list/main-list.component";
import { CompanyConnectComponent } from './company-connect/company-connect.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list', // Redirect to a default route
    pathMatch: 'full'
  },
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
    loadChildren: () => import('./company-connect/company-connect.module').then(m => m.CompanyConnectModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
