import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RestrictionDialogComponent} from "./restriction-dialog/restriction-dialog.component";
import {DialogModule} from "primeng/dialog";
import { LaunchSoonTagComponent } from './launch-soon-tag/launch-soon-tag.component';

@NgModule({
  declarations: [RestrictionDialogComponent, LaunchSoonTagComponent],
  imports: [CommonModule,DialogModule],
  exports: [RestrictionDialogComponent, LaunchSoonTagComponent],
})
export class SharedModule { }
