import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IlearnChallengeComponent } from './ilearn-challenge/ilearn-challenge.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { AssessmentComponent } from './assessment.component';
import { ContestRulesComponent } from './contest-rules/contest-rules.component';
import { AssessmentQuizComponent } from './assessment-quiz/assessment-quiz.component';

const routes: Routes = [
    {
        path: '', component: AssessmentComponent,
        children: [
            {
                path: '', component: AssessmentListComponent
            },
            {
                path: 'ilearn-challenge', component: IlearnChallengeComponent
            },
            {
                path: 'contest-rules', component: ContestRulesComponent
            },
            {
                path: 'assessment-quiz/:moduleId', component: AssessmentQuizComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssessmentRoutingModule {
}
