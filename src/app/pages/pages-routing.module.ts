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
import { CareerGrowthCheckerComponent } from './career-growth-checker/career-growth-checker.component';
import { CourseListComponent } from './course-list/course-list.component';
import { JobToolComponent } from './job-tool/job-tool.component';
import {SalaryConverterComponent} from "./job-tool/salary-converter/salary-converter.component";
import { FounderstoolComponent } from './founderstool/founderstool.component';
import {AdvisorComponent} from "./advisor/advisor.component";
import { NationalExamCategoriesComponent } from './national-exam-categories/national-exam-categories.component';
import { NationalExamTestsComponent } from './national-exam-tests/national-exam-tests.component';
import { NationalExamStartComponent } from './national-exam-start/national-exam-start.component';
import { NationalExamQuestionsComponent } from './national-exam-questions/national-exam-questions.component';
import { NationalExamResultComponent } from './national-exam-result/national-exam-result.component';
import { NationalExamReviewComponent } from './national-exam-review/national-exam-review.component';
import { JobPreparationComponent } from './jobinterviewpreparation/interviewpreparation.component';
import { JobPreparedListComponent } from './jobinterviewpreparation/preparedlist/preparedlist.component';

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
                path: 'success-stories',
                loadChildren: () => import('./success-stories/success-stories.module').then(m => m.SuccessStoriesModule)
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
            {
                path: 'interviewprep',
                component: JobPreparationComponent,
            },
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
            },
            {
                path: 'career-planner',
                component: CareerPlannerComponent
            },
            {
                path: 'course-list',
                component: CourseListComponent
            },
            
            {
                path: 'job-portal',
                loadChildren: () => import('./job-search/job-search.module').then(m => m.JobSearchModule)
            },
            {
                path: 'job-tool',
                loadChildren: () => import('./job-tool/job-tool.module').then(m => m.JobToolModule)
            },
            {
                path: 'founderstool',
                loadChildren: () => import('./founderstool/founderstool/founderstool.module').then(m => m.FounderstoolModule)
            },
            {
                path: 'career-growth-checker',
                component: CareerGrowthCheckerComponent
            },
            {
                path: 'unilearn',
                loadChildren: () => import('./unilearn/unilearn.module').then(m => m.UniLearnModule)
            },
            {
                path: 'advisor',
                component: AdvisorComponent,
            },
            {
                path: 'advisor/:question',
                component: AdvisorComponent,
            },
            {
                path: 'national-exams',
                component: NationalExamCategoriesComponent,
            },
            {
                path: 'national-exams/:slug',
                component: NationalExamTestsComponent,
            },
            {
                path: 'national-exams/:slug/start',
                component: NationalExamStartComponent,
            },
            {
                path: 'national-exams/:categoryid/questions/:testid',
                component: NationalExamQuestionsComponent,
            },
            {
                path: 'national-exams/:categoryid/result/:resultid',
                component: NationalExamResultComponent,
            },
            {
                path: 'national-exams/:categoryid/review/:resultid',
                component: NationalExamReviewComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
