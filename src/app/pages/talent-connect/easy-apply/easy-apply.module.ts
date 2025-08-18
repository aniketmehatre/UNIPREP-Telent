import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasyApplyComponent } from './easy-apply.component';
import { RouterModule, Routes } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { JobViewComponent } from './job-view/job-view.component';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '@pipes/pipes.module';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { MessageModule } from 'primeng/message';
const routes: Routes = [
  {
    path: '',
    component: EasyApplyComponent,
  },
  {
    path: ':id',
    component: JobViewComponent
  }
]



@NgModule({
  declarations: [EasyApplyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChipModule,
    PopoverModule,
    DialogModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    TooltipModule,
    PipesModule,
    CardModule
  ]
})
export class EasyApplyModule { }
