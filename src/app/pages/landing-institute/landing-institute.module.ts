import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingInstituteComponent } from './landing-institute.component';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { LandingFooterComponent } from '../landing/landing-footer/landing-footer.component';
import { ScrollTopModule } from 'primeng/scrolltop';

const routes: Routes = [
  {
    path: '',
    component: LandingInstituteComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./landing-institute-content/landing-institute-content.component').then(m => m.LandingInstituteContentComponent),
      },
      {
        path: 'pricing/:country',
        loadComponent: () => import('./institute-pricing/institute-pricing.component').then(m => m.InstitutePricingComponent)
      },
      {
        path: 'compare/:country',
        loadComponent: () => import('../landing-institute/compare-uni/compare-uni.component').then(c => c.CompareUniComponent)
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'institute/login',
    loadComponent: () => import('../institution-login/institution-login.component').then(m => m.InstitutionLoginComponent),
  },
    {
    path: 'institute/register',
    loadComponent: () => import('./institute-register/institute-register.component').then(m => m.InstituteRegisterComponent),
  },
]

@NgModule({
  declarations: [LandingInstituteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DialogModule,
    LandingFooterComponent,
    ScrollTopModule
  ]
})
export class LandingInstituteModule { }
