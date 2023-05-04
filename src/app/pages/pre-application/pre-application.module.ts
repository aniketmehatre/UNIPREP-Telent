import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PreApplicationRoutingModule} from './pre-application-routing.module';
import {PreApplicationComponent} from './pre-application.component';
import {ListModulesComponent} from './list-modules/list-modules.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {PreApplicationReducer} from "./store/pre-application.reducer";
import {PreApplicationEffects} from "./store/pre-application.effects";
import {preAppFeatureKey} from "./store/pre-application.selectors";
import {TooltipModule} from "primeng/tooltip";
import {QuestionListComponent} from './question-list/question-list.component';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {CarouselModule} from "primeng/carousel";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CardModule} from 'primeng/card';


@NgModule({
    declarations: [
        PreApplicationComponent,
        ListModulesComponent,
        QuestionListComponent
    ],
    imports: [
        CommonModule,
        PreApplicationRoutingModule,
        StoreModule.forFeature(preAppFeatureKey, PreApplicationReducer),
        EffectsModule.forFeature([PreApplicationEffects]),
        TooltipModule,
        ButtonModule,
        DialogModule,
        CarouselModule,
        BreadcrumbModule,
        CardModule
    ]
})
export class PreApplicationModule {
}
