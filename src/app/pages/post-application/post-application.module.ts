import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostApplicationComponent} from './post-application.component';
import {ListSubModulesComponent} from './list-sub-modules/list-sub-modules.component';
import {PostApplicationRoutes} from './post-application.routing';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {postApplicationFeatureKey} from "./store/post-applicaiton.selectors";
import {PostApplicationReducer} from "./store/post-application.reducer";
import {PostApplicationEffects} from "./store/post-application.effects";
import {QuestionListComponent} from './question-list/question-list.component';
import {DialogModule} from "primeng/dialog";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";

@NgModule({
    imports: [
        CommonModule,
        PostApplicationRoutes,
        StoreModule.forFeature(postApplicationFeatureKey, PostApplicationReducer),
        EffectsModule.forFeature([PostApplicationEffects]),
        DialogModule,
        BreadcrumbModule,
        CarouselModule,
        ButtonModule,
    ],
    declarations: [PostApplicationComponent, ListSubModulesComponent, QuestionListComponent,
    ]
})
export class PostApplicationModule {
}
