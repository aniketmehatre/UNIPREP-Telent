import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResourceRoutingModule} from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import {AccordionModule} from "primeng/accordion";
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
    declarations: [
        ResourceComponent
    ],
    imports: [
        CommonModule,
        ResourceRoutingModule,
        AccordionModule,
        TooltipModule
    ]
})
export class ResourceModule {
}
