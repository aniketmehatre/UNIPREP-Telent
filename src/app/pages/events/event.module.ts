import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccordionModule} from "primeng/accordion";
import { EventsComponent } from './events.component';
import { EventsRoutingModule } from './events-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';

import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
 

@NgModule({
    imports: [
        CommonModule,
        EventsRoutingModule,
        EventsComponent,
        AccordionModule,
        ReactiveFormsModule,
        PaginatorModule,
        
        TooltipModule,
        DialogModule
    ]
})
export class EventsModule {
}
