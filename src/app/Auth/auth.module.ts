import { GoogleSigninButtonModule } from "@abacritt/angularx-social-login";
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from "@ngrx/effects";
import { provideState, provideStore, StoreModule } from "@ngrx/store";
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

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    VerificationComponent,
    SetpasswordComponent,
    MaintenanceComponent
  ],
  imports: [
    FormsModule,
    LoginComponent,
    RegistrationComponent,
    InputGroupModule,
    InputGroupAddonModule,
    AuthComponent,
    ReactiveFormsModule,
    InputIconModule,
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    InputTextModule,
    
    PasswordModule,
    ToastModule,
    CalendarModule,
    NgxIntlTelInputModule,
    GoogleSigninButtonModule,
    // StoreModule.forFeature(authFeature),
    // EffectsModule.forFeature([AuthEffects])
  ],
  providers: [
    // provideStore(),  // Initialize Store
    // provideState({ auth: authReducer }), // Register Auth Reducer
    // importProvidersFrom(EffectsModule.forRoot([AuthEffects])) // Register Effects
    provideStore(), // Initialize Store
    provideState(authFeature), // Pass the feature slice to provideState
    importProvidersFrom(EffectsModule.forRoot([AuthEffects])),
    importProvidersFrom(StoreModule.forRoot({})), // Ensure StoreModule is correctly initialized
    // provideEffects(AuthEffects),
    MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }
