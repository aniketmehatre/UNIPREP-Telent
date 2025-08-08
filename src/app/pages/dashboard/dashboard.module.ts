import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from "./dashboard.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        DashboardComponent,
        DatePickerModule 
    ]
})
export class DashboardModule { }
