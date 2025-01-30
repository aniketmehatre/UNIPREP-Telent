import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CareerhacksComponent } from "./careerhacks.component";
import { CareerListsComponent } from "./career-lists/careerlists.component";
import { CHCountryListsComponent } from "./career-countries/careercountries.component";

const routes: Routes = [
  {
    path: '', component: CareerhacksComponent,
    children: [
      { path: 'lists', component: CareerListsComponent },
      { path: 'countrylist', component: CHCountryListsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerHacksRoutingModule { }
