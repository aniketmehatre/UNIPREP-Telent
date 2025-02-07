import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccordionModule} from "primeng/accordion";
import { TutorialsComponent } from './tutorials.component';
import { TutorialsRoutingModule } from './tutorials-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { SafePipe } from '@pipes/safe.pipe';

@NgModule({
    imports: [
        CommonModule,
        TutorialsRoutingModule,
        AccordionModule,
        TooltipModule,
        CardModule,
    ]
})
export class TutorialsModule {
}