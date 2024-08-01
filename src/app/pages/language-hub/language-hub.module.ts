import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageHubRoutingModule } from './language-hub-routing.module';
import { LanguageHubComponent } from './language-hub.component';
import { LanguageListComponent } from './language-list/language-list.component';
import { LevelsComponent } from './levels/levels.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { QuestionListComponent } from './question-list/question-list.component';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ButtonModule} from "primeng/button";
import {CarouselModule} from "primeng/carousel";
import {DialogModule} from "primeng/dialog";
import {ProgressBarModule} from "primeng/progressbar";
import {SharedModule} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {SkeletonModule} from "primeng/skeleton";
import {CardModule} from "primeng/card";
import {PaginatorModule} from "primeng/paginator";
import {TranslateViewComponent} from "./translate-view/translate-view.component";


@NgModule({
  declarations: [
    LanguageHubComponent,
    LanguageListComponent,
    LevelsComponent,
    CategoryListComponent,
    QuestionListComponent,
      TranslateViewComponent
  ],
  imports: [
    CommonModule,
    LanguageHubRoutingModule,
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
    PaginatorModule
  ]
})
export class LanguageHubModule { }
