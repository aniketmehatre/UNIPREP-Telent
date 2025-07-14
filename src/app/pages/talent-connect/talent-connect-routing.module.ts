import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainListComponent} from "./main-list/main-list.component";

const routes: Routes = [
  {
    path: 'list',
    component: MainListComponent,
  },
  {
    path: 'job-tracker',
    loadComponent: () => import('./job-tracker/job-tracker.component').then(m => m.JobTrackerComponent)
  },
  {
    path: 'company-tracker',
    loadComponent: () => import('./company-tracker/company-tracker.component').then(m => m.CompanyTracker1Component)
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
