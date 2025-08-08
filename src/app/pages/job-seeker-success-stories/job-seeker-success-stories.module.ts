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
import { EditorModule } from "primeng/editor";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { DrawerModule  } from "primeng/drawer";
import { SkeletonModule } from "primeng/skeleton";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TooltipModule } from "primeng/tooltip";
import { JobSeekerRoutingModule } from "./job-seeker-success-stories-routing.module";

@NgModule({
    imports: [
        CommonModule,
        JobSeekerRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        PipesModule,
        SlickCarouselModule,
        SharedModule,
        AutoCompleteModule,
        ButtonModule,
        CardModule,
        CarouselModule,
        ChipModule,
        ConfirmPopupModule,
        DialogModule,
        EditorModule,
        InputTextModule,
        PaginatorModule,
        DrawerModule ,
        SkeletonModule,
        SplitButtonModule,
        StepsModule,
        TooltipModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ConfirmationService]
})
export class JobSeekerSuccessStoriesModule { }
