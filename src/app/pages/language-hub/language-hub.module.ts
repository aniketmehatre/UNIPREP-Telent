import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageHubRoutingModule } from './language-hub-routing.module';
import { LanguageHubComponent } from './language-hub.component';


@NgModule({
  declarations: [
    LanguageHubComponent
  ],
  imports: [
    CommonModule,
    LanguageHubRoutingModule
  ]
})
export class LanguageHubModule { }
