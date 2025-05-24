import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPartnerComponent } from './landing-partner.component';
import { RouterModule, Routes } from '@angular/router';
import { LandingPartnerContentComponent } from './landing-partner-content/landing-partner-content.component';
import { DialogModule } from 'primeng/dialog';
import { LandingFooterComponent } from '../landing/landing-footer/landing-footer.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPartnerComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./landing-partner-content/landing-partner-content.component').then(m => m.LandingPartnerContentComponent),
      },

      // {
      //   path: 'contact-us',
      //   loadComponent: () => import('../landing/contact-us/contact-us.component').then(m => m.ContactUsComponent),
      // },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'partner/login',
    loadComponent: () => import('./partner-login/partner-login.component').then(m => m.PartnerLoginComponent)
  },

]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LandingPartnerContentComponent,
    DialogModule,
    LandingFooterComponent
  ],
  declarations: [LandingPartnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPartnerModule { }
