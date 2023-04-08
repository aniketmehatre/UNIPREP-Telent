import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreApplicationRoutingModule } from './pre-application-routing.module';
import { PreApplicationComponent } from './pre-application.component';
import { ListModulesComponent } from './list-modules/list-modules.component';


@NgModule({
  declarations: [
    PreApplicationComponent,
    ListModulesComponent
  ],
  imports: [
    CommonModule,
    PreApplicationRoutingModule
  ]
})
export class PreApplicationModule { }
