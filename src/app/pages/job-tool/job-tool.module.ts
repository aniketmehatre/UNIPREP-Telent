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

@NgModule({
  declarations: [
    JobToolComponent,
    CareerToolComponent,
    CvBuilderComponent,
    CoverLetterBuilderComponent,
    CostOfLivingComponent,
    ComparisionComponent,
      SalaryConverterComponent
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobToolModule{ }
