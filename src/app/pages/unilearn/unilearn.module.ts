import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { ChipModule } from 'primeng/chip';
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from "primeng/paginator";
import { ProgressBarModule } from "primeng/progressbar";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { UniLearnRoutingModule } from "./unilearn-routing.module";
import { UniLearnComponent } from "./unilearn.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LearnModulesComponent } from "./learnmodules/learnmodules.component";
import { LearnsubModulesComponent } from "./learnsubmodules/learnsubmodules.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { TestModulesComponent } from "./testmodule/testmodule.component";
import { QuizinfowindowComponent } from "./quizinfowindow/quizinfowindow.component";
import { QuizwindowComponent } from "./quizwindow/quizwindow.component";
import { NgxAudioPlayerModule } from "ngx-audio-player";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";

@NgModule({
  declarations: [
    UniLearnComponent,
    LearnModulesComponent,
    LearnsubModulesComponent, 
    TestModulesComponent,
    QuizinfowindowComponent,
    QuizwindowComponent,
  ],
  imports: [
    Component,
    CommonModule,
    UniLearnRoutingModule,
    ChipModule,
    UniLearnRoutingModule,
    BreadcrumbModule,
    ButtonModule,
    CarouselModule,
    DialogModule,
    ProgressBarModule,
    SharedModule,
    SkeletonModule,
    TooltipModule,
    SkeletonModule,
    CardModule,
    PaginatorModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    NgxAudioPlayerModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    RadioButtonModule,
    BrowserAnimationsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UniLearnModule {}
