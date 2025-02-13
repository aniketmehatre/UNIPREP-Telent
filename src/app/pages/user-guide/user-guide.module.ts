import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer"
import { UserGuideRoutingModule } from './user-guide-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserGuideRoutingModule,
    PdfJsViewerModule
  ]
})
export class UserGuideModule { }
