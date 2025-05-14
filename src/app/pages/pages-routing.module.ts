import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonComponent } from './button/button.component';
import { CardsComponent } from './cards/cards.component';
import { PagesComponent } from './pages.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AuthGuard } from "../Auth/auth.guard";
import { ChatComponent } from './chat/chat.component';
import { GuidelineComponent } from './chat/guidelines/guidelines.component';
import { PrivacypolicyComponent } from './footersection/privacypolicy/privacypolicy.component';
import { RefundpolicyComponent } from './footersection/refundpolicy/refundpolicy.component';
import { CancellationpolicyComponent } from './footersection/cancellationpolicy/cancellationpolicy.component';
import { SupportComponent } from './support/support.component';
import { InvestorListComponent } from "./investor-list/investor-list.component";
import { InfoKitComponent } from './infokit/infokit.component';
import { CompanyListComponent } from "./company-list/company-list.component";
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
import { AdvisorComponent } from "./advisor/advisor.component";
import { NationalExamCategoriesComponent } from './national-exam-categories/national-exam-categories.component';
import { NationalExamTestsComponent } from './national-exam-tests/national-exam-tests.component';
import { NationalExamStartComponent } from './national-exam-start/national-exam-start.component';
import { NationalExamQuestionsComponent } from './national-exam-questions/national-exam-questions.component';
import { NationalExamResultComponent } from './national-exam-result/national-exam-result.component';
import { NationalExamReviewComponent } from './national-exam-review/national-exam-review.component';
import { JobPreparationComponent } from './jobinterviewpreparation/interviewpreparation.component';
import { AverageSalaryComponent } from './averagesalaryestimator/averagesalaryestimator.component';
import { FundListGuidlinesComponent } from './fund-list-guidelines/fund-list-guidlines.component';
import { JoboffercomparisontoolComponent } from './job-tool/joboffercomparisontool/joboffercomparisontool.component';
import { GlobalRepositoryComponent } from './global-repository/global-repository.component';
import { GlobalWorkVisaComponent } from './global-work-visa/global-work-visa.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                canActivate: [AuthGuard],
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
            { path: 'usermanagement', canActivate: [AuthGuard], component: UserManagementComponent },
            {
                path: 'interviewprep',
                component: JobPreparationComponent,
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
                path: 'funding-guidlines',
                component: FundListGuidlinesComponent
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
                loadChildren: () => import('./founderstool/founderstool.module').then(m => m.FounderstoolModule)
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
            {
                path: 'assessment',
                loadChildren: () => import('./assessment/assessment.module').then(m => m.AssessmentModule)
            },
            {
                path: 'travel-tools',
                loadChildren: () => import('./travel-tools/travel-tools.module').then(m => m.TravelToolsModule)
            },
            {
                path: 'education-tools',
                loadChildren: () => import('./education-tools/education-tools.module').then(m => m.EducationToolsModule)
            },
            {
                path: 'average-salary-estimator',
                component: AverageSalaryComponent
            },
            {
                path: 'job-offer-comparison',
                component: JoboffercomparisontoolComponent
            },
            {
                path: 'career-hacks',
                loadChildren: () => import('./career-hacks/careerhacks.module').then(m => m.CareerHacksModule)
            },
            {
                path: 'career-hacks/:countryId/:questionId',
                loadChildren: () => import('./career-hacks/careerhacks.module').then(m => m.CareerHacksModule)
            },
            {
                path: 'salary-hacks',
                loadChildren: () => import('./salary-hacks/salaryhacks.module').then(m => m.SalaryHacksModule)
            },
            {
                path: 'job-seeker-success-stories',
                loadChildren: () => import('./job-seeker-success-stories/job-seeker-success-stories.module').then(m => m.JobSeekerSuccessStoriesModule)
            },
            {
                path: 'fortune-companies',
                loadChildren: () => import('./fortune-companies/fortune-companies.module').then(m => m.FortuneCompaniesModule)
            },
            {
                path: 'fortune-companies/:companyId/:questionId',
                loadChildren: () => import('./fortune-companies/fortune-companies.module').then(m => m.FortuneCompaniesModule)
            },
            {
                path: 'contributors',
                loadChildren: () => import('./contributors/contributors.module').then(m => m.ContributorsModule)
            },
            {
                path: 'talent-connect',
                loadChildren: () => import('./talent-connect/talent-connect.module').then(m => m.TalentConnectModule)
            },
            {
                path: 'company-connect',
                loadChildren: () => import('./talent-connect/company-connect/company-connect.module').then(m => m.CompanyConnectModule)
            },
            {
                path: 'global-repo',
                component: GlobalRepositoryComponent
            },
            {
                path: 'global-employment-insights',
                loadChildren: () => import('./global-employment-insights/global-employment-insights.module').then(m => m.GlobalEmploymentModule)
            },
            {
                path: 'global-employment-insights/:countryId/:questionId',
                loadChildren: () => import('./global-employment-insights/global-employment-insights.module').then(m => m.GlobalEmploymentModule)
            },
            {
                path: 'global-work-visa',
                component: GlobalWorkVisaComponent
            },
            {
                path: 'global-work-visa/:nationalityId/:countryId/:visaTypeId/:categoryId/:questionId',
                component: GlobalWorkVisaComponent
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
