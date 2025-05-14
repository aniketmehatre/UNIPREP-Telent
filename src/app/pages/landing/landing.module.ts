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
import { AuthGuard } from 'src/app/Auth/auth.guard';
import { CoBrandedComponent } from 'src/app/Auth/co-branded/co-branded.component';
import { ForgotPasswordComponent } from 'src/app/Auth/forgot-password/forgot-password.component';
import { SetpasswordComponent } from 'src/app/Auth/setpassword/setpassword.component';
import { VerificationComponent } from 'src/app/Auth/verification/verification.component';
import { EnterpriseSubscriptionComponent } from 'src/app/components/enterprise-subscription/enterprise-subscription.component';
import { UserResolver } from 'src/app/resolvers/user.resolver';
import { LoginComponent } from '../../Auth/login/login.component';
import { RegistrationComponent } from '../../Auth/registration/registration.component';
import { BlogdetailComponent } from '../blogdetail/blogdetail.component';
import { BloglistComponent } from '../bloglist/bloglist.component';
import { CertificatesComponent } from '../certificates/certificates.component';
import { PrivacyComponent } from '../privacy/privacy.component';

const routes: Routes = [
  // ...appRoutes,
  {
    path: "landing",
    component: LandingComponent
  },
  { path: "students", component: CoBrandedComponent },
  { path: "students/login", component: LoginComponent },
  { path: "register", component: RegistrationComponent },
  { path: "login", component: LoginComponent },
  { path: "privacy", component: PrivacyComponent },
  { path: "blogs", component: BloglistComponent },
  { path: "blogs/:slug", component: BlogdetailComponent },
  { path: "certificates", component: CertificatesComponent },
  { path: "enterprisepayment/:id", component: EnterpriseSubscriptionComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "verification/:email", component: VerificationComponent },
  { path: "setpassword/:otp/:email", component: SetpasswordComponent },
  {
    path: 'talent-connect',
    loadChildren: () => import('../landing-talent-connect/landing-new.module').then(c => c.LandingModule)
  },
  {
    path: "pages",
    loadChildren: () => import("../../pages/pages.module").then((m) => m.PagesModule),
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
    },
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
