import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core"
import {CommonModule} from "@angular/common"
import {PagesRoutingModule} from "./pages-routing.module"
import {PagesComponent} from "./pages.component"
import {StoreModule} from "@ngrx/store"
import {pagesFeatureKey} from "./store/pages.selectors"
import {pagesReducer} from "./store/pages.reducer"
import {TableModule} from "primeng/table"
import {HelpSupportComponent} from "./help-support/help-support.component"
import {UserManagementComponent} from "./user-management/user-management.component"
import {FooterStatusBoxComponent} from "./footer-status-box/footer-status-box.component"
import {HeaderSearchComponent} from "./header-search/header-search.component"
import {ButtonModule} from "primeng/button"
import {InputTextModule} from "primeng/inputtext"
import {RippleModule} from "primeng/ripple"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {CalendarModule} from "primeng/calendar"
import {TabViewModule} from "primeng/tabview"
import {InputSwitchModule} from "primeng/inputswitch"
import {MultiSelectModule} from "primeng/multiselect"
import {CarouselModule} from "primeng/carousel"
import {DialogModule} from "primeng/dialog"
import {BreadcrumbModule} from "primeng/breadcrumb"
import {QuestionCreditComponent} from "./question-credit/question-credit.component"
import {ProgressBarModule} from "primeng/progressbar"
import {ConfirmDialogModule} from "primeng/confirmdialog"
import {EffectsModule} from "@ngrx/effects"
import {ModuleStoreReducer} from "./module-store/module-store.reducer"
import {appFeatureKey} from "./module-store/module-store.selectors"
import {ModuleStoreEffects} from "./module-store/module-store.effects"
import {ChatComponent} from "./chat/chat.component"
import {CardModule} from "primeng/card"
import {EditorModule} from "primeng/editor"
import {ConfirmPopupModule} from "primeng/confirmpopup"
import {AccordionModule} from "primeng/accordion"
import {GuidelineComponent} from "./chat/guidelines/guidelines.component"
import {PopoverModule} from "primeng/popover"
import {InputTextarea} from "primeng/inputtextarea"
import {TooltipModule} from "primeng/tooltip"
import {PrivacypolicyComponent} from "./footersection/privacypolicy/privacypolicy.component"
import {PaginatorModule} from "primeng/paginator"
import {ScrollTrackerDirective} from "./header-search/scroll-tracker.directive"
import {RefundpolicyComponent} from "./footersection/refundpolicy/refundpolicy.component"
import {CancellationpolicyComponent} from "./footersection/cancellationpolicy/cancellationpolicy.component"
import {SupportComponent} from "./support/support.component"
import {InvestorListComponent} from "./investor-list/investor-list.component"
import {CompanyListComponent} from "./company-list/company-list.component"
import {ScholarshipListComponent} from "./scholarship-list/scholarship-list.component"
import {UserGuideComponent} from "./user-guide/user-guide.component"
import {DividerModule} from "primeng/divider"
import {CompanyListGuidlinesComponent} from "./company-list-guidlines/company-list-guidlines.component"
import {ScholarshipListGuidlinesComponent} from "./scholarship-list-guidlines/scholarship-list-guidlines.component"
import {InvestorListGuidlinesComponent} from "./investor-list-guidlines/investor-list-guidlines.component"
import {RecommendationsComponent} from "./recommendations/recommendations.component"
import {StepsModule} from "primeng/steps"
import {CheckboxModule} from "primeng/checkbox"
import {RadioButtonModule} from "primeng/radiobutton"
import {PitchDeskComponent} from "./pitch-desk/pitch-desk.component"
import {InputNumberModule} from 'primeng/inputnumber';
import {ExportCreditComponent} from "./export-credit/export-credit.component"
import {MycertificateComponent} from "./mycertificate/mycertificate.component"
import {CareerPlannerComponent} from "./career-planner/career-planner.component"
import {CertificatesComponent} from "./certificates/certificates.component"
import {CourseListComponent} from "./course-list/course-list.component"
import {SkeletonModule} from "primeng/skeleton"
import {CareerGrowthCheckerComponent} from "./career-growth-checker/career-growth-checker.component"
import {AdvisorComponent} from "./advisor/advisor.component"
import {NationalExamCategoriesComponent} from "./national-exam-categories/national-exam-categories.component"
import {NationalExamTestsComponent} from "./national-exam-tests/national-exam-tests.component"
import {NationalExamStartComponent} from "./national-exam-start/national-exam-start.component"
import {NationalExamQuestionsComponent} from "./national-exam-questions/national-exam-questions.component"
import {NationalExamResultComponent} from "./national-exam-result/national-exam-result.component"
import {NationalExamReviewComponent} from "./national-exam-review/national-exam-review.component"
import {JobPreparationComponent} from "./jobinterviewpreparation/interviewpreparation.component"
import {JobPreparedListComponent} from "./jobinterviewpreparation/preparedlist/preparedlist.component"
import {AverageSalaryComponent} from "./averagesalaryestimator/averagesalaryestimator.component"
import {AverageSalaryPreparedListComponent} from "./averagesalaryestimator/preparedlist/preparedlist.component"
import {JoboffercomparisontoolComponent} from "./job-tool/joboffercomparisontool/joboffercomparisontool.component"
import {JobOfferPreparedListComponent} from "./job-tool/joboffercomparisontool/preparedlist/preparedlist.component"
import {PdfViewerModule} from "ng2-pdf-viewer";
import {UniLearnModule} from "./unilearn/unilearn.module"

