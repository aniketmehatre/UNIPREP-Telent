import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { PageFacadeService } from "../../page-facade.service"
import { learnsubModules, submoduledata } from "../unilearn.model"
import { UniLearnService } from "../unilearn.service"
import { ActivatedRoute, Router } from "@angular/router"
import { ArrayHeaderService } from "../array-header.service"
import { CommonModule } from "@angular/common"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { RouterModule } from "@angular/router"
import { StorageService } from "../../../storage.service"
@Component({
	selector: "uni-testmodule",
	templateUrl: "./testmodule.component.html",

	styleUrls: ["./testmodule.component.scss"],
  standalone: false,
})

export class TestModulesComponent implements OnInit {
	@Input() parentid: number
	@Input() moduleid: number
	@Input() selected_module: string
	@Input() totalquestion: number
	@Output() moduleChange = new EventEmitter()
	@Input() _contentalignment: boolean
	isSkeletonVisible: boolean = true
	submoduleList: any
	constructor(private pageFacade: PageFacadeService, private router: Router,
				private arrayHeaderService: ArrayHeaderService,
				private learnService: UniLearnService,
				private route: ActivatedRoute,
				private storage: StorageService) {}
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index)
	paramData: any
	ngOnInit(): void {
		this.paramData = { parent_id: this.parentid, module_id: this.moduleid }
		this.contentalignment = this._contentalignment
		this.getModules()
		this.route.params.subscribe(() => {
			this.arrayHeaderService.removeItem(1)
		})
	}

	getFormattedValues(): string {
		return this.arrayHeaderService.getItems().join(" > ")
	}
	avgtotalQuestions = 0
	avgtotalAnswers = 0
	getModules() {
		this.learnService.getUniLearnsubModules(this.paramData).subscribe((res: learnsubModules) => {
			this.isSkeletonVisible = false
			this.submoduleList = res.data
			this.avgtotalQuestions = res.totalQuestions
			this.avgtotalAnswers = res.userAnsweredQuestions
			this.storage.set("parent_id", String(res.previous_id))
		})
	}
	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("unilearn")
	}
	
	contentalignment = false
	onModuleClick(moduledata: submoduledata) {
		this.paramData.parent_id = moduledata.id
		this.paramData.module_id = moduledata.module_id
		this.selected_module = moduledata.submodule_name
		this.parentid = moduledata.parent_folder_id
		this.moduleid = moduledata.module_id
		switch (moduledata.file_type) {
			case 4:
				this.contentalignment = true
				this.isSkeletonVisible = true
				this.getModules()
				break
			case 5:
				this.storage.set("parent_folderid", String(moduledata.parent_folder_id))
				this.moduleChange.emit({
					parent_id: moduledata.id,
					module_id: moduledata.module_id,
					selected_module: moduledata.submodule_name,
					totalquestion: moduledata.totalQuestions,
					stage: 4,
				})
				break
		}
		if (this.arrayHeaderService.getItems().length > 1) {
			this.arrayHeaderService.removeItem(1)
		}
		this.arrayHeaderService.addItem(moduledata.submodule_name)
	}

	back() {
		//this.arrayHeaderService.removeItem(this.arrayHeaderService.getItems().length - 1);
		this.getFormattedValues()
		const hasFileType4 = this.submoduleList.some((data: any) => data.file_type === 4)
		if (hasFileType4) {
			this.moduleChange.emit({
				parent_id: 0,
				module_id: this.moduleid,
				selected_module: this.selected_module,
				stage: 2,
			})
		}
		const hasFileType5 = this.submoduleList.some((data: any) => data.file_type === 5)
		if (hasFileType5) {
			this.contentalignment = false
		}
		if (this.submoduleList.length == 0) {
			this.moduleChange.emit({
				parent_id: 0,
				module_id: this.moduleid,
				selected_module: this.selected_module,
				stage: 2,
			})
			return
		}
		if (this.submoduleList[0]?.parent_folder_id == 0) {
			this.moduleChange.emit({
				parent_id: 0,
				module_id: this.moduleid,
				selected_module: this.selected_module,
				stage: 2,
			})
			return
		} else {
			this.paramData.parent_id = Number(this.storage.get("parent_id"))
			this.paramData.module_id = Number(this.storage.get("module_id"))
			this.isSkeletonVisible = true
			this.getModules()
		}
	}
}
