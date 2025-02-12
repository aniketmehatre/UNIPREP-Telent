import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccordionModule } from "primeng/accordion";
import { SuccessStoriesComponent } from './success-stories.component';
import { SuccessStoryRoutingModule } from './succes-stories-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';


@NgModule({
    imports: [
        CommonModule,
        SuccessStoryRoutingModule,
        AccordionModule,
        TooltipModule,
        CardModule,
        SuccessStoriesComponent,
        RouterModule
    ]
})
export class SuccessStoriesModule {
}