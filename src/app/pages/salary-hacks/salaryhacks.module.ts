import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SharedModule, ConfirmationService } from "primeng/api";
import { SalaryHacksRoutingModule } from "./salaryhacks-routing.module";
import { SalaryhacksCountryListsComponent } from "./salary-hack-countries/salaryhackcountries.component";
import { SalaryhacksListsComponent } from "./salaryhackslists/salaryhackslists.component";

@NgModule({
  imports: [
    CommonModule,
    SalaryHacksRoutingModule,
    SalaryhacksCountryListsComponent,
    SalaryhacksListsComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService]
})
export class SalaryHacksModule { }
