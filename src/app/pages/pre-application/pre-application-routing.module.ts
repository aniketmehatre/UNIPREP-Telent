import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HelpSupportComponent} from "../help-support/help-support.component";
import {SupportCardComponent} from "../help-support/support-card/support-card.component";
import {SupportDescriptionComponent} from "../help-support/support-description/support-description.component";
import {SupportQueryComponent} from "../help-support/support-query/support-query.component";
import { ListModulesComponent } from './list-modules/list-modules.component';

const routes: Routes = [{
    path: '', component: ListModulesComponent,
    children: [
        {
            path: 'sub-modules', component: ListModulesComponent,
        },
        // {
        //     path: 'description', component: SupportDescriptionComponent,
        // },
        // {
        //     path: 'query', component: SupportQueryComponent,
        // },
        {path: '', redirectTo: 'sub-modules', pathMatch: 'full'}
    ]


},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreApplicationRoutingModule {
}
