import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CareerHubRoutingModule} from './career-hub-routing.module';
import {CareerHubComponent} from './career-hub.component';
import {ListSubModulesComponent} from './list-sub-modules/list-sub-modules.component';
import {DialogModule} from 'primeng/dialog';
import {CarouselModule} from 'primeng/carousel';
import {QuestionListComponent} from "./question-list/question-list.component";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";


@NgModule({
    declarations: [
        CareerHubComponent,
        ListSubModulesComponent,
        QuestionListComponent
    ],
    imports: [
        CommonModule,
        CareerHubRoutingModule,
        DialogModule,
        CarouselModule,
        BreadcrumbModule,
        ButtonModule,
        ConfirmDialogModule,
        ProgressBarModule,
    ]
})
export class CareerHubModule {
}
