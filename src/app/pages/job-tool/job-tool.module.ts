import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { JobToolRoutingModule } from './job-tool-routing.module';
import { JobToolComponent } from './job-tool.component';
@NgModule({
  declarations: [
    JobToolComponent,
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
  exports: [JobToolComponent]
})
export class JobToolModule{ }
