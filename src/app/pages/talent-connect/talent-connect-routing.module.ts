import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentConnectComponent } from './talent-connect.component';

const routes: Routes = [
  {
    path: '', component: TalentConnectComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentConnectRoutingModule { }
