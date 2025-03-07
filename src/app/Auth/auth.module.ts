import { GoogleSigninButtonModule } from "@abacritt/angularx-social-login";
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MessageService } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ToastModule } from "primeng/toast";
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { RegistrationComponent } from './registration/registration.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { AuthEffects } from "./store/effects";
import { authFeature } from "./store/reducer";
import { VerificationComponent } from './verification/verification.component';

import {GoogleSigninButtonModule} from "@abacritt/angularx-social-login";
import {MaintenanceComponent} from "./maintenance/maintenance.component";
import { ScrollTopModule } from "primeng/scrolltop";
@NgModule({
  declarations: [
    ForgotPasswordComponent,
    VerificationComponent,
    SetpasswordComponent,
    MaintenanceComponent
  ],
  // imports: [
  //   FormsModule,
  //   LoginComponent,
  //   RegistrationComponent,
  //   InputGroupModule,
  //   InputGroupAddonModule,
  //   AuthComponent,
  //   ReactiveFormsModule,
  //   InputIconModule,
  //   CommonModule,
  //   RouterModule,
  //   AuthRoutingModule,
  //   InputTextModule,
  //   PasswordModule,
  //   ToastModule,
  //   CalendarModule,
  //   NgxIntlTelInputModule,
  //   GoogleSigninButtonModule,
  //   StoreModule.forFeature(authFeature),
  //   EffectsModule.forFeature([AuthEffects])
  // ],
  // providers: [
  //   MessageService
  // ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AuthRoutingModule,
        InputTextModule,
        ScrollTopModule,
        PasswordModule,
        ToastModule,
        StoreModule.forFeature(authFeature),
        EffectsModule.forFeature([AuthEffects]),
        CalendarModule,
        NgxIntlTelInputModule,
        GoogleSigninButtonModule
    ],
    providers: [MessageService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }
