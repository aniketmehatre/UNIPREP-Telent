import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from "@angular/common/http"
import { ApplicationConfig, importProvidersFrom, isDevMode } from "@angular/core"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { RouterModule, Routes, provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withViewTransitions } from "@angular/router"
import { providePrimeNG } from "primeng/config"
import { appRoutes } from "./app.routes"
import { LandingComponent } from "./pages/landing/landing.component"
import { DeviceDetectorService } from "ngx-device-detector"
import { DatePipe } from "@angular/common"
import { AuthService } from "./Auth/auth.service"
import { EnterpriseSubscriptionService } from "./components/enterprise-subscription/enterprise-subscription.service"
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor"
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage"
import { ModalService } from "./components/modal/modal.service"
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { pagesReducer } from "./pages/store/pages.reducer"
import { JwtModule } from "@auth0/angular-jwt"
import { environment } from "@env/environment"
import { authFeature } from "./Auth/store/reducer"
import { DashboardComponent } from "./pages/dashboard/dashboard.component"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import { AuthEffects } from './Auth/store/effects';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import MyPreset from "./mypreset"
import { LandingModule } from "./pages/landing/landing.module"

// Assuming ngxLocalstorageConfiguration is properly defined elsewhere in your code
const ngxLocalstorageConfiguration = NGX_LOCAL_STORAGE_CONFIG as unknown as {
  prefix: string;
  delimiter: string;
};

export function tokenGetter(): string {
  // Try both possible token keys
  const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
  const token =
    localStorage.getItem(tokenKey) ||
      localStorage.getItem(environment.tokenKey);

  if (!token) {
    console.debug("No token found in localStorage");
    return "";
  }

  try {
    // Remove quotes and any whitespace
    const cleanToken = token.replace(/['"]+/g, "").trim();
    return cleanToken;
  } catch (error) {
    console.error("Error processing token:", error);
    return "";
  }
}

export let appConfig: ApplicationConfig;
appConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
                '750560403636-pd8q2gts7v35t7opukgohhtkspf9ftgo.apps.googleusercontent.com'
            )
          }
        ],
        onError: (error) => {
          console.error(error);
        }
      } as SocialAuthServiceConfig,
    },
        // Store configuration
        importProvidersFrom(
            StoreModule.forRoot({
              auth: authFeature.reducer,
              pages: pagesReducer
            }),
            EffectsModule.forRoot([AuthEffects])
        ),
        provideStoreDevtools({
          maxAge: 25,
          logOnly: environment.production,
          autoPause: true,
          features: {
            pause: false,
            lock: true,
            persist: true,
          },
        }),
        // Other providers
        importProvidersFrom(
            BrowserAnimationsModule,
            NgxIntlTelInputModule
        ),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
              anchorScrolling: "enabled",
              scrollPositionRestoration: "enabled",
            }),
            withEnabledBlockingInitialNavigation(),
            withViewTransitions()
        ),
        importProvidersFrom(
            JwtModule.forRoot({
              config: {
                tokenGetter,
                allowedDomains: ["api.uniprep.ai"],
                disallowedRoutes: [
                  '/api/auth/login',
                  '/api/auth/register',
                  '/api/auth/forgot-password',
                  '/api/auth/verification'
                ],
                headerName: "Authorization",
                authScheme: "Bearer ",
                throwNoTokenError: false,
                skipWhenExpired: true
              },
            })
        ),
        provideHttpClient(
            withInterceptorsFromDi(),
            withInterceptors([HttpErrorInterceptor])
        ),
        MessageService,
        provideAnimationsAsync(),
        providePrimeNG({
          theme: {
            preset: MyPreset,
            options: {
              darkModeSelector: ".app-dark",
            },
          },
        }),
    LandingModule,
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
        // {
        //   provide: "SocialAuthServiceConfig",
        //   useValue: {
        //     autoLogin: false,
        //     providers: [
        //       {
        //         id: GoogleLoginProvider.PROVIDER_ID,
        //         provider: new GoogleLoginProvider(
        //           "32944187384-4jubeedmfdusvhk6n7ben61ce7u9ber8.apps.googleusercontent.com",
        //           {
        //             oneTapEnabled: false,
        //           }
        //         ),
        //       },
        //       {
        //         id: FacebookLoginProvider.PROVIDER_ID,
        //         provider: new FacebookLoginProvider("892925195633254"),
        //       },
        //     ],
        //   } as SocialAuthServiceConfig,
        // },
        provideAnimations(), // Required for ngx-bootstrap
        provideClientHydration(), provideClientHydration(withEventReplay()),
  ],
};
