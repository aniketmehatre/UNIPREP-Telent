import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributorsComponent } from './contributors.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';

const routes: Routes = [
  { path: '', component: ContributorsComponent },
  { path: ':id/:questionId', component: ContributorsComponent }, // Question Share
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
    ReactiveFormsModule,
    SkeletonModule,
    CardModule
  ]
})
export class ContributorsModule { }
