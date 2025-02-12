import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PipesModule } from "@pipes/pipes.module";
// import { PdfViewerModule } from "ng2-pdf-viewer";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { SharedModule, ConfirmationService } from "primeng/api";
import { SalaryhacksComponent } from "./salaryhacks.component";
import { SalaryhacksListsComponent } from "./salaryhackslists/salaryhackslists.component";
import { SalaryhacksCountryListsComponent } from "./salary-hack-countries/salaryhackcountries.component";
import { SalaryHacksRoutingModule } from "./salaryhacks-routing.module";

@NgModule({
  imports: [
    CommonModule,
    SalaryHacksRoutingModule,
    SalaryhacksCountryListsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService],
})
export class SalaryHacksModule {}
