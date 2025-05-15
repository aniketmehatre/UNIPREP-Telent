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
import { landingRoutes } from './landing.routes';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule.forChild(landingRoutes),
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
