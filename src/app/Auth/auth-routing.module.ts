import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { VerificationComponent } from './verification/verification.component';
import {MaintenanceComponent} from "./maintenance/maintenance.component";

const Auhtroutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegistrationComponent,
      },
      {
        path: 'login-new',
        component: LoginComponent,
      },
      {
        path: 'register-new',
        component: RegistrationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'setpassword/:otp/:email',
        component: SetpasswordComponent,
      },
      {
        path: 'verification/:email',
        component: VerificationComponent,
      },
     { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],

  },
  
];

@NgModule({
  imports: [RouterModule.forChild(Auhtroutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
