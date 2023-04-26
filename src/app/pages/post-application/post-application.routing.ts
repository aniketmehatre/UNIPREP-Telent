import {RouterModule, Routes} from '@angular/router';
import {ListSubModulesComponent} from './list-sub-modules/list-sub-modules.component';
import {PostApplicationComponent} from "./post-application.component";
import {QuestionListComponent} from "./question-list/question-list.component";

const routes: Routes = [
    {
        path: '', component: PostApplicationComponent,
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
    },
];

export const PostApplicationRoutes = RouterModule.forChild(routes);
