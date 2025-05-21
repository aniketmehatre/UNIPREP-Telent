import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingInstituteComponent } from './landing-institute.component';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { LandingPartnerContentComponent } from '../landing-partner/landing-partner-content/landing-partner-content.component';
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
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }

]



@NgModule({
  declarations: [LandingInstituteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LandingPartnerContentComponent,
    DialogModule,
    LandingFooterComponent,
    ScrollTopModule
  ]
})
export class LandingInstituteModule { }
