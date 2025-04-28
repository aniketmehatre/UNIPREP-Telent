import { CommonModule } from "@angular/common" // Import CommonModule
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { ArrayHeaderService } from "../../unilearn/array-header.service"
import { SalaryHacksService } from "../salaryhacks.service"
import { PageFacadeService } from "../../page-facade.service"
import { Router } from "@angular/router"
import { count } from "console"
import { RouterModule } from "@angular/router"
import { DialogModule } from "primeng/dialog"
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
import { SkeletonModule } from "primeng/skeleton";
import { AuthService } from "src/app/Auth/auth.service"
@Component({
	selector: "uni-salaryhackscountries",
	templateUrl: "./salaryhackcountries.component.html",
	styleUrls: ["./salaryhackcountries.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule],
})
export class SalaryhacksCountryListsComponent implements OnInit {
	constructor(private router: Router, private arrayHeaderService: ArrayHeaderService, private service: SalaryHacksService,
		private pageFacade: PageFacadeService, private authService: AuthService) { }
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
		this.service.getSalarynegotitationhackcountries().subscribe((res: any) => {
			this.isSkeletonVisible = false
			this.moduleList = res
		})
	}
	backtoMain() {
		this.router.navigateByUrl("/pages/job-tool/career-tool")
	}
	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
	onModuleClick(moduledata: any) {
		if (this.authService.isInvalidSubscription('career_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
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
