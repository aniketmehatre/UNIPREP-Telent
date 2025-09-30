import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/Auth/auth.guard';
import { CoBrandedComponent } from 'src/app/Auth/co-branded/co-branded.component';
import { ForgotPasswordComponent } from 'src/app/Auth/forgot-password/forgot-password.component';
import { LoginComponent } from 'src/app/Auth/login/login.component';
import { RegistrationComponent } from 'src/app/Auth/registration/registration.component';
import { SetpasswordComponent } from 'src/app/Auth/setpassword/setpassword.component';
import { VerificationComponent } from 'src/app/Auth/verification/verification.component';
import {
    EnterpriseSubscriptionComponent
} from 'src/app/components/enterprise-subscription/enterprise-subscription.component';
import { UserResolver } from 'src/app/resolvers/user.resolver';
import { CertificatesComponent } from '../certificates/certificates.component';
import { PrivacyComponent } from '../privacy/privacy.component';
import { LandingComponent } from './landing.component';

export const landingRoutes: Routes = [
    {
        path: "landing",
        component: LandingComponent
    },
    { path: "co", component: CoBrandedComponent },
    { path: "students/login", component: LoginComponent },
    { path: "register", component: RegistrationComponent },
    { path: "login", component: LoginComponent },
    { path: "privacy", component: PrivacyComponent },
    { path: "certificates", component: CertificatesComponent },
    { path: "enterprisepayment/:id", component: EnterpriseSubscriptionComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "verification/:email", component: VerificationComponent },
    { path: "setpassword/:otp/:email", component: SetpasswordComponent },
    // {
    //     path: 'job/:uuid',
    //     loadComponent: () => import('./landing-content/landing-content.component').then(m => m.LandingContentComponent),
    // },
    {
        path: "pages",
        loadChildren: () => import("../../pages/pages.module").then((m) => m.PagesModule),
        // canActivate: [AuthGuard],
        resolve: {
            user: UserResolver,
        },
    },
    {
        path: '',
        component: LandingComponent,
        children: [
            {
                path: 'job/:uuid',
                loadComponent: () => import('./landing-content/landing-content.component').then(m => m.LandingContentComponent),
            },
            {
                path: 'company/:uuid',
                loadComponent: () => import('./landing-content/landing-content.component').then(m => m.LandingContentComponent),
            },
            // {
            //     path: 'talent/:uuid',
            //     loadComponent: () => import('./landing-content/landing-content.component').then(m => m.LandingContentComponent),
            // },
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
                path: 'employer-pay-link',
                loadComponent: () => import('./employer-details/employer-details.component').then(c => c.EmployerDetailsComponent)
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
                path: 'blogs',
                loadComponent: () => import('./bloglist/bloglist.component').then(m => m.BloglistComponent),
            },
            {
                path: "blogs/:slug",
                loadComponent: () => import('./blogdetail/blogdetail.component').then(m => m.BlogdetailComponent)
            },
            {
                path: 'policy/:name',
                loadComponent: () => import('./policy/policy.component').then(m => m.PolicyComponent)
            },
            {
                path: 'success-story',
                loadComponent: () => import('./success-story/success-story.component').then(c => c.SuccessStoryComponent)
            },
            {
                path: 'training-program',
                loadComponent: () => import('./training-program/training-program.component').then(c => c.TrainingProgramComponent)
            },
            {
                path: 'success-story/:id',
                loadComponent: () => import('./success-story/success-story.component').then(c => c.SuccessStoryComponent)
            },
            {
                path: ':category',
                loadComponent: () => import('./job-seekers-landing/job-seekers-landing.component').then(m => m.JobSeekersLandingComponent),
            },
            {
                path: ':category/:slug',
                loadComponent: () => import('./landing-language-hub/landing-language-hub.component').then(m => m.LandingLanguageHubComponent),
                pathMatch: 'full'
            },
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            },
        ]
    },

];