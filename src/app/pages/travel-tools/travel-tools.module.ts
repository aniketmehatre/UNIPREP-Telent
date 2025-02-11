import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TravelToolsRoutingModule } from "./travel-tools-routing.module"
import { TravelToolsComponent } from "./travel-tools.component"

@NgModule({
	imports: [
		CommonModule,
		TravelToolsRoutingModule,
		TravelToolsComponent
	]
})
export class TravelToolsModule {}
