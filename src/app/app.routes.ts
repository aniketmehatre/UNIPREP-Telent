import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { BlogdetailComponent } from './pages/blogdetail/blogdetail.component';
import { BloglistComponent } from './pages/bloglist/bloglist.component';

export const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'blog/:id', component: BlogdetailComponent },
  { path: 'blogs', component: BloglistComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Fallback route
];
