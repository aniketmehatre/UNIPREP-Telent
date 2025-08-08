import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { ArrayHeaderService } from "../../unilearn/array-header.service"
import { CareerJobHacksService } from "../careerhacks.service"
import { PageFacadeService } from "../../page-facade.service"
import { Router } from "@angular/router"
// import { count } from "console"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { RouterModule } from "@angular/router"
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { SkeletonModule } from "primeng/skeleton"
@Component({
	selector: "uni-careercountries",
	templateUrl: "./careercountries.component.html",
	styleUrls: ["./careercountries.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, SkeletonModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
})
export class CHCountryListsComponent implements OnInit {
	constructor(private router: Router, private arrayHeaderService: ArrayHeaderService, private service: CareerJobHacksService,
		private pageFacade: PageFacadeService) { }
	isSkeletonVisible: boolean = true
	moduleList: any
	@Input() prepData: any
	@Output() windowChange = new EventEmitter()
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index)

	ngOnInit(): void {
		this.init()
		this.arrayHeaderService.clearAll()
	}
	init() {
		this.service.getcareerjobcountries().subscribe((res: any) => {
			this.isSkeletonVisible = false
			this.moduleList = res
		})
	}
	backtoMain() {
		this.router.navigateByUrl("/pages/job-tool/career-tool")
	}
	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("career-hacks")
	}
	onModuleClick(moduledata: any) {
		this.prepData = {
			country_id: moduledata.id,
			stage: 2,
		}
		this.windowChange.emit({
			country_id: moduledata.id,
			countryName: moduledata.country,
			stage: 2,
		})
	}
}
