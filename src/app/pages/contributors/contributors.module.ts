import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributorsComponent } from './contributors.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';

const routes: Routes = [
  { path: '', component: ContributorsComponent },
  { path: ':id/:questionId', component: ContributorsComponent }, // Question Share
];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild(routes),
    DialogModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
    ContributorsComponent,
    SkeletonModule,
    CardModule
  ]
})
export class ContributorsModule { }
