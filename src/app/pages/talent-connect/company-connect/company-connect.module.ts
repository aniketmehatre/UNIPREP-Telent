import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CompanyConnectComponent } from './company-connect.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyConnectComponent,
  },
  {
    path: ':id',
    loadComponent: () => import('./company-view/company-view.component').then(m => m.CompanyViewComponent)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CompanyConnectModule { }
