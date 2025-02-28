import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentConnectComponent } from './talent-connect.component';
import { JobTrackerComponent } from './job-tracker/job-tracker.component';
import { CompanyTrackerComponent } from './company-tracker/company-tracker.component';
import {MainListComponent} from "./main-list/main-list.component";

const routes: Routes = [ 
      {
        path: '', 
        component: MainListComponent,
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
        path: '',
        redirectTo: 'list',
        pathMatch: 'full' // Ensures full match before redirecting
      },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
