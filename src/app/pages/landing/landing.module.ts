import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTop, ScrollTopModule } from 'primeng/scrolltop';
import { JobSeekersLandingComponent } from './job-seekers-landing/job-seekers-landing.component';
import { LandingLanguageHubComponent } from './landing-language-hub/landing-language-hub.component';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LandingFooterComponent } from "./landing-footer/landing-footer.component";
const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../../Auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('../../Auth/registration/registration.component').then(m => m.RegistrationComponent),
  },
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./landing-content/landing-content.component').then(m => m.LandingContentComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./about-us/about-us.component').then(m => m.AboutUsComponent),
      },
      {
        path: 'international-sub',
        loadComponent: () => import('../international-subscription/international-subscription.component').then(c => c.InternationalSubscriptionComponent)
      },
      {
        path: 'contact-us',
        loadComponent: () => import('./contact-us/contact-us.component').then(c => c.ContactUsComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pricing/pricing.component').then(c => c.PricingComponent)
      },
      {
        path: 'management-team',
        loadComponent: () => import('./management-team/management-team.component').then(m => m.ManagementTeamComponent),
      },
      {
        path: 'compare/:country',
        loadComponent: () => import('../compare-uni/compare-uni.component').then(c => c.CompareUniComponent)
      },
      {
        path: ':category',
        loadComponent: () => import('./job-seekers-landing/job-seekers-landing.component').then(m => m.JobSeekersLandingComponent),
      },
      {
        path: ':category/:slug',
        loadComponent: () => import('./landing-language-hub/landing-language-hub.component').then(m => m.LandingLanguageHubComponent),
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  
]
@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule.forChild(routes),
    ScrollTopModule,
    LandingLanguageHubComponent,
    JobSeekersLandingComponent
    // Empty reducer configuration or actual reducers here
    ,
    LandingFooterComponent
  ],
  declarations: [LandingComponent],
  providers: [MessageService, AuthService],
})
export class LandingModule {

 }
