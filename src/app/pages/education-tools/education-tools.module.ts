import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EducationToolsRoutingModule } from './education-tools-routing.module';
import { EducationToolsComponent } from './education-tools.component';
import { EducationToolsListComponent } from './education-tools-list/education-tools-list.component';
import { CourseNavigatorComponent } from './course-navigator/course-navigator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PoliticianInsightsComponent } from './politician-insights/politician-insights.component';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import {SharedModule} from "../../shared/shared.module";
import { InputTextModule } from 'primeng/inputtext';
import { CountryInsightsComponent } from './country-insights/country-insights.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { WealthleaderslistComponent } from '../founderstool/wealthleaderslist/wealthleaderslist.component';
import { WealthleaderreadansComponent } from '../founderstool/wealthleaderreadans/wealthleaderreadans.component';

@NgModule({
  declarations: [
    EducationToolsComponent,
    EducationToolsListComponent,
    CourseNavigatorComponent,
    PoliticianInsightsComponent,
    CountryInsightsComponent,
    WealthleaderslistComponent,
    WealthleaderreadansComponent
  ],
  imports: [
    CommonModule,
    EducationToolsRoutingModule,
    FormsModule,
    CarouselModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    CardModule,
    DialogModule,
    SharedModule,
    InputTextModule,
    SelectButtonModule,
    ReactiveFormsModule
  ]
})
export class EducationToolsModule { }