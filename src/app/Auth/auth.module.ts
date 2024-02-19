import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerificationComponent } from './verification/verification.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {StoreModule} from "@ngrx/store";
import {authFeatureKey} from "./store/selectors";
import {authReducer} from "./store/reducer";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./store/effects";
import {CalendarModule} from "primeng/calendar";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {GoogleSigninButtonModule} from "@abacritt/angularx-social-login";
import {MaintenanceComponent} from "./maintenance/maintenance.component";

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    VerificationComponent,
    SetpasswordComponent,
      MaintenanceComponent
  ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        AuthRoutingModule,
        InputTextModule,
        DropdownModule,
        PasswordModule,
        ToastModule,
        StoreModule.forFeature(authFeatureKey, authReducer),
        EffectsModule.forFeature([AuthEffects]),
        CalendarModule,
        NgxIntlTelInputModule,
        GoogleSigninButtonModule
    ],
    providers: [MessageService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }
