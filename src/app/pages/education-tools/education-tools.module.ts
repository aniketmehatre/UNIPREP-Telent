import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EducationToolsRoutingModule } from './education-tools-routing.module';
import { EducationToolsComponent } from './education-tools.component';

@NgModule({
	imports: [
		CommonModule,
		EducationToolsRoutingModule,
		EducationToolsComponent // Only need the main component since others are lazy loaded
	]
})
export class EducationToolsModule { }