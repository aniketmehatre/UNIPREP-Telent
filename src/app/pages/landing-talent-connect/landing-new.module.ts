import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LandingNewComponent } from './landing-new.component';
import { LandingFooterComponent } from '../landing/landing-footer/landing-footer.component';

const routes: Routes = [
  {
    path: '',
    component: LandingNewComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./landing-content/landing-content.component').then(m => m.LandingContentComponent),
      },
      {
        path: 'active-jobs',
        loadComponent: () => import('./active-jobs/active-jobs.component').then(m => m.ActiveJobsComponent),
      },
      {
        path: 'employers',
        loadComponent: () => import('./employers/employers.component').then(m => m.EmployersComponent),
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
  
]
@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule.forChild(routes),
    ScrollTopModule,
    LandingFooterComponent
  ],
  declarations: [LandingNewComponent],
  providers: [MessageService, AuthService],
})
export class LandingModule {

 }
