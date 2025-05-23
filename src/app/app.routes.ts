import { Routes } from "@angular/router"
export const appRoutes: Routes = [
	// Public routes that don't require authentication
	{
		path: '',
		loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule),
	}
]
