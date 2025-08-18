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
import { SelectModule } from 'primeng/select';
import { EditorModule } from "primeng/editor";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { DrawerModule} from "primeng/drawer";
import { SkeletonModule } from "primeng/skeleton";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TooltipModule } from "primeng/tooltip";
import { FortuneCompaniesComponent } from "./fortune-companies.component";
import { FortuneCompaniesListsComponent } from "./fortune-companies-list/fortune-companies-list.component";
import { FortuneCompaniesdataListsComponent } from "./data-list/data-list.component";
import { FortuneCompaniesRoutingModule } from "./fortune-companies-routing.module";
import { RouterModule } from "@angular/router";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from "primeng/multiselect";
import { DatePickerModule } from "primeng/datepicker";
@NgModule({
  declarations: [
    FortuneCompaniesComponent,
    FortuneCompaniesdataListsComponent,
    FortuneCompaniesListsComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CarouselModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    FortuneCompaniesRoutingModule,
    ChipModule,
    FormsModule,
    EditorModule,
    DrawerModule ,
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
    RouterModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    MultiSelectModule ,
    DatePickerModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService],
})
export class FortuneCompaniesModule { }
