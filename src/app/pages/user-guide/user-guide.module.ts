import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGuideRoutingModule } from './user-guide-routing.module';
import {PdfViewerModule} from "ng2-pdf-viewer";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserGuideRoutingModule,
    PdfViewerModule
  ]
})
export class UserGuideModule { }