@NgModule({
    declarations: [
        QuestionCreditComponent,
        PrivacypolicyComponent,
        RefundpolicyComponent,
        CancellationpolicyComponent,
        CompanyListGuidlinesComponent,
        ScholarshipListGuidlinesComponent,
        InvestorListGuidlinesComponent,
        ExportCreditComponent,
        NationalExamCategoriesComponent,
        NationalExamStartComponent,
        NationalExamResultComponent,
    ],
    exports: [FooterStatusBoxComponent, HeaderSearchComponent],
    imports: [
        CommonModule,
        PopoverModule,
        PagesComponent,
        HeaderSearchComponent,
        FooterStatusBoxComponent,
        HelpSupportComponent,
        UserManagementComponent,
        ChatComponent,
        GuidelineComponent,
        ScrollTrackerDirective,
        SupportComponent,
        InvestorListComponent,
        CompanyListComponent,
        ScholarshipListComponent,
        UserGuideComponent,
        RecommendationsComponent,
        PitchDeskComponent,
        MycertificateComponent,
        CareerPlannerComponent,
        NationalExamQuestionsComponent,
        CertificatesComponent,
        CourseListComponent,
        CareerGrowthCheckerComponent,
        AdvisorComponent,
        PagesRoutingModule,
        NationalExamTestsComponent,
        NationalExamReviewComponent,
        JobOfferPreparedListComponent,
        JoboffercomparisontoolComponent,
        AverageSalaryComponent,
        JobPreparationComponent,
        JobPreparedListComponent,
        AverageSalaryPreparedListComponent,
        StoreModule.forFeature(pagesFeatureKey, pagesReducer),
        StoreModule.forFeature(appFeatureKey, ModuleStoreReducer),
        EffectsModule.forFeature([ModuleStoreEffects]),
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        ReactiveFormsModule,
        CalendarModule,
        TabViewModule,
        MultiSelectModule,
        CarouselModule,
        DialogModule,
        PaginatorModule,
        BreadcrumbModule,
        FormsModule,
        InputSwitchModule,
        ProgressBarModule,
        ConfirmDialogModule,
        CardModule,
        EditorModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        AccordionModule,
        PopoverModule,
        InputTextarea,
        TooltipModule,
        DividerModule,
        CheckboxModule,
        StepsModule,
        RadioButtonModule,
        PdfViewerModule,
        SkeletonModule,
        InputNumberModule,
        UniLearnModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {
}
