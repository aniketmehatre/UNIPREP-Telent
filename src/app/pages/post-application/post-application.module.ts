import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostApplicationComponent} from './post-application.component';
import {ListSubModulesComponent} from './list-sub-modules/list-sub-modules.component';
import {PostApplicationRoutes} from './post-application.routing';
import {QuestionListComponent} from './question-list/question-list.component';
import {DialogModule} from "primeng/dialog";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";

@NgModule({
    imports: [
        CommonModule,
        PostApplicationRoutes,
        DialogModule,
        BreadcrumbModule,
        CarouselModule,
        ButtonModule,
        ConfirmDialogModule,
        ProgressBarModule,
    ],
    declarations: [PostApplicationComponent, ListSubModulesComponent, QuestionListComponent,
    ]
})
export class PostApplicationModule {
}
