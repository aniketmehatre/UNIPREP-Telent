import { Routes } from "@angular/router";
export const appRoutes: Routes = [
  // Public routes that don't require authentication
  // ## Student Landing Page
  {
    path: "",
    loadChildren: () =>
      import("./pages/landing/landing.module").then((m) => m.LandingModule),
  },
  // ## Partner Landing Page
  // {
  // 	path: 'p',
  // 	loadChildren: () => import('./pages/landing-partner/landing-partner.module').then(m => m.LandingPartnerModule),
  // },
  // ## Institute Landing Page
  // {
  // 	path: 'i',
  // 	loadChildren: () => import('./pages/landing-institute/landing-institute.module').then(m => m.LandingInstituteModule),
  // },
  // ## Talent Landing Page
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./pages/landing-talent-connect/landing-new.module").then(
  //       (c) => c.LandingNewModule
  //     ),
  // },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
