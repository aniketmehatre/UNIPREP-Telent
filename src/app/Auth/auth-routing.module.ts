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
        data: { title: 'Login' } 
      },
      {
        path: 'register',
        component: RegistrationComponent,
        data: { title: 'Register' } 
      },
      {
        path: 'login-new',
        component: LoginComponent,
        data: { title: 'Login New' }
      },
      {
        path: 'register-new',
        component: RegistrationComponent,
        data: { title: 'Register New' }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot Password' }
      },
      {
        path: 'setpassword/:otp/:email',
        component: SetpasswordComponent,
        data: { title: 'Set Password' }
      },
      {
        path: 'verification/:email',
        component: VerificationComponent,
        data: { title: 'Verification' }
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
