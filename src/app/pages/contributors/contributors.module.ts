import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributorsComponent } from './contributors.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {path: '', component: ContributorsComponent}
];

@NgModule({
  declarations: [
    ContributorsComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild(routes),
    DialogModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule
  ]
})
export class ContributorsModule { }
