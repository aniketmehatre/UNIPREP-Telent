import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { JobToolRoutingModule } from "./job-tool-routing.module"
import { CareerToolComponent } from "./career-tool/career-tool.component"

@NgModule({
	imports: [
		CommonModule,
		CareerToolComponent,
		JobToolRoutingModule,
	],
})
export class JobToolModule {}
