import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasyApplyComponent } from './easy-apply.component';
import { RouterModule, Routes } from '@angular/router';
import { CompanyViewComponent } from '../company-connect/company-view/company-view.component';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TalentConnectModule } from '../talent-connect.module';
import { JobViewComponent } from './job-view/job-view.component';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  {
    path: '',
    component: EasyApplyComponent,
  },
  {
    path: ':id',
    component: JobViewComponent
  }
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChipModule,
    DialogModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule
  ]
})
export class EasyApplyModule { }
