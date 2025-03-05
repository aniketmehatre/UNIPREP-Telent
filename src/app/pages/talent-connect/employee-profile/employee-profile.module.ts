import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileComponent } from './employee-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { Routes, RouterOutlet, RouterModule } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { BadgeModule } from 'primeng/badge';

const routes: Routes = [
  {
    path: '',
    component: EmployeeProfileComponent,
  },
]


@NgModule({
  declarations: [EmployeeProfileComponent],
  providers: [DialogService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule, 
    CalendarModule,
    ButtonModule, 
    CardModule, 
    ProgressBarModule,
    FileUploadModule ,
    InputNumberModule,
    DialogModule,
    BadgeModule
  ]
})
export class EmployeeProfileModule { }
