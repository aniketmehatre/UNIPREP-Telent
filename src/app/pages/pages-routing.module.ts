import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ButtonComponent} from './button/button.component';
import {CardsComponent} from './cards/cards.component';
import {PagesComponent} from './pages.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {AuthGuard} from "../Auth/auth.guard";
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            {
                path: 'dashboard',

                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            // { path: 'sop', loadChildren: () => import('./sop/sop.module').then(m => m.SopModule)  },
            {
                path: 'modules',
                // canActivate: [PagesGuard],
                loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule)
            },
            {
                path: 'pre-application',

                // canActivate: [PagesGuard],
                loadChildren: () => import('./pre-application/pre-application.module').then(m => m.PreApplicationModule)
            },
            {
                path: 'post-application',

                // canActivate: [PagesGuard],
                loadChildren: () => import('./post-application/post-application.module').then(m => m.PostApplicationModule)
            },
            {
                path: 'post-admission',

                // canActivate: [PagesGuard],
                loadChildren: () => import('./post-admission/post-admission.module').then(m => m.PostAdmissionModule)
            },
            {
                path: 'career-hub',

                //canActivate: [PagesGuard],
                loadChildren: () => import('./career-hub/career-hub.module').then(m => m.CareerHubModule)
            },
            {
                path: 'life-at',
                //canActivate: [PagesGuard],
                loadChildren: () => import('./life-at/life-at-routing.module').then(m => m.LifeAtRoutingModule)
            }, {
                path: 'university',
                //canActivate: [PagesGuard],
                loadChildren: () => import('./university/university.module').then(m => m.UniversityModule)
            },
            {
                path: 'subscriptions',

                loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule)
            },
            {
                path: 'faq',

                loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
            },
            {
                path: 'button',

                component: ButtonComponent
            },
            {
                path: 'chat',
                component: ChatComponent
            },
            {
                path: 'cards',

                component: CardsComponent
            },
            {
                path: 'help',
                loadChildren: () => import('./help-support/help-support.module').then(m => m.HelpSupportModule)
            },
            {
                path: 'resource',

                loadChildren: () => import('./resource/resource.module').then(m => m.ResourceModule)
            },
            {path: 'usermanagement', canActivate: [AuthGuard], component: UserManagementComponent},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
