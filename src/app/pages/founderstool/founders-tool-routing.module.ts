import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FounderstoolComponent } from './founderstool.component';
import { FoundersacademyComponent } from './foundersacademy/foundersacademy.component';
import { FounderstoollistComponent } from './founderstoollist/founderstoollist.component';
import { InvestorpitchtrainingComponent } from './investorpitchtraining/investorpitchtraining.component';
import { StartupglossaryComponent } from './startupglossary/startupglossary.component';

const routes: Routes = [
  {
    path: '', component: FounderstoolComponent,
    children: [
      {
        path: 'foundersacademy', component: FoundersacademyComponent
      },
      {
        path: 'founderstoollist', component: FounderstoollistComponent
      },
      {
        path: 'investorpitchtraining', component: InvestorpitchtrainingComponent
      },
      {
        path: 'startupglossary', component: StartupglossaryComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class foundersToolRountingModule { }