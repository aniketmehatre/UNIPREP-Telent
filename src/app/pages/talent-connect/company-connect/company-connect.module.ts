import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyConnectComponent } from './company-connect.component';
import { CompanyViewComponent } from './company-view/company-view.component';
import { RouterModule, Routes } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { JobChatUiComponent } from '../job-tracker/job-chat-ui/job-chat-ui.component';
import { TalentConnectModule } from '../talent-connect.module';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [ 
      {
        path: '', 
        component: CompanyConnectComponent,
      },
      {
        path: ':id',
        component: CompanyViewComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
      }
  ]

@NgModule({
  declarations: [CompanyConnectComponent, CompanyViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChipModule,
    TalentConnectModule,
    DialogModule,
    DropdownModule,
  ]
})
export class CompanyConnectModule { }
