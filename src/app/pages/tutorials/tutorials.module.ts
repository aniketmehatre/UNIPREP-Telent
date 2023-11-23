import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccordionModule} from "primeng/accordion";
import { TutorialsComponent } from './tutorials.component';
import { TutorialsRoutingModule } from './tutorials-routing.module';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
    declarations: [
        TutorialsComponent
    ],
    imports: [
        CommonModule,
        TutorialsRoutingModule,
        AccordionModule,
        TooltipModule
    ]
})
export class TutorialsModule {
}