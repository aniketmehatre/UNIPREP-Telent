import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from "./dashboard.component";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {SharedDirectives} from "../../@shared/directives/common-d";
import {EditorModule} from 'primeng/editor';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TableModule,
    FormsModule,
    InputTextareaModule,
    SharedDirectives,
    EditorModule
  ],
})
export class DashboardModule { }
