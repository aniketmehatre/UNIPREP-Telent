import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { UserGuideRoutingModule } from './user-guide-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserGuideRoutingModule,
    NgxExtendedPdfViewerModule
  ]
})
export class UserGuideModule { }
