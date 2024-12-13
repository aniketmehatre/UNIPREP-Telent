import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IlearnChallengeComponent } from './ilearn-challenge/ilearn-challenge.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { AssessmentComponent } from './assessment.component';

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
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssessmentRoutingModule {
}
