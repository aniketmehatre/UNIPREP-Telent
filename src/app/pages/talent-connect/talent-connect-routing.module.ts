import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentConnectComponent } from './talent-connect.component';
import { JobTrackerComponent } from './job-tracker/job-tracker.component';
import { MainListComponent } from "./main-list/main-list.component";
import { CompanyTrackerComponent } from './company-tracker/company-tracker.component';

const routes: Routes = [
  {
    path: '', component: TalentConnectComponent,
  },
  {
    path: 'list',
    component: TalentConnectComponent
  },
  {
    path: 'job-tracker',
    component: JobTrackerComponent
  },
  {
    path: 'company-tracker',
    component: CompanyTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
