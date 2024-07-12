import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    JobToolComponent,
    CareerToolComponent,
    CvBuilderComponent,
    CoverLetterBuilderComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    JobToolRoutingModule,
  ],
})
export class JobToolModule{ }
