import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FortuneCompaniesComponent } from "./fortune-companies.component";
import { FortuneCompaniesListsComponent } from "./fortune-companies-list/fortune-companies-list.component";
import { FortuneCompaniesdataListsComponent } from "./data-list/data-list.component";

const routes: Routes = [
  {
    path: '', component: FortuneCompaniesComponent,
    children: [
      { path: 'lists', component: FortuneCompaniesdataListsComponent },
      { path: 'companylist', component: FortuneCompaniesListsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FortuneCompaniesRoutingModule { }
