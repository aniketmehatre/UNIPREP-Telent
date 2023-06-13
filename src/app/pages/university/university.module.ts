import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UniversityRoutingModule} from './university-routing.module';
import { UniversityComponent } from './university.component';
import { ListModulesComponent } from './list-modules/list-modules.component';
import { QuestionListComponent } from './question-list/question-list.component';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CarouselModule} from "primeng/carousel";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {ProgressBarModule} from "primeng/progressbar";
import {SharedModule} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {universityFeatureKey} from "./store/university.selectors";
import {UniversityEffects} from "./store/university.effects";
import {UniversityReducer} from "./store/university.reducer";


@NgModule({
    declarations: [
    UniversityComponent,
    ListModulesComponent,
    QuestionListComponent
  ],
    imports: [
        CommonModule,
        UniversityRoutingModule,
        BreadcrumbModule,
        StoreModule.forFeature(universityFeatureKey, UniversityReducer),
        EffectsModule.forFeature([UniversityEffects]),
        CarouselModule,
        ConfirmDialogModule,
        DialogModule,
        ProgressBarModule,
        SharedModule,
        TooltipModule
    ]
})
export class UniversityModule {
}
