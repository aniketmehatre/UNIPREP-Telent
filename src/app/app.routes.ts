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

export const appRoutes: Routes = [
	// Public routes
	{ path: "", redirectTo: "/landing", pathMatch: "full" }, // Default route
	{ path: "landing", component: LandingComponent }, // Landing outside of auth
	{ path: "certificates", component: CertificatesComponent },
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegistrationComponent  },
	{ path: "dashboard", component: DashboardComponent  },
	{
		path: "home",
		component: LandingComponent,
		canActivate: [DomainwhitlabelGuard],
	},
	{
		path: "enterprisepayment/:id",
		component: EnterpriseSubscriptionComponent,
	},
	{
		path: "blogs/:slug",
		component: BlogdetailComponent,
	},
	{
		path: "blogs",
		component: BloglistComponent,
	},
	{
		path: "privacy",
		component: PrivacyComponent,
	},
	{
		path: "certificates",
		component: CertificatesComponent,
	},

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
