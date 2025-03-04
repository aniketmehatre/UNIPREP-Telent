import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyTrackerComponent } from './company-tracker/company-tracker.component';
import {MainListComponent} from "./main-list/main-list.component";
import {JobTrackerComponent} from "./job-tracker/job-tracker.component";

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
    loadChildren: () => import('./company-connect/company-connect.module').then(m => m.CompanyConnectModule)
  },
  {
    path: 'easy-apply',
    loadChildren: () => import('./easy-apply/easy-apply.module').then(m => m.EasyApplyModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./employee-profile/employee-profile.module').then(m => m.EmployeeProfileModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
