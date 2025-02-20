import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GlobalEmploymentComponent } from "./global-employment-insights.component";
import { GlobalEmploymentCountryListsComponent } from "./global-employment-insights-countries/global-employment-insights-countrylist.component";
import { GLobalEmploymentdataListsComponent } from "./data-list/data-list.component";

const routes: Routes = [
  {
    path: '', component: GlobalEmploymentComponent,
    children: [
      { path: 'lists', component: GLobalEmploymentdataListsComponent },
      { path: 'countries', component: GlobalEmploymentCountryListsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalEmploymentRoutingModule { }
