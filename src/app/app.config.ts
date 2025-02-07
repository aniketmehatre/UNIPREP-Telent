import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule, Routes, provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { appRoutes } from './app.routes';
import { LandingComponent } from './pages/landing/landing.component';
import { provideStore } from '@ngrx/store';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { EnterpriseSubscriptionService } from './components/enterprise-subscription/enterprise-subscription.service';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { NGX_LOCAL_STORAGE_CONFIG } from 'ngx-localstorage';
import { ModalService } from './components/modal/modal.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
            withEnabledBlockingInitialNavigation()
        ),
        provideStore(),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        }),
        // Declare LandingComponent to be loaded as the root component
        LandingComponent,
            DeviceDetectorService,
            DatePipe,
            AuthService,
            EnterpriseSubscriptionService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: HttpErrorInterceptor,
              multi: true
            },
            {
              provide: NGX_LOCAL_STORAGE_CONFIG,
              useValue: NGX_LOCAL_STORAGE_CONFIG
            },
            ModalService,
            {
              provide: 'SocialAuthServiceConfig',
              useValue: {
                autoLogin: false,
                providers: [
                  {
                    id: GoogleLoginProvider.PROVIDER_ID,
                    provider: new GoogleLoginProvider('32944187384-4jubeedmfdusvhk6n7ben61ce7u9ber8.apps.googleusercontent.com', {
                      oneTapEnabled: false,
                    }),
                  },
                  {
                    id: FacebookLoginProvider.PROVIDER_ID,
                    provider: new FacebookLoginProvider('892925195633254'),
                  },
                ],
              } as SocialAuthServiceConfig,
            },
    ]
};
