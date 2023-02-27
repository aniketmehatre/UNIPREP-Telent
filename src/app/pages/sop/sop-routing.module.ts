import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SopComponent} from "./sop.component";
import {SopCanDeactivateGuard} from "../../guards/sop-can-deactivate.guard";

const routes: Routes = [
  {
    path: '', component: SopComponent, canDeactivate: [SopCanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SopRoutingModule { }
