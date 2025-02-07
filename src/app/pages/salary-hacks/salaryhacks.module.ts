import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PipesModule } from "@pipes/pipes.module";
// import { PdfViewerModule } from "ng2-pdf-viewer";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { SharedModule, ConfirmationService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { ChipModule } from "primeng/chip";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { EditorModule } from "primeng/editor";
import { InputTextModule } from "primeng/inputtext";
import { InputTextarea } from "primeng/inputtextarea";
import { PaginatorModule } from "primeng/paginator";
import { SidebarModule } from "primeng/sidebar";
import { SkeletonModule } from "primeng/skeleton";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TooltipModule } from "primeng/tooltip";
import { SalaryhacksComponent } from "./salaryhacks.component";
import { SalaryhacksListsComponent } from "./salaryhackslists/salaryhackslists.component";
import { SalaryhacksCountryListsComponent } from "./salary-hack-countries/salaryhackcountries.component";
import { SalaryHacksRoutingModule } from "./salaryhacks-routing.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextarea,
    SalaryHacksRoutingModule,
    ChipModule,
    FormsModule,
    DropdownModule,
    EditorModule,
    SidebarModule,
    CardModule,
    SplitButtonModule,
    ReactiveFormsModule,
    PipesModule,
    PaginatorModule,
    SlickCarouselModule,
    StepsModule,
    ConfirmPopupModule,
    DialogModule,
    SharedModule,
    TooltipModule,
    SkeletonModule,
    AutoCompleteModule,
    SalaryhacksCountryListsComponent,
    SalaryhacksComponent,
    SalaryhacksListsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService],
})
export class SalaryHacksModule {}
