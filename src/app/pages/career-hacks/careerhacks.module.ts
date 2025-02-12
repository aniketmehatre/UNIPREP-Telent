import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SharedModule, ConfirmationService } from "primeng/api";
import { CareerHacksRoutingModule } from "./careerhacks-routing.module";
import { CareerListsComponent } from "./career-lists/careerlists.component";
import { CareerhacksComponent } from "./careerhacks.component";

@NgModule({
    imports: [
        CommonModule,
        CareerHacksRoutingModule,
        CareerhacksComponent,
        CareerListsComponent,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService]
})
export class CareerHacksModule{ }
