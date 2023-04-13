import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListSubModulesComponent} from "./list-sub-modules/list-sub-modules.component";


const routes: Routes = [{
  path: '', component: ListSubModulesComponent,
  children: [
    {
      path: 'sub-modules', component: ListSubModulesComponent,
    },
    // {
    //     path: 'description', component: SupportDescriptionComponent,
    // },
    // {
    //     path: 'query', component: SupportQueryComponent,
    // },
    {path: '', redirectTo: 'sub-modules', pathMatch: 'full'}
  ]


},];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostAdmissionRoutingModule { }
