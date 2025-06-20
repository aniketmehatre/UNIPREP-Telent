import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileComponent } from './employee-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { BadgeModule } from 'primeng/badge';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { FluidModule } from 'primeng/fluid';
import { EditorModule } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';
import { CompleteProfileViewComponent } from './complete-profile-view/complete-profile-view.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { SharedModule } from "../../../shared/shared.module";
import { DrawerModule } from 'primeng/drawer';

const routes: Routes = [
  {
    path: '',
    component: EmployeeProfileComponent,
  },
  {
    path: ':id',
    component: CompleteProfileViewComponent
  }
]


@NgModule({
  declarations: [EmployeeProfileComponent],
  providers: [DialogService, ConfirmationService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FluidModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    DrawerModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    FileUploadModule,
    InputNumberModule,
    DialogModule,
    BadgeModule,
    SelectModule,
    DatePickerModule,
    ToastModule,
    MultiSelectModule,
    EditorModule,
    TooltipModule,
    ConfirmDialogModule,
    InputGroupAddonModule,
    InputGroupModule,
    SharedModule,
    ButtonModule
  ]
})
export class EmployeeProfileModule { }
