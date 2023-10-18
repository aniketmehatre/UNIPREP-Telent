import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { RecentlyaddedquestionsComponent } from './recentlyaddedquestions.component';

const routes: Routes = [  {
  path: '', component: RecentlyaddedquestionsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecentlyAddedQuesRoutingModule { }
