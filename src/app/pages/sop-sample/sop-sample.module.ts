import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SopSampleRoutingModule } from './sop-sample-routing.module';
import { SopSampleSubcatgoryComponent } from './sop-sample-subcatgory/sop-sample-subcatgory.component';
import { SopListComponent } from './sop-list/sop-list.component';
import { SopsampleContentComponent } from './sopsample-content/sopsample-content.component';
import { SopsampleCategoryComponent } from './sopsample-category/sopsample-category.component';


@NgModule({
  declarations: [
    SopSampleSubcatgoryComponent,
    SopListComponent,
    SopsampleContentComponent,
    SopsampleCategoryComponent
  ],
  imports: [
    CommonModule,
    SopSampleRoutingModule
  ]
})
export class SopSampleModule { }
