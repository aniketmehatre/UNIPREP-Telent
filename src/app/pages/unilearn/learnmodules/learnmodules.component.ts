import { Component, OnInit } from "@angular/core"
import { PageFacadeService } from "../../page-facade.service"
import { learnModules } from "../unilearn.model"
import { UniLearnService } from "../unilearn.service"
import { ArrayHeaderService } from "../array-header.service"
import { CommonModule } from "@angular/common"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { RouterModule, Router } from "@angular/router"
import { StorageService } from "../../../storage.service";
import { AuthService } from "src/app/Auth/auth.service"

@Component({
	selector: "uni-learnmodules",
	templateUrl: "./learnmodules.component.html",
	styleUrls: ["./learnmodules.component.scss"],
	standalone: true,
	imports: [CommonModule, SkeletonModule, TooltipModule, RouterModule]
})

export class LearnModulesComponent implements OnInit {
	constructor(
		private pageFacade: PageFacadeService,
		private learnService: UniLearnService,
		private arrayHeaderService: ArrayHeaderService,
		private router: Router, private storage: StorageService,
		private authService: AuthService
	) { }

	isSkeletonVisible: boolean = true
	moduleList: any
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index)

	ngOnInit(): void {
		this.init()
		this.arrayHeaderService.clearAll()
	}

	init() {
		this.learnService.getLearnModules().subscribe((res: learnModules) => {
			this.isSkeletonVisible = false
			this.moduleList = res
		})
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}

	onModuleClick(moduledata: learnModules) {
		if (this.authService.isInvalidSubscription('uni_learn')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.arrayHeaderService.addItem(moduledata.module_name)
		this.storage.set("module_id", String(moduledata.id))
		// Navigate to submodules with query parameters using absolute path
		this.router.navigate(['/pages/unilearn/submodules'], {
			queryParams: {
				moduleId: moduledata.id,
				moduleName: moduledata.module_name
			}
		})
	}
}
