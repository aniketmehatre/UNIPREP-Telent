import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { BlogdetailComponent } from './pages/blogdetail/blogdetail.component';
import { BloglistComponent } from './pages/bloglist/bloglist.component';

export const appRoutes: Routes = [
  // Public routes
  { path: '', redirectTo: '/landing', pathMatch: 'full' }, // Default route
  { path: 'landing', component: LandingComponent }, // Landing outside of auth

  // Fallback route (if none match)
  { path: '**', redirectTo: '/landing', pathMatch: 'full' }
];
