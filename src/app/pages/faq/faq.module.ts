import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FaqRoutingModule} from './faq-routing.module';
import {FaqComponent} from './faq.component';
import {AccordionModule} from "primeng/accordion";
import { FaqService } from './faq.service';


@NgModule({
    declarations: [
        FaqComponent
    ],
    imports: [
        CommonModule,
        FaqRoutingModule,
        AccordionModule
    ],
    providers:[
        FaqService
    ]
})
export class FaqModule {
}
