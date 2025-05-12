import { Routes } from "@angular/router"
import { LandingComponent } from "./pages/landing/landing.component"
import { LoginComponent } from "./Auth/login/login.component"
import { RegistrationComponent } from "./Auth/registration/registration.component"
import { CertificatesComponent } from "./pages/certificates/certificates.component"
import { UserResolver } from "./resolvers/user.resolver"
import { AuthGuard } from "./Auth/auth.guard"
import { DomainwhitlabelGuard } from "./domainwhitlabel.guard"
import { EnterpriseSubscriptionComponent } from "./components/enterprise-subscription/enterprise-subscription.component"
import { BlogdetailComponent } from "./pages/blogdetail/blogdetail.component"
import { BloglistComponent } from "./pages/bloglist/bloglist.component"
import { PrivacyComponent } from "./pages/privacy/privacy.component"
import { DashboardComponent } from "./pages/dashboard/dashboard.component"
import { ForgotPasswordComponent } from "./Auth/forgot-password/forgot-password.component"
import { VerificationComponent } from "./Auth/verification/verification.component"
import { SetpasswordComponent } from "./Auth/setpassword/setpassword.component"
import { CoBrandedComponent } from "./Auth/co-branded/co-branded.component"
import { PricingComponent } from "./pages/landing/pricing/pricing.component"
export const appRoutes: Routes = [
	// Public routes that don't require authentication
	{
		path: '',
		loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule),
	}, // Default route is now landing page
	{
		path: "landing",
		loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
	},
	{
		path: 'contact-us',
		loadComponent: () => import('./pages/landing/contact-us/contact-us.component').then(c => c.ContactUsComponent)
	},
	{ path: "pricing", component: PricingComponent },
	{ path: "students", component: CoBrandedComponent },
	{ path: "login", component: LoginComponent },
	{ path: "students/login", component: LoginComponent },
	{ path: "register", component: RegistrationComponent },
	{ path: "privacy", component: PrivacyComponent },
	{ path: "blogs", component: BloglistComponent },
	{ path: "blogs/:slug", component: BlogdetailComponent },
	{ path: "certificates", component: CertificatesComponent },
	{ path: "enterprisepayment/:id", component: EnterpriseSubscriptionComponent },
	{ path: "forgot-password", component: ForgotPasswordComponent },
	{ path: "verification/:email", component: VerificationComponent },
	{ path: "setpassword/:otp/:email", component: SetpasswordComponent },
	{
		path: 'talent-connect',
		loadChildren: () => import('./pages/landing-talent-connect/landing-new.module').then(c => c.LandingModule)
	},



	// Protected routes that require authentication
	{
		path: "pages",
		loadChildren: () => import("./pages/pages.module").then((m) => m.PagesModule),
		canActivate: [AuthGuard],
		resolve: {
			user: UserResolver,
		},
	},

	// Auth module routes
	{
		path: "auth",
		loadChildren: () => import("./Auth/auth.module").then((m) => m.AuthModule),
	},

	// Fallback route
	{ path: "**", redirectTo: "", pathMatch: "full" },
]
