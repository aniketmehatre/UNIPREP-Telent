import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RestrictionDialogComponent} from "./restriction-dialog/restriction-dialog.component";
import {DialogModule} from "primeng/dialog";

@NgModule({
  declarations: [RestrictionDialogComponent],
  imports: [CommonModule,DialogModule],
  exports: [RestrictionDialogComponent],
})
export class SharedModule { }
