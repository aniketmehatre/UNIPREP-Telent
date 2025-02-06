import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { BlogdetailComponent } from './pages/blogdetail/blogdetail.component';
import { BloglistComponent } from './pages/bloglist/bloglist.component';

export const appRoutes: Routes = [
  { path: 'pages/landing', component: LandingComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'blog/:id', component: BlogdetailComponent },
  { path: 'blogs', component: BloglistComponent },
  { path: '', redirectTo: '/pages/landing', pathMatch: 'full' },  // Default route to LandingComponent
  { path: '**', redirectTo: '/pages/landing', pathMatch: 'full' }  // Fallback route
];
