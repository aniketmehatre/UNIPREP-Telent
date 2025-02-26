import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentConnectComponent } from './talent-connect.component';
import { JobTrackerComponent } from './job-tracker/job-tracker.component';

const routes: Routes = [
  {
        path: '', component: JobTrackerComponent,
        children: [
            {
                path: 'job-tracker',
                component: JobTrackerComponent
            }
        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
