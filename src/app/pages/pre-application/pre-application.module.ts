import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreApplicationRoutingModule } from './pre-application-routing.module';
import { PreApplicationComponent } from './pre-application.component';
import { ListModulesComponent } from './list-modules/list-modules.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {PreApplicationReducer} from "./store/pre-application.reducer";
import {PreApplicationEffects} from "./store/pre-application.effects";
import {preAppFeatureKey} from "./store/pre-application.selectors";


@NgModule({
  declarations: [
    PreApplicationComponent,
    ListModulesComponent
  ],
  imports: [
    CommonModule,
    PreApplicationRoutingModule,
    StoreModule.forFeature(preAppFeatureKey, PreApplicationReducer),
    EffectsModule.forFeature([PreApplicationEffects]),
  ]
})
export class PreApplicationModule { }
