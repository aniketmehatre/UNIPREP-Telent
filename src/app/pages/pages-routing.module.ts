import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ButtonComponent} from './button/button.component';
import {CardsComponent} from './cards/cards.component';
import {PagesComponent} from './pages.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {AuthGuard} from "../Auth/auth.guard";
import { ChatComponent } from './chat/chat.component';
import { GuidelineComponent } from './chat/guidelines/guidelines.component';

const routes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            {
                path: 'dashboard',

                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'modules',
                // canActivate: [PagesGuard],
                loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule)
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
            {
                path: 'events',

                loadChildren: () => import('./events/event.module').then(m => m.EventsModule)
            },
            {path: 'usermanagement', canActivate: [AuthGuard], component: UserManagementComponent},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {
                path: 'guideline',
                component: GuidelineComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
