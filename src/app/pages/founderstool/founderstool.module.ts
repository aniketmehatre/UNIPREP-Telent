import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FounderstoolComponent } from './founderstool.component';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { foundersToolRountingModule } from './founders-tool-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { FoundersacademyComponent } from './foundersacademy/foundersacademy.component';
import {ConfirmationService} from 'primeng/api';
import { FounderstoollistComponent } from './founderstoollist/founderstoollist.component';
import { InvestorpitchtrainingComponent } from './investorpitchtraining/investorpitchtraining.component';
import { StartupglossaryComponent } from './startupglossary/startupglossary.component';
import { EntreprenuerskillmoduleComponent } from './entreprenuerskillmodule/entreprenuerskillmodule.component';
import { EntreprenuersectorproficiencyComponent } from './entreprenuersectorproficiency/entreprenuersectorproficiency.component';
import { EntreprenuerquizComponent } from './entreprenuerquiz/entreprenuerquiz.component';
import { WealthleaderslistComponent } from './wealthleaderslist/wealthleaderslist.component';
import { WealthleaderreadansComponent } from './wealthleaderreadans/wealthleaderreadans.component';
import { BusinessPlanGeneratorComponent } from './business-plan-generator/business-plan-generator.component';
import { ComponentStoriesComponent } from './component-stories/component-stories.component';
import { GovermentFundingOppurtunityComponent } from './goverment-funding-opportunity/goverment-funding-opportunity.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MarketingAnalysisComponent } from './marketing-analysis/marketing-analysis.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AiBusinessAdvisorComponent } from './ai-business-advisor/ai-business-advisor.component';
import { StartupRiskAssessmentComponent } from './startup-risk-assessment/startup-risk-assessment.component';
import { StartUpExpenseEstimateComponent } from './start-up-expense-estimate/start-up-expense-estimate.component';
import { BusinessForecastingToolComponent } from './business-forecasting-tool/business-forecasting-tool.component';


@NgModule({
  declarations: [
    FounderstoolComponent,
    FoundersacademyComponent,
    FounderstoollistComponent,
    InvestorpitchtrainingComponent,
    StartupglossaryComponent,
    EntreprenuerskillmoduleComponent,
    EntreprenuersectorproficiencyComponent,
    EntreprenuerquizComponent,
    WealthleaderslistComponent,
    WealthleaderreadansComponent,
    BusinessPlanGeneratorComponent,
    ComponentStoriesComponent,
    GovermentFundingOppurtunityComponent,
    MarketingAnalysisComponent,
    AiBusinessAdvisorComponent,
    StartupRiskAssessmentComponent,
    StartUpExpenseEstimateComponent,
    BusinessForecastingToolComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    DropdownModule,
    PaginatorModule,
    CardModule,
    DialogModule,
    foundersToolRountingModule,
    TooltipModule,
    MultiSelectModule,
    PdfViewerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService, 
    TooltipModule,
    MultiSelectModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule
  ],
})
export class FounderstoolModule { }
