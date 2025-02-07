import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const appRoutes: Routes = [
  // Public routes
  { path: '', redirectTo: '/landing', pathMatch: 'full' }, // Default route
  { path: 'landing', component: LandingComponent }, // Landing outside of auth

  // Lazy load Auth Module
  { path: 'auth', loadChildren: () => import('./Auth/auth.module').then(m => m.AuthModule) },

  // Fallback route (if none match)
  { path: '**', redirectTo: '/landing', pathMatch: 'full' }
];
