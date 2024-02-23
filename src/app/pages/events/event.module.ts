import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccordionModule} from "primeng/accordion";
import { EventsComponent } from './events.component';
import { EventsRoutingModule } from './events-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
 

@NgModule({
    declarations: [
        EventsComponent
    ],
    imports: [
        CommonModule,
        EventsRoutingModule,
        AccordionModule,
        ReactiveFormsModule,
        PaginatorModule,
        DropdownModule,
        TooltipModule,
        DialogModule
    ]
})
export class EventsModule {
}
