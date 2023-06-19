import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LifeAtRoutingModule } from './life-at-routing.module';
import { LifeAtComponent } from './life-at.component';

import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {CarouselModule} from "primeng/carousel";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CardModule} from "primeng/card";
import {ProgressBarModule} from "primeng/progressbar";
import { ListModulesComponent } from './list-modules/list-modules.component';

import { QuestionListComponent } from './question-list/question-list.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";


@NgModule({
  declarations: [
    LifeAtComponent,
    ListModulesComponent,
    QuestionListComponent
  ],
    imports: [
        CommonModule,
        LifeAtRoutingModule,

        TooltipModule,
        ButtonModule,
        DialogModule,
        CarouselModule,
        BreadcrumbModule,
        CardModule,
        ProgressBarModule,
        ConfirmDialogModule
    ]
})
export class LifeAtModule { }
