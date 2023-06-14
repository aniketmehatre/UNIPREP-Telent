import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostAdmissionRoutingModule} from './post-admission-routing.module';
import {PostAdmissionComponent} from './post-admission.component';
import {ListSubModulesComponent} from './list-sub-modules/list-sub-modules.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {PostAdmissionReducer} from "./store/post-admission.reducer";
import {postAdmissionFeatureKey} from "./store/post-admission.selectors";
import {PostAdmissionEffects} from "./store/post-admission.effects";
import {QuestionListComponent} from './question-list/question-list.component';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CarouselModule} from "primeng/carousel";
import {DialogModule} from "primeng/dialog";
import {SharedModule} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressBarModule} from "primeng/progressbar";


@NgModule({
    declarations: [
        PostAdmissionComponent,
        ListSubModulesComponent,
        QuestionListComponent
    ],
    imports: [
        CommonModule,
        PostAdmissionRoutingModule,
        StoreModule.forFeature(postAdmissionFeatureKey, PostAdmissionReducer),
        EffectsModule.forFeature([PostAdmissionEffects]),
        BreadcrumbModule,
        CarouselModule,
        DialogModule,
        SharedModule,
        ConfirmDialogModule,
        ProgressBarModule,
    ]
})
export class PostAdmissionModule {
}
