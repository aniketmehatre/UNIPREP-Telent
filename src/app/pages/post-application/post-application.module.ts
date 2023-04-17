import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostApplicationComponent } from './post-application.component';
import { ListSubModulesComponent } from './list-sub-modules/list-sub-modules.component';
import { PostApplicationRoutes } from './post-application.routing';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {postApplicationFeatureKey} from "./store/post-applicaiton.selectors";
import {PostApplicationReducer} from "./store/post-application.reducer";
import {PostApplicationEffects} from "./store/post-application.effects";

@NgModule({
  imports: [
    CommonModule,
    PostApplicationRoutes,
    StoreModule.forFeature(postApplicationFeatureKey, PostApplicationReducer),
    EffectsModule.forFeature([PostApplicationEffects]),
  ],
  declarations: [PostApplicationComponent, ListSubModulesComponent,
  ]
})
export class PostApplicationModule { }
