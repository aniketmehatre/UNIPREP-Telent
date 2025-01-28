import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SalaryhacksComponent } from "./salaryhacks.component";
import { SalaryhacksListsComponent } from "./salaryhackslists/salaryhackslists.component";
import { SalaryhacksCountryListsComponent } from "./salary-hack-countries/salaryhackcountries.component";

const routes: Routes = [
  {
    path: '', component: SalaryhacksComponent,
    children: [
      { path: 'lists', component: SalaryhacksListsComponent },
      { path: 'countrylist', component: SalaryhacksCountryListsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryHacksRoutingModule { }
