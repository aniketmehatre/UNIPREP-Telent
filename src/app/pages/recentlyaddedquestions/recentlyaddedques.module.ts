import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CarouselModule} from "primeng/carousel";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {ProgressBarModule} from "primeng/progressbar";
import {SharedModule} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {PipesModule} from "@pipes/pipes.module";
import {TagModule} from "primeng/tag";
import { RecentlyaddedquestionsComponent } from './recentlyaddedquestions.component';
import { RecentlyAddedQuesRoutingModule } from './recentlyaddedques-routing.module';


@NgModule({
  declarations: [
    RecentlyaddedquestionsComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CarouselModule,
    ConfirmDialogModule,
    DialogModule,
    RecentlyAddedQuesRoutingModule,
    ProgressBarModule,
    SharedModule,
    TooltipModule,
    PipesModule,
    TagModule
  ]
})
export class RecentlyAddedQuestionsModule { }
