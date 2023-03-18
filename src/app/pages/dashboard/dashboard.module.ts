import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from "./dashboard.component";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {SharedDirectives} from "../../@shared/directives/common-d";
import {EditorModule} from 'primeng/editor';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TableModule,
    FormsModule,
    InputTextareaModule,
    SharedDirectives,
    EditorModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    CardModule,
    CarouselModule
  ],
})
export class DashboardModule { }
