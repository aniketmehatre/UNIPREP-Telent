import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PipesModule } from "@pipes/pipes.module";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { SharedModule, ConfirmationService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
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
import { GlobalEmploymentComponent } from "./global-employment-insights.component";
import { GlobalEmploymentDataListComponent } from "./data-list/data-list.component";
import { GlobalEmploymentCountryListsComponent } from "./global-employment-insights-countries/global-employment-insights-countrylist.component";
import { GlobalEmploymentRoutingModule } from "./global-employment-insights-routing.module";
@NgModule({
  declarations: [
    GlobalEmploymentComponent,
    GlobalEmploymentDataListComponent,
    GlobalEmploymentCountryListsComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    GlobalEmploymentRoutingModule,
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
    PdfViewerModule,
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
export class GlobalEmploymentModule { }
