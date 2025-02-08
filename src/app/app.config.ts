import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http"
import { ApplicationConfig } from "@angular/core"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { RouterModule, Routes, provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from "@angular/router"
import { providePrimeNG } from "primeng/config"
import Aura from "@primeng/themes/aura"
import { appRoutes } from "./app.routes"
import { LandingComponent } from "./pages/landing/landing.component"
import { provideStore } from "@ngrx/store"
import { DeviceDetectorService } from "ngx-device-detector"
import { DatePipe } from "@angular/common"
import { AuthService } from "./Auth/auth.service"
import { EnterpriseSubscriptionService } from "./components/enterprise-subscription/enterprise-subscription.service"
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor"
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage"
import { ModalService } from "./components/modal/modal.service"
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from "angularx-social-login"
import { pagesReducer } from "./pages/store/pages.reducer"
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt"
import { environment } from "@env/environment"
import { authFeature } from "./Auth/store/reducer"
import { DashboardComponent } from "./pages/dashboard/dashboard.component"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './Auth/store/effects';
import { MessageService } from 'primeng/api';
import { HttpRequest, HttpHandlerFn } from "@angular/common/http"

// Assuming ngxLocalstorageConfiguration is properly defined elsewhere in your code
const ngxLocalstorageConfiguration = NGX_LOCAL_STORAGE_CONFIG as unknown as { prefix: string, delimiter: string };

export function tokenGetter(): string {
  const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
  const token = localStorage.getItem(tokenKey);
  return token ? token.replace(/"/g, '') : '';
}

export const jwtOptionsFactory = () => ({
  tokenGetter,
  allowedDomains: [environment.domain],
  disallowedRoutes: []
});

// Add this JWT interceptor function
export const jwtInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = tokenGetter();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
	providers: [
    provideStore({
      auth: authFeature.reducer,
      pages: pagesReducer
    }),
    provideEffects(AuthEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    }),
		provideRouter(
			appRoutes,
			withInMemoryScrolling({
				anchorScrolling: "enabled",
				scrollPositionRestoration: "enabled",
			}),
			withEnabledBlockingInitialNavigation()
		),
		provideHttpClient(
			withFetch(),
			withInterceptors([jwtInterceptor, HttpErrorInterceptor])
		),
		{ provide: JWT_OPTIONS, useFactory: jwtOptionsFactory },
		JwtHelperService,
		MessageService,
		provideAnimationsAsync(),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: ".app-dark",
				},
			},
		}),
		LandingComponent,
		DashboardComponent,
		DeviceDetectorService,
		DatePipe,
		AuthService,
		EnterpriseSubscriptionService,
		{
			provide: NGX_LOCAL_STORAGE_CONFIG,
			useValue: NGX_LOCAL_STORAGE_CONFIG,
		},
		ModalService,
		{
			provide: "SocialAuthServiceConfig",
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider("32944187384-4jubeedmfdusvhk6n7ben61ce7u9ber8.apps.googleusercontent.com", {
							oneTapEnabled: false,
						}),
					},
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider("892925195633254"),
					},
				],
			} as SocialAuthServiceConfig,
		},
	],
}
