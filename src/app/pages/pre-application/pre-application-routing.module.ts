import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListModulesComponent} from './list-modules/list-modules.component';
import {QuestionListComponent} from "./question-list/question-list.component";
import {PreApplicationComponent} from "./pre-application.component";

const routes: Routes = [{
    path: '', component: PreApplicationComponent,
    children: [
        {
            path: 'sub-modules', component: ListModulesComponent,
        },
        {
            path: 'sub-modules/:id', component: ListModulesComponent,
        },
        {
            path: 'question-list/:id', component: QuestionListComponent,
        },
        {path: '', redirectTo: 'sub-modules', pathMatch: 'full'}
    ]


},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreApplicationRoutingModule {
}
