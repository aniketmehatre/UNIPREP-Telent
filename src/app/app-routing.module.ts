import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {AuthGuard} from "./Auth/auth.guard";
import {UserResolver} from "./resolvers/user.resolver";
import { LandingComponent } from "./pages/landing/landing.component";
import { AppComponent } from "./app.component";
import { PrivacyComponent } from "./pages/privacy/privacy.component";
import { CertificatesComponent } from "./pages/certificates/certificates.component";
import { EnterpriseSubscriptionComponent } from "./components/enterprise-subscription/enterprise-subscription.component";
import { BlogdetailComponent } from "./pages/blogdetail/blogdetail.component";
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LandingComponent
  },
  {
    path: 'enterprisepayment/:id',
    component: EnterpriseSubscriptionComponent
  },
  {
    path: 'blogs/:slug',
    component: BlogdetailComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'certificates',
    component: CertificatesComponent
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver
    }
  },
  {
    path: "",
    loadChildren: () =>
    import("./Auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: '/home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
