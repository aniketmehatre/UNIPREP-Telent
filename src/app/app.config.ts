import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule, Routes, provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { appRoutes } from './app.routes';
import { LandingComponent } from './pages/landing/landing.component';
import { provideStore } from '@ngrx/store';

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
        LandingComponent
    ]
};
