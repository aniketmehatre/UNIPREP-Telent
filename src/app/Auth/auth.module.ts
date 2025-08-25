import { CommonModule } from "@angular/common"
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { EffectsModule } from "@ngrx/effects"
import { StoreModule } from "@ngrx/store"
import { NgxIntlTelInputModule } from "ngx-intl-tel-input"
import { MessageService } from "primeng/api"
import { DatePickerModule } from "primeng/datepicker"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputTextModule } from "primeng/inputtext"
import { PasswordModule } from "primeng/password"
import { ToastModule } from "primeng/toast"
import { AuthEffects } from "./store/effects"
import { authFeature } from "./store/reducer"

import { ScrollTopModule } from "primeng/scrolltop"
import { MaintenanceComponent } from "./maintenance/maintenance.component"

import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "@abacritt/angularx-social-login"
@NgModule({
	declarations: [MaintenanceComponent],
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
	imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, InputTextModule, 
		ScrollTopModule, PasswordModule, ToastModule, StoreModule.forFeature(authFeature), 
		EffectsModule.forFeature([AuthEffects]), DatePickerModule, NgxIntlTelInputModule, 
		SocialLoginModule, InputGroupModule, InputGroupAddonModule],
	providers: [
		MessageService,
		{
			provide: "SocialAuthServiceConfig",
			useValue: {
				autoLogin: false,
				lang: "en",
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider("750560403636-pd8q2gts7v35t7opukgohhtkspf9ftgo.apps.googleusercontent.com", {
							scopes: ["email", "profile", "openid"], // 🔹 Use "scopes" (not "scope")
							oneTapEnabled: true,
						}), // Replace with actual Client ID
					},
				],
				onError: (err) => {
					console.error(err)
				},
			} as SocialAuthServiceConfig,
		},
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }
