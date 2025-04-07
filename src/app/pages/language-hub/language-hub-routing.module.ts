import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelsComponent } from "./levels/levels.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { QuestionListComponent } from "./question-list/question-list.component";
import { LanguageListComponent } from "./language-list/language-list.component";
import { LanguageHubComponent } from "./language-hub.component";
import { TranslateViewComponent } from "./translate-view/translate-view.component";
import { PvlComponent } from './pvl/pvl.component';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { LearningVideosComponent } from './learning-videos/learning-videos.component';

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
                path: 'pvl/:id', component: PvlComponent,
            },
            {
                path: 'vocabulary/:id', component: VocabularyComponent,
            },
            {
                path: 'learning-videos', component: LearningVideosComponent,
            },
            {
                path: 'category', component: CategoryListComponent,
            },
            {
                path: 'question-list/:id', component: QuestionListComponent,
            },
            {
                path: 'translate-view', component: TranslateViewComponent,
            },
            {
                path: 'translate-view/:id', component: TranslateViewComponent,
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
