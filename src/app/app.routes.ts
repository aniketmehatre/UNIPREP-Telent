import { Routes } from "@angular/router"
import { LandingComponent } from "./pages/landing/landing.component"
import { LoginComponent } from "./Auth/login/login.component"
import { CertificatesComponent } from "./pages/certificates/certificates.component"
import { UserResolver } from "./resolvers/user.resolver"
import { AuthGuard } from "./Auth/auth.guard"

export const appRoutes: Routes = [
	// Public routes
	{ path: "", redirectTo: "/landing", pathMatch: "full" }, // Default route
	{ path: "landing", component: LandingComponent }, // Landing outside of auth
	{ path: "certificates", component: CertificatesComponent },
	{ path: "login", component: LoginComponent },
	// Lazy load Auth Module
	{ path: "auth", loadChildren: () => import("./Auth/auth.module").then((m) => m.AuthModule) },
	{
		path: "pages",
		loadChildren: () => import("./pages/pages.module").then((m) => m.PagesModule),
		canActivate: [AuthGuard],
		resolve: {
			user: UserResolver,
		},
	},
	{
		path: "",
		loadChildren: () => import("./Auth/auth.module").then((m) => m.AuthModule),
	},
	// Fallback route (if none match)
	{ path: "**", redirectTo: "/landing", pathMatch: "full" },
]
