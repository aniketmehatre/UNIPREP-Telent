import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PreApplicationRoutingModule} from './pre-application-routing.module';
import {PreApplicationComponent} from './pre-application.component';
import {ListModulesComponent} from './list-modules/list-modules.component';
import {TooltipModule} from "primeng/tooltip";
import {QuestionListComponent} from './question-list/question-list.component';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {CarouselModule} from "primeng/carousel";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CardModule} from 'primeng/card';
import {ProgressBarModule} from "primeng/progressbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";


@NgModule({
    declarations: [
        PreApplicationComponent,
        ListModulesComponent,
        QuestionListComponent
    ],
    imports: [
        CommonModule,
        PreApplicationRoutingModule,

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
export class PreApplicationModule {
}
