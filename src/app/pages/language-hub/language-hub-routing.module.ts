import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LevelsComponent} from "./levels/levels.component";
import {CategoryListComponent} from "./category-list/category-list.component";
import {QuestionListComponent} from "./question-list/question-list.component";
import {LanguageListComponent} from "./language-list/language-list.component";
import {LanguageHubComponent} from "./language-hub.component";

const routes: Routes = [
    {
        path: '', component: LanguageHubComponent,
        children: [
            {
                path: 'languages', component: LanguageListComponent,
            },
            {
                path: 'levels/:id', component: LevelsComponent,
            },
            {
                path: 'category', component: CategoryListComponent,
            },
            {
                path: 'question-list', component: QuestionListComponent,
            },
            {
                path: '', redirectTo: 'languages', pathMatch: 'full'
            },
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LanguageHubRoutingModule {
}
