import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EducationToolsRoutingModule } from './education-tools-routing.module';
import { EducationToolsComponent } from './education-tools.component';
import { EducationToolsListComponent } from './education-tools-list/education-tools-list.component';
import { CourseNavigatorComponent } from './course-navigator/course-navigator.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    EducationToolsComponent,
    EducationToolsListComponent,
    CourseNavigatorComponent,
  ],
  imports: [
    CommonModule,
    EducationToolsRoutingModule,
    FormsModule,
    CarouselModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    DialogModule,
      SharedModule
  ]
})
export class EducationToolsModule { }
