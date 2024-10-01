import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { JobToolRoutingModule } from './job-tool-routing.module';
import { JobToolComponent } from './job-tool.component';
import { CareerToolComponent } from './career-tool/career-tool.component';
import { CvBuilderComponent } from './cv-builder/cv-builder.component';
import { CoverLetterBuilderComponent } from './cover-letter-builder/cover-letter-builder.component';
import { ChipsModule } from 'primeng/chips';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AngularFittextModule } from 'angular-fittext';
import { EditorModule } from 'primeng/editor';
import { SidebarModule } from 'primeng/sidebar';
import { CostOfLivingComponent } from './cost-of-living/cost-of-living.component';
import { CardModule } from 'primeng/card';
import { ComparisionComponent } from './cost-of-living/comparision/comparision.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PipesModule } from '@pipes/pipes.module';
import {SalaryConverterComponent} from "./salary-converter/salary-converter.component";
import {PaginatorModule} from "primeng/paginator";
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {StepsModule} from 'primeng/steps';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {ConfirmationService} from 'primeng/api';
import { QuizTestListComponent } from './quiz-test-list/quiz-test-list.component';
import { EmployerSubcategoryComponent } from './employer-subcategory/employer-subcategory.component';
import { CareerCategoryListComponent } from './career-category-list/career-category-list.component';
import {DialogModule} from "primeng/dialog";
import {SharedModule} from "../../shared/shared.module";
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [
    JobToolComponent,
    CareerToolComponent,
    CvBuilderComponent,
    CoverLetterBuilderComponent,
    CostOfLivingComponent,
    ComparisionComponent,
    SalaryConverterComponent,
    QuizTestListComponent,
    EmployerSubcategoryComponent,
    CareerCategoryListComponent,
    ],
    imports: [
        CommonModule,
        InputTextModule,
        CarouselModule,
        ButtonModule,
        ReactiveFormsModule,
        InputTextareaModule,
        JobToolRoutingModule,
        ChipsModule,
        FormsModule,
        DropdownModule,
        AngularFittextModule,
        EditorModule,
        SidebarModule,
        CardModule,
        SplitButtonModule,
        ReactiveFormsModule,
        PipesModule,
        PaginatorModule,
        SlickCarouselModule,
        StepsModule,
        PdfViewerModule,
        ConfirmPopupModule,
        DialogModule,
        SharedModule,
        TooltipModule,
        SkeletonModule,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService], 
})
export class JobToolModule{ }
