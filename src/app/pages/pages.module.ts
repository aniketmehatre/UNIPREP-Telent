import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { ThemeModule } from "@theme/theme.module";
import { StoreModule } from "@ngrx/store";
import { pagesFeatureKey } from "./store/pages.selectors";
import { pagesReducer } from "./store/pages.reducer";
import { ButtonComponent } from "./button/button.component";
import { CardsComponent } from "./cards/cards.component";
import { TableModule } from "primeng/table";
import { HelpSupportComponent } from "./help-support/help-support.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { EditprofileComponent } from "./user-management/editprofile/editprofile.component";
import { FooterStatusBoxComponent } from "./footer-status-box/footer-status-box.component";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { RippleModule } from "primeng/ripple";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { TabViewModule } from "primeng/tabview";
import { InputSwitchModule } from "primeng/inputswitch";
import { MultiSelectModule } from "primeng/multiselect";
import { CarouselModule } from "primeng/carousel";
import { DialogModule } from "primeng/dialog";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { QuestionCreditComponent } from "./question-credit/question-credit.component";
import { ProgressBarModule } from "primeng/progressbar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { EffectsModule } from "@ngrx/effects";
import { ModuleStoreReducer } from "./module-store/module-store.reducer";
import { appFeatureKey } from "./module-store/module-store.selectors";
import { ModuleStoreEffects } from "./module-store/module-store.effects";
import { ChatComponent } from "./chat/chat.component";
import { CardModule } from "primeng/card";
import { EditorModule } from "primeng/editor";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { AccordionModule } from "primeng/accordion";
import { GuidelineComponent } from "./chat/guidelines/guidelines.component";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TooltipModule } from "primeng/tooltip";
import { PrivacypolicyComponent } from "./footersection/privacypolicy/privacypolicy.component";
import { PaginatorModule } from "primeng/paginator";
import { ScrollTrackerDirective } from "./header-search/scroll-tracker.directive";
import { RefundpolicyComponent } from "./footersection/refundpolicy/refundpolicy.component";
import { CancellationpolicyComponent } from "./footersection/cancellationpolicy/cancellationpolicy.component";
import { SupportComponent } from "./support/support.component";
import { InvestorListComponent } from "./investor-list/investor-list.component";
import { CompanyListComponent } from "./company-list/company-list.component";
import { ScholarshipListComponent } from "./scholarship-list/scholarship-list.component";
import { UserGuideComponent } from "./user-guide/user-guide.component";
import { DividerModule } from "primeng/divider";
import { CompanyListGuidlinesComponent } from "./company-list-guidlines/company-list-guidlines.component";
import { ScholarshipListGuidlinesComponent } from "./scholarship-list-guidlines/scholarship-list-guidlines.component";
import { InvestorListGuidlinesComponent } from "./investor-list-guidlines/investor-list-guidlines.component";
import { RecommendationsComponent } from "./recommendations/recommendations.component";
import { StepsModule } from "primeng/steps";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { PitchDeskComponent } from "./pitch-desk/pitch-desk.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { ExportCreditComponent } from "./export-credit/export-credit.component";
import { MycertificateComponent } from "./mycertificate/mycertificate.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { CareerPlannerComponent } from "./career-planner/career-planner.component";
import { CertificatesComponent } from "./certificates/certificates.component";
import { CourseListComponent } from "./course-list/course-list.component";
import {SkeletonModule} from 'primeng/skeleton';
import { NgxStripeModule } from "ngx-stripe";
import { FounderstoolComponent } from "./founderstool/founderstool.component";
import { FoundersacademyComponent } from "./founderstool/foundersacademy/foundersacademy.component";
import { FounderstoollistComponent } from "./founderstool/founderstoollist/founderstoollist.component";
import { InvestorpitchtrainingComponent } from "./founderstool/investorpitchtraining/investorpitchtraining.component";
import { StartupglossaryComponent } from "./founderstool/startupglossary/startupglossary.component";
import { AnimateModule } from "primeng/animate";
import { CareerGrowthCheckerComponent } from "./career-growth-checker/career-growth-checker.component";
import { AdvisorComponent } from './advisor/advisor.component';
import { NationalExamCategoriesComponent } from './national-exam-categories/national-exam-categories.component';
import { NationalExamTestsComponent } from './national-exam-tests/national-exam-tests.component';
import { NationalExamStartComponent } from './national-exam-start/national-exam-start.component';
import { NationalExamQuestionsComponent } from './national-exam-questions/national-exam-questions.component';
import { NationalExamResultComponent } from './national-exam-result/national-exam-result.component';
import { NationalExamReviewComponent } from './national-exam-review/national-exam-review.component';
import { JobPreparationComponent } from "./jobinterviewpreparation/interviewpreparation.component";
import { JobPreparedListComponent } from "./jobinterviewpreparation/preparedlist/preparedlist.component";
import { AverageSalaryComponent } from "./averagesalaryestimator/averagesalaryestimator.component";
import { AverageSalaryPreparedListComponent } from "./averagesalaryestimator/preparedlist/preparedlist.component";
import { JoboffercomparisontoolComponent } from "./job-tool/joboffercomparisontool/joboffercomparisontool.component";
import { JobOfferPreparedListComponent } from "./job-tool/joboffercomparisontool/preparedlist/preparedlist.component";
import { GlobalRepositoryComponent } from './global-repository/global-repository.component';
import { GlobalEmploymentComponent } from "./global-employment-insights/global-employment-insights.component";

// import { JobToolComponent } from './job-tool/job-tool.component';
@NgModule({
  declarations: [
    PagesComponent,
    ButtonComponent,
    CardsComponent,
    HelpSupportComponent,
    UserManagementComponent,
    EditprofileComponent,
    FooterStatusBoxComponent,
    QuestionCreditComponent,
    ChatComponent,
    GuidelineComponent,
    PrivacypolicyComponent,
    ScrollTrackerDirective,
    RefundpolicyComponent,
    SupportComponent,
    CancellationpolicyComponent,
    InvestorListComponent,
    CompanyListComponent,
    ScholarshipListComponent,
    UserGuideComponent,
    CompanyListGuidlinesComponent,
    ScholarshipListGuidlinesComponent,
    InvestorListGuidlinesComponent,
    RecommendationsComponent,
    PitchDeskComponent,
    ExportCreditComponent,
    MycertificateComponent,
    CareerPlannerComponent,
    CertificatesComponent,
    CourseListComponent,
    CareerGrowthCheckerComponent,
    AdvisorComponent,
    NationalExamCategoriesComponent,
    NationalExamTestsComponent,
    NationalExamStartComponent,
    NationalExamQuestionsComponent,
    NationalExamResultComponent,
    NationalExamReviewComponent,
    // JobToolComponent,
    JobPreparationComponent,
    JobPreparedListComponent,
    AverageSalaryComponent,
    AverageSalaryPreparedListComponent,
    JoboffercomparisontoolComponent,
    JobOfferPreparedListComponent,
    GlobalRepositoryComponent
  ],
  exports: [FooterStatusBoxComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ThemeModule,
    StoreModule.forFeature(pagesFeatureKey, pagesReducer),
    StoreModule.forFeature(appFeatureKey, ModuleStoreReducer),
    EffectsModule.forFeature([ModuleStoreEffects]),
    TableModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    ReactiveFormsModule,
    DropdownModule,
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
    OverlayPanelModule,
    InputTextareaModule,
    TooltipModule,
    DividerModule,
    CheckboxModule,
    StepsModule,
    RadioButtonModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    AnimateModule,
    SkeletonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
