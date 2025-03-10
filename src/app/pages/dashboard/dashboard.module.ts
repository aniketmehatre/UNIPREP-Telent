import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from "./dashboard.component";
import { CalendarModule } from 'primeng/calendar';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        DashboardComponent,
        CalendarModule,
        DatePickerModule 
    ]
})
export class DashboardModule { }
