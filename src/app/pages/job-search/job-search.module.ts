import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobSearchComponent } from './job-search.component';
import { JobHuntComponent } from './job-hunt/job-hunt.component';
import { JobBoardComponent } from './job-board/job-board.component';
import {InputTextModule} from 'primeng/inputtext';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    JobSearchComponent,
    JobHuntComponent,
    JobBoardComponent,
  ],
  imports: [
    CommonModule,
    JobSearchRoutingModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextareaModule,
  ]
})
export class JobSearchModule { }
