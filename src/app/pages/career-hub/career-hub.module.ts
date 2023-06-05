import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CareerHubRoutingModule} from './career-hub-routing.module';
import {CareerHubComponent} from './career-hub.component';
import {careerHubFeatureKey} from './store/career-hub.selectors';
import {CareerHubEffects} from './store/career-hub.effects';
import {CareerHubReducer} from './store/career-hub.reducer';
import {ListSubModulesComponent} from './list-sub-modules/list-sub-modules.component';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {DialogModule} from 'primeng/dialog';
import {CarouselModule} from 'primeng/carousel';
import {QuestionListComponent} from "./question-list/question-list.component";
import {BreadcrumbModule} from "primeng/breadcrumb";


@NgModule({
    declarations: [
        CareerHubComponent,
        ListSubModulesComponent,
        QuestionListComponent
    ],
    imports: [
        CommonModule,
        CareerHubRoutingModule,
        StoreModule.forFeature(careerHubFeatureKey, CareerHubReducer),
        EffectsModule.forFeature([CareerHubEffects]),
        DialogModule,
        CarouselModule,
        BreadcrumbModule,
    ]
})
export class CareerHubModule {
}
