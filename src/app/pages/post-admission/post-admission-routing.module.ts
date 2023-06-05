import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListSubModulesComponent} from "./list-sub-modules/list-sub-modules.component";
import {QuestionListComponent} from "./question-list/question-list.component";
import {PostAdmissionComponent} from "./post-admission.component";


const routes: Routes = [{
    path: '', component: PostAdmissionComponent,
    children: [
        {
            path: 'sub-modules', component: ListSubModulesComponent,
        },
        {
            path: 'question-list/:id', component: QuestionListComponent,
        },
        {
            path: '', redirectTo: 'sub-modules', pathMatch: 'full'
        }
    ]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostAdmissionRoutingModule {
}
