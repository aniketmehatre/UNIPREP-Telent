import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { LaunchSoonTagComponent } from './launch-soon-tag/launch-soon-tag.component';
import { PercentageLoaderComponent } from './percentage-loader/percentage-loader.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    LaunchSoonTagComponent,
    PercentageLoaderComponent  // Import the standalone component here
  ],
  exports: [
    PercentageLoaderComponent,
    LaunchSoonTagComponent,  // Export the standalone component here
  ],
})
export class SharedModule { }
