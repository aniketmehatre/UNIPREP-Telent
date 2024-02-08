import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {AuthGuard} from "./Auth/auth.guard";
import {UserResolver} from "./resolvers/user.resolver";
import { LandingComponent } from "./pages/landing/landing.component";
import { AppComponent } from "./app.component";
import { PrivacyComponent } from "./pages/privacy/privacy.component";
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
    path: 'privacy',
    component: PrivacyComponent
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
