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
import { JobListingComponent } from './job-listing/job-listing.component';

import { PaginatorModule } from 'primeng/paginator';
import { TimeAgoPipe } from './time-ago.pipe';
import {CardModule} from "primeng/card";
import {DialogModule} from "primeng/dialog";
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    imports: [
        CommonModule,
        TimeAgoPipe,
        JobBoardComponent,
        JobSearchComponent,
        JobHuntComponent,
        JobListingComponent,
        JobSearchRoutingModule,
        InputTextModule,
        CarouselModule,
        ButtonModule,
        ReactiveFormsModule,
        
        PaginatorModule,
        CardModule,
        DialogModule,
        TooltipModule,
    ]
})
export class JobSearchModule { }
