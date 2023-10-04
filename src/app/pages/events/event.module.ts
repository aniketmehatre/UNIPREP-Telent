import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccordionModule} from "primeng/accordion";
import { EventsComponent } from './events.component';
import { EventsRoutingModule } from './events-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';


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
        DropdownModule
    ]
})
export class EventsModule {
}
