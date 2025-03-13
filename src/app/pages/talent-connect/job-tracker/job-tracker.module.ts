import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { JobTrackerComponent } from './job-tracker.component';
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {JobListComponent} from "./job-list/job-list.component";
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";
import {TableModule} from "primeng/table";
import {TabViewModule} from "primeng/tabview";
import {AvatarModule} from "primeng/avatar";
import {TooltipModule} from "primeng/tooltip";
import {StepsModule} from "primeng/steps";
import {DividerModule} from "primeng/divider";
import {SharedModule} from "../../../shared/shared.module";

const routes: Routes = [
  {
    path: '',
    component: JobTrackerComponent,
  }
]



@NgModule({
  declarations: [JobTrackerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Dialog,
    Select,
    FormsModule,
    DialogModule,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    InputTextModule,
    AvatarModule,
    ChipModule,
    TooltipModule,
    StepsModule,
    DialogModule,
    DividerModule,
    FormsModule,
    SharedModule,
    DialogModule,
    DropdownModule,
    PaginatorModule,
    JobListComponent,
  ]
})
export class JobTrackerModule { }
