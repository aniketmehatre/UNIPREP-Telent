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
    path: 'job-tracker/:id',
    loadComponent: () => import('./job-tracker/job-details/job-details.component').then(m => m.JobDetailsComponent)
  },
  {
    path: 'company-tracker',
    loadComponent: () => import('./company-tracker/company-tracker.component').then(m => m.CompanyTracker1Component)
  },
  {
    path: 'company-tracker/:id',
    loadComponent: () => import('./company-connect/company-view/company-view.component').then(m => m.CompanyViewComponent)
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
  {
    path: 'docs-wallet',
    loadComponent: () => import('./docs-wallet/docs-wallet.component').then(m => m.DocsWalletComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
