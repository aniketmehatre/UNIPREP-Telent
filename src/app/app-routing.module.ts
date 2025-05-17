import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./Auth/auth.guard";
import { UserResolver } from "./resolvers/user.resolver";
import { PrivacyComponent } from "./pages/privacy/privacy.component";
import { CertificatesComponent } from "./pages/certificates/certificates.component";
import { EnterpriseSubscriptionComponent } from "./components/enterprise-subscription/enterprise-subscription.component";
import { BlogdetailComponent } from "./pages/landing/blogdetail/blogdetail.component";
import { BloglistComponent } from "./pages/landing/bloglist/bloglist.component";
import { DomainwhitlabelGuard } from "./domainwhitlabel.guard";
import { environment } from '@env/environment';
import { MaintenanceComponent } from "./Auth/maintenance/maintenance.component";


const routes: Routes = []

if (environment.maintenanceMode) {
  routes.push({ path: '**', component: MaintenanceComponent });
} else {
  routes.push({
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
    {
      path: 'home',
      loadChildren: () => import('./pages/landing/landing.module').then((m) => m.LandingModule),
      canActivate: [DomainwhitlabelGuard]
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
      path: 'blogs',
      component: BloglistComponent
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
    }
  );
}


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
