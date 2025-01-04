import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IlearnChallengeComponent } from './ilearn-challenge/ilearn-challenge.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { AssessmentComponent } from './assessment.component';
import { AssessmentQuizComponent } from './assessment-quiz/assessment-quiz.component';
import { AssessmentQuizReviewComponent } from './assessment-quiz-review/assessment-quiz-review.component';

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
                path: 'quiz/:moduleId', component: AssessmentQuizComponent
            },
            {
                path: 'quiz-review/:moduleId', component: AssessmentQuizReviewComponent
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
