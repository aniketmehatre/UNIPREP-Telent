import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResourceRoutingModule} from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import {AccordionModule} from "primeng/accordion";
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
    imports: [
        CommonModule,
        ResourceRoutingModule,
        AccordionModule,
        TooltipModule,
        ReactiveFormsModule,
        ResourceComponent,
        TooltipModule,
        MultiSelectModule,
        DialogModule,
        SkeletonModule
    ]
})
export class ResourceModule {
}
