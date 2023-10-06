import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccordionModule} from "primeng/accordion";
import { TutorialsComponent } from './tutorials.component';
import { TutorialsRoutingModule } from './tutorials-routing.module';


@NgModule({
    declarations: [
        TutorialsComponent
    ],
    imports: [
        CommonModule,
        TutorialsRoutingModule,
        AccordionModule
    ]
})
export class TutorialsModule {
}