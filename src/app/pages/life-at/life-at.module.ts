import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LifeAtRoutingModule } from './life-at-routing.module';
import { LifeAtComponent } from './life-at.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {CarouselModule} from "primeng/carousel";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CardModule} from "primeng/card";
import {ProgressBarModule} from "primeng/progressbar";
import { ListModulesComponent } from './list-modules/list-modules.component';
import {lifeAtFeatureKey} from "./store/life-at.selectors";
import {LifeAtReducer} from "./store/life-at.reducer";
import {LifeAtEffects} from "./store/life-at.effects";
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
        StoreModule.forFeature(lifeAtFeatureKey, LifeAtReducer),
        EffectsModule.forFeature([LifeAtEffects]),
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
