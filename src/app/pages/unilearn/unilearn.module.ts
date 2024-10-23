import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { ChipsModule } from "primeng/chips";
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from "primeng/paginator";
import { ProgressBarModule } from "primeng/progressbar";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { UniLearnRoutingModule } from "./unilearn-routing.module";
import { UniLearnComponent } from "./unilearn.component";
import { LearnModulesComponent } from "./learnmodules/learnmodules.component";
import { LearnsubModulesComponent } from "./learnsubmodules/learnsubmodules.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { AnimateModule } from "primeng/animate";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { TestModulesComponent } from "./testmodule/testmodule.component";
import { QuizwindowComponent } from "./quizwindow/quizwindow.component";

@NgModule({
    declarations: [
        UniLearnComponent,      
        LearnModulesComponent,
        LearnsubModulesComponent,
        TestModulesComponent,
        QuizwindowComponent
    ],
      imports: [
          CommonModule,
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
          ChipsModule,
          NgxExtendedPdfViewerModule,
          PdfViewerModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })
  export class UniLearnModule { }
  