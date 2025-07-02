import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { PageFacadeService } from "../../page-facade.service"
import { CommonModule, Location } from "@angular/common"
import { learnModules, learnsubModules, Quizmodule, submoduledata } from "../unilearn.model"
import { UniLearnService } from "../unilearn.service"
import { Router, RouterModule } from "@angular/router"
import { ButtonModule } from "primeng/button"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import {StorageService} from "../../../storage.service";
@Component({
	selector: "uni-quizinfowindow",
	templateUrl: "./quizinfowindow.component.html",
	styleUrls: ["./quizinfowindow.component.scss"],
	standalone: false,
})
export class QuizinfowindowComponent implements OnInit {
	@Input() parentid: number
	@Input() moduleid: number
	@Input() totalquestion: number
	@Input() selected_module: string
	quizwindowvisibility = false

	@Output() moduleChange = new EventEmitter()
	@Input() _contentalignment: boolean
	parantfolderId: number
	normalquizinstruction: boolean = false
	quizinstruction: [] = []
	quizinstructionname: any
	constructor(private pageFacade: PageFacadeService, private router: Router, private learnService: UniLearnService,
				private location: Location, private storage: StorageService) {}
	paramData: any
	ngOnInit(): void {
		this.parantfolderId = Number(this.storage.get("parent_folderid"))
		this.getunilearnquizdetails()
		var data = {
			id: this.parentid,
		}
		this.learnService.getQuizInstruction(data).subscribe((data: any) => {
			this.quizinstruction = JSON.parse(data.instructions)
			this.quizinstructionname = data.naming
		})
		// console.log(this.moduleid);
		// console.log(this.parentid);
		// console.log(this.selected_module);
		// console.log(Number(this.storage.get("parent_id")));
		// console.log(Number(this.storage.get("parent_folderid")));
	}
	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("unilearn")
	}
	enablequizWindow() {
		this.quizwindowvisibility = true
	}
	visibilityChange(data: any) {
		this.quizwindowvisibility = data
		this.moduleChange.emit({
			parent_id: Number(this.storage.get("parent_id")),
			module_id: this.moduleid,
			selected_module: this.selected_module,
			stage: 3,
		})
	}
	goBack() {
		this.moduleChange.emit({
			parent_id: Number(this.storage.get("parent_folderid")),
			module_id: this.moduleid,
			selected_module: this.selected_module,
			stage: 3,
			isfromquizinfo: true,
		})
	}
	getunilearnquizdetails() {
		this.learnService.getunilearnquizdetails({ id: this.parentid }).subscribe((res: any) => {
			this.totalquestion = res.q_count
		})
	}
}
