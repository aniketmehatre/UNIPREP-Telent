import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FounderstoolComponent } from './founderstool.component';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
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
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    
    
    InvestorpitchtrainingComponent,
   
    
    
    
    
    
    
    AiBusinessAdvisorComponent,
    StartupRiskAssessmentComponent,
    
    
  ],
    imports: [
        CommonModule,
        BusinessForecastingToolComponent,
        EntreprenuerquizComponent,
        BusinessPlanGeneratorComponent,
        FounderstoolComponent,
        FoundersacademyComponent,
        EntreprenuerskillmoduleComponent,
        EntreprenuersectorproficiencyComponent,
        FounderstoollistComponent,
        ComponentStoriesComponent,
        StartupglossaryComponent,
        StartUpExpenseEstimateComponent,
        GovermentFundingOppurtunityComponent,
        MarketingAnalysisComponent,
        InputTextModule,
        CarouselModule,
        ButtonModule,
        ReactiveFormsModule,
        DropdownModule,
        PaginatorModule,
        CardModule,
        DialogModule,
        foundersToolRountingModule,
        TooltipModule,
        MultiSelectModule,
        PdfViewerModule,
        SharedModule
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
