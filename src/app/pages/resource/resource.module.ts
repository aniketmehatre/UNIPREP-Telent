import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResourceRoutingModule} from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import {AccordionModule} from "primeng/accordion";
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    declarations: [
        ResourceComponent
    ],
    imports: [
        CommonModule,
        ResourceRoutingModule,
        AccordionModule,
        TooltipModule,
        ReactiveFormsModule,
        DropdownModule,
        TooltipModule,
        MultiSelectModule,
        DialogModule
    ]
})
export class ResourceModule {
}
