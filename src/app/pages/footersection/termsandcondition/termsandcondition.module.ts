import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {AccordionModule} from "primeng/accordion";
import { TermsandconditionComponent } from './termsandcondition.component';
import { TermsAndConditionRoutingModule } from './termsandcondition-routing.module';


@NgModule({
    declarations: [
        TermsandconditionComponent,
    ],
    imports: [
        CommonModule,
        AccordionModule,
        TermsAndConditionRoutingModule,
     
    ],

})
export class TermsAnsConditionModule {
}
