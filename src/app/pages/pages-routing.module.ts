import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonComponent } from './button/button.component';
import { CardsComponent } from './cards/cards.component';
import { PagesComponent } from './pages.component';
import { SubcriptionManagerComponent } from './subcription-manager/subcription-manager.component';
import { EditprofileComponent } from './user-management/editprofile/editprofile.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  { 
    path: '', component: PagesComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)  },
      { path: 'sop', loadChildren: () => import('./sop/sop.module').then(m => m.SopModule)  },
      { path: 'pre-application', loadChildren: () => import('./pre-application/pre-application.module').then(m => m.PreApplicationModule)  },
      { path: 'post-application', loadChildren: () => import('./post-application/post-application.module').then(m => m.PostApplicationModule)  },
      { path: 'post-admission', loadChildren: () => import('./post-admission/post-admission.module').then(m => m.PostAdmissionModule)  },
      { path: 'subscriptions', loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule)  },
      { path: 'sample-sop', loadChildren: () => import('./sop-sample/sop-sample.module').then(m => m.SopSampleModule)  },
      { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)  },
      { path: 'button', component: ButtonComponent  },
      { path: 'cards', component: CardsComponent  },
      { path: 'help', loadChildren: () => import('./help-support/help-support.module').then(m => m.HelpSupportModule)  },
      { path: 'usermanagement', component: UserManagementComponent  },
      { path: 'subscriptionmanagement', component: SubcriptionManagerComponent  },
      { path: 'profile', component: EditprofileComponent  },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
