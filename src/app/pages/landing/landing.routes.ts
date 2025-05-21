import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/Auth/auth.guard';
import { CoBrandedComponent } from 'src/app/Auth/co-branded/co-branded.component';
import { ForgotPasswordComponent } from 'src/app/Auth/forgot-password/forgot-password.component';
import { LoginComponent } from 'src/app/Auth/login/login.component';
import { RegistrationComponent } from 'src/app/Auth/registration/registration.component';
import { SetpasswordComponent } from 'src/app/Auth/setpassword/setpassword.component';
import { VerificationComponent } from 'src/app/Auth/verification/verification.component';
import { EnterpriseSubscriptionComponent } from 'src/app/components/enterprise-subscription/enterprise-subscription.component';
import { UserResolver } from 'src/app/resolvers/user.resolver';
import { BlogdetailComponent } from './blogdetail/blogdetail.component';
import { BloglistComponent } from './bloglist/bloglist.component';
import { CertificatesComponent } from '../certificates/certificates.component';
import { PrivacyComponent } from '../privacy/privacy.component';
import { LandingComponent } from './landing.component';

export const landingRoutes: Routes = [
  // ...appRoutes,
  {
    path: "landing",
    component: LandingComponent
  },
  {
    path: 'institute',
    loadChildren: () => import('../landing-institute/landing-institute.module').then(c => c.LandingInstituteModule)
  },
  {
    path: 'partner',
    loadChildren: () => import('../landing-partner/landing-partner.module').then(c => c.LandingPartnerModule),
  },
  { path: "students", component: CoBrandedComponent },
  { path: "students/login", component: LoginComponent },
  { path: "register", component: RegistrationComponent },
  { path: "login", component: LoginComponent },
  { path: "privacy", component: PrivacyComponent },
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
    path: 'institute/login',
    loadComponent: () => import('../institution-login/institution-login.component').then(m => m.InstitutionLoginComponent),
  },

  {
    path: 'partner/login',
    loadComponent: () => import('../partner-login/partner-login.component').then(m => m.PartnerLoginComponent),
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
        path: 'blogs',
        loadComponent: () => import('./bloglist/bloglist.component').then(m => m.BloglistComponent),
      },
      {
        path: "blogs/:slug",
        loadComponent: () => import('./blogdetail/blogdetail.component').then(m => m.BlogdetailComponent)
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
  
];