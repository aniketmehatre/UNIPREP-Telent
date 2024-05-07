import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ModulesComponent} from "./modules.component";
import {ListSubModulesComponent} from "./list-sub-modules/list-sub-modules.component";
import {QuestionListComponent} from "./question-list/question-list.component";
import { QuizComponent } from './quiz/quiz.component';
import { QuizmenuComponent } from '../quizmenu/quizmenu.component';
 

const routes: Routes = [  {
  path: '', component: ModulesComponent,
    children: [
  {
    path: 'pre-admission', component: ListSubModulesComponent,
  },
  {
    path: 'travel-and-tourism', component: ListSubModulesComponent,
  },
  {
    path: 'post-admission', component: ListSubModulesComponent,
  },
  {
    path: 'career-hub', component: ListSubModulesComponent,
  },
  {
    path: 'university', component: ListSubModulesComponent,
  },
  {
    path: 'life-at-country', component: ListSubModulesComponent,
  },
  {
    path: 'learning-hub', component: ListSubModulesComponent,
  },
  {
    path: ':module_name/question-list/:id', component: QuestionListComponent,
  },
  {path: '', redirectTo: 'pre-admission', pathMatch: 'full'},
  {
    path: ':module_name/quiz', component: QuizComponent,
  },
  {
    path: 'quizmodule', component: QuizmenuComponent,

  }
]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
