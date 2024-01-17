import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ButtonComponent} from './button/button.component';
import {CardsComponent} from './cards/cards.component';
import {PagesComponent} from './pages.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {AuthGuard} from "../Auth/auth.guard";
import { ChatComponent } from './chat/chat.component';
import { GuidelineComponent } from './chat/guidelines/guidelines.component';
import { RecentlyaddedquestionsComponent } from './recentlyaddedquestions/recentlyaddedquestions.component';
import { PrivacypolicyComponent } from './footersection/privacypolicy/privacypolicy.component';
import { RefundpolicyComponent } from './footersection/refundpolicy/refundpolicy.component';
import { CancellationpolicyComponent } from './footersection/cancellationpolicy/cancellationpolicy.component';
import { SupportComponent } from './support/support.component';
import {InvestorListComponent} from "./investor-list/investor-list.component";
import { InfoKitComponent } from './infokit/infokit.component';

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
                path: 'termsandcondition',
                loadChildren: () => import('./footersection/termsandcondition/termsandcondition.module').then(m => m.TermsAnsConditionModule)
            },
            {
                path: 'privacypolicy',

                component: PrivacypolicyComponent
            },
            {
                path: 'refundpolicy',

                component: RefundpolicyComponent
            },
            {
                path: 'cancellationpolicy',

                component: CancellationpolicyComponent
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
                path: 'question-list/:type',
                loadChildren: () => import('./recentlyaddedquestions/recentlyaddedques.module').then(m => m.RecentlyAddedQuestionsModule)
            },
            {
                path: 'cards',

                component: CardsComponent
            },
            {
                path: 'support',
                component: SupportComponent
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
                path: 'investor-list',
                component: InvestorListComponent
            },
            {
                path: 'events',
                loadChildren: () => import('./events/event.module').then(m => m.EventsModule)
            },
            {
                path: 'tutorials',
                loadChildren: () => import('./tutorials/tutorials.module').then(m => m.TutorialsModule)
            },
            {path: 'usermanagement', canActivate: [AuthGuard], component: UserManagementComponent},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {
                path: 'guideline',
                component: GuidelineComponent
            },
            {
                path: 'infokit',
                component: InfoKitComponent
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
