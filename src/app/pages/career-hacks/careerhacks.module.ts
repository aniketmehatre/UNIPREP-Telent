import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PipesModule } from "@pipes/pipes.module";
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
import { PaginatorModule } from "primeng/paginator";
import { SidebarModule } from "primeng/sidebar";
import { SkeletonModule } from "primeng/skeleton";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TooltipModule } from "primeng/tooltip";
import { CareerHacksRoutingModule } from "./careerhacks-routing.module";
import { CareerListsComponent } from "./career-lists/careerlists.component";
import { CHCountryListsComponent } from "./career-countries/careercountries.component";
import { CareerhacksComponent } from "./careerhacks.component";

@NgModule({
    imports: [
        CommonModule,
        InputTextModule,
        CarouselModule,
        CareerhacksComponent,
        CareerListsComponent,
        CHCountryListsComponent,
        ButtonModule,
        ReactiveFormsModule,
        CareerHacksRoutingModule,
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
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService]
})
export class CareerHacksModule{ }
