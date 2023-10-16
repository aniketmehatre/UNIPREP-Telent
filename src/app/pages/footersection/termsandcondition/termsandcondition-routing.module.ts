import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TermsandconditionComponent } from './termsandcondition.component';


const routes: Routes = [
    {path: '', component: TermsandconditionComponent}
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TermsAndConditionRoutingModule {
}
