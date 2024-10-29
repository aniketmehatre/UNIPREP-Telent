import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from "./modules.component";
import { ListSubModulesComponent } from "./list-sub-modules/list-sub-modules.component";
import { QuestionListComponent } from "./question-list/question-list.component";
import { QuizComponent } from './quiz/quiz.component';
import { QuizmenuComponent } from '../quizmenu/quizmenu.component';
import { LearninghubquizComponent } from './learninghubquiz/learninghubquiz.component';
import { LanguagetypequizComponent } from './languagetypequiz/languagetypequiz.component';
import { AcademicToolsComponent } from './academic-tools/academic-tools.component';
import { AcademicToolsStreamComponent } from './academic-tools-stream/academic-tools-stream.component';
import { AcademicToolsQuizComponent } from './academic-tools-quiz/academic-tools-quiz.component';
import { K12ClassComponent } from "./k12-class/k12-class.component";
import { K12QuizComponent } from "./k12-quiz/k12-quiz.component";
import {K12BoardComponent} from "./k12-board/k12-board.component";
import {K12SubjectComponent} from "./k12-subject/k12-subject.component";
import {K12ChapterComponent} from "./k12-chapter/k12-chapter.component";
import {K12StateComponent} from "./k12-state/k12-state.component";


const routes: Routes = [{
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
            path: 'k12', component: K12BoardComponent,
        },
        {
            path: 'k12-class/:board_id', component: K12ClassComponent,
        },
        {
            path: 'k12-state/:board_id', component: K12StateComponent,
        },
        {
            path: 'k12-subject/:class_id', component: K12SubjectComponent,
        },
        {
            path: 'k12-chapter/:subject_id', component: K12ChapterComponent,
        },
        {
            path: ':module_name/question-list/:id', component: QuestionListComponent,
        },
        { path: '', redirectTo: 'pre-admission', pathMatch: 'full' },
        {
            path: ':module_name/quiz', component: QuizComponent,
        },
        {
            path: 'quizmodule', component: QuizmenuComponent,

        },
        {
            path: ':module_name/learninghubquiz', component: LearninghubquizComponent,
        },
        {
            path: ':module_name/languagehubquiz', component: LanguagetypequizComponent,
        },
        {
            path: ':module_name/k12-quiz', component: K12QuizComponent,
        },
        {
            path: 'skill-mastery', component: ListSubModulesComponent,
        },
        {
            path: ':module_name/careertoolquiz', component: LearninghubquizComponent,
        },
        {
            path: 'academic-tools', component: AcademicToolsComponent,
        },
        {
            path: 'academic-tools/:id', component: AcademicToolsStreamComponent,
        },
        {
            path: 'academic-tools/:id/quiz/:submoduleId/:categoryId', component: AcademicToolsQuizComponent,
        }
    ]


}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModulesRoutingModule {
}
