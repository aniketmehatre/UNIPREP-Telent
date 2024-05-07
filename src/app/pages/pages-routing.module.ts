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
import {CompanyListComponent} from "./company-list/company-list.component";
import { ScholarshipListComponent } from './scholarship-list/scholarship-list.component';
import { CompanyListGuidlinesComponent } from './company-list-guidlines/company-list-guidlines.component';
import { InvestorListGuidlinesComponent } from './investor-list-guidlines/investor-list-guidlines.component';
import { ScholarshipListGuidlinesComponent } from './scholarship-list-guidlines/scholarship-list-guidlines.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { PitchDeskComponent } from './pitch-desk/pitch-desk.component';
import { ExportCreditComponent } from './export-credit/export-credit.component';
import { MycertificateComponent } from './mycertificate/mycertificate.component';
import { CareerPlannerComponent } from './career-planner/career-planner.component';
import {LanguageHubModule} from "./language-hub/language-hub.module";


const routes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            {
                path: 'dashboard',

                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'userguide',

                loadChildren: () => import('./user-guide/user-guide.module').then(m => m.UserGuideModule)
            },
            {
                path: 'modules',
                // canActivate: [PagesGuard],
                loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule)
            },
            {
                path: 'language-hub',
                loadChildren: () => import('./language-hub/language-hub.module').then(m => m.LanguageHubModule)
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
                path: 'scholarship-list',
                component: ScholarshipListComponent
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
                path: 'company-list',
                component: CompanyListComponent
            },
            {
                path: 'events',
                loadChildren: () => import('./events/event.module').then(m => m.EventsModule)
            },
            {
                path: 'tutorials',
                loadChildren: () => import('./tutorials/tutorials.module').then(m => m.TutorialsModule)
            },
            {
                path: 'pitch-deck',
                component: PitchDeskComponent  
            },
            {path: 'usermanagement', canActivate: [AuthGuard], component: UserManagementComponent},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {
                path: 'guideline',
                component: GuidelineComponent
            },
            {
                path: 'startup',
                component: InfoKitComponent
            },
            {
                path: 'company-guidlines',
                component: CompanyListGuidlinesComponent
            },
            {
                path: 'scholarship-guidlines',
                component: ScholarshipListGuidlinesComponent
            },
            {
                path: 'investor-guidlines',
                component: InvestorListGuidlinesComponent
            },
            {
                path: 'recommendations',
                component: RecommendationsComponent
            },
            {
                path: 'export-credit',
                component: ExportCreditComponent
            },
            {
                path: 'mycertificate',
                component: MycertificateComponent
            },{
                path: 'career-planner',
                component: CareerPlannerComponent
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
