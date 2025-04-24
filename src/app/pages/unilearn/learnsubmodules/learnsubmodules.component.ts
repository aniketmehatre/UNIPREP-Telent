import { CommonModule } from "@angular/common"
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core"
import { PageFacadeService } from "../../page-facade.service"
import { learnModules, learnsubModules, submoduledata } from "../unilearn.model"
import { UniLearnService } from "../unilearn.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { ArrayHeaderService } from "../array-header.service"
import { Location } from "@angular/common"
import { AuthService } from "src/app/Auth/auth.service"
import { DialogModule } from "primeng/dialog"

import { StorageService } from "../../../storage.service";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { RestrictionDialogComponent } from "src/app/shared/restriction-dialog/restriction-dialog.component"

@Component({
	selector: "uni-learnsubmodules",
	templateUrl: "./learnsubmodules.component.html",
	styleUrls: ["./learnsubmodules.component.scss"],
	imports: [DialogModule, CommonModule, PdfViewerModule, RouterModule, RestrictionDialogComponent],
	standalone: true,
})
export class LearnsubModulesComponent implements OnInit, AfterViewInit {
	@ViewChild('pdfViewer') pdfViewer: any;
	isSkeletonVisible: boolean = true
	submoduleList: any
	paramData: any
	planExpired: boolean = false
	restrict: boolean = false
	ehitlabelIsShow: boolean = true
	pdfURL: string = ""
	pdfvisibility = false
	moduleId: number
	moduleName: string
	imagewhitlabeldomainname: any
	pdfLoadError: boolean = false

	constructor(private pageFacade: PageFacadeService, private authService: AuthService,
		private router: Router, private arrayHeaderService: ArrayHeaderService,
		private learnService: UniLearnService, private route: ActivatedRoute,
		private location: Location, private storage: StorageService) { }

	ngOnInit(): void {
		// Get query parameters
		this.route.queryParams.subscribe((params) => {
			this.moduleId = params["moduleId"]
			this.moduleName = params["moduleName"]
			if (this.moduleId) {
				this.paramData = { parent_id: 0, module_id: this.moduleId }
				this.arrayHeaderService.addItem(this.moduleName)
				this.getModules()
			}
		})

		this.checkplanExpire()

	}

	ngAfterViewInit() {
		if (this.pdfViewer) {
			this.pdfViewer.pdfSrc = this.pdfURL;
			this.pdfViewer.refresh();
		}
	}

	getFormattedValues(): string {
		return this.arrayHeaderService.getItems().join(` > `)
	}

	getModules() {
		this.learnService.getUniLearnsubModules(this.paramData).subscribe((res: learnsubModules) => {
			this.isSkeletonVisible = false
			this.submoduleList = res.data
			this.storage.set("parent_id", String(res.previous_id))
		})
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}

	onModuleClick(moduledata: submoduledata) {
		if (moduledata.isTestmodule == 1) {
			this.arrayHeaderService.addItem(moduledata.submodule_name)
			// Navigate to test module using absolute path
			this.router.navigate(["/pages/unilearn/test"], {
				queryParams: {
					parentId: moduledata.id,
					moduleId: moduledata.module_id,
					moduleName: moduledata.submodule_name,
				},
			})
			return
		}

		this.arrayHeaderService.addItem(moduledata.submodule_name)
		this.paramData.parent_id = moduledata.id
		this.paramData.module_id = moduledata.module_id

		switch (moduledata.file_type) {
			case 1:
				this.getModules()
				break
			case 2:
				this.pdfLoadError = false
				this.pdfvisibility = true
				// Check if URL starts with http/https, if not add it
				if (moduledata.attachment_filename && !moduledata.attachment_filename.startsWith("http")) {
					this.pdfURL = "https://" + moduledata.attachment_filename
				} else {
					this.pdfURL = moduledata.attachment_filename
				}

				// Configure PDF viewer after URL is set
				setTimeout(() => {
					if (this.pdfViewer) {
						this.pdfViewer.pdfSrc = this.pdfURL;
						this.pdfViewer.refresh();
					}
				}, 100);
				break
			case 3:
				this.pageFacade.openHowitWorksVideoPopup(moduledata.attachment_filename)
				break
			case 4:
				break
			default:
				this.getModules()
				break
		}
	}

	onError(error: any) {
		console.error("PDF loading error:", error)
		this.pdfLoadError = true
	}

	backtoMain() {
		this.arrayHeaderService.removeItem(this.arrayHeaderService.getItems().length - 1)
		this.getFormattedValues()

		if (this.pdfvisibility) {
			this.pdfvisibility = false
			return
		}

		if (this.submoduleList.length == 0 || this.submoduleList[0]?.parent_folder_id == 0) {
			this.router.navigate(["/pages/unilearn/modules"])
			return
		}

		this.paramData.parent_id = Number(this.storage.get("parent_id"))
		this.paramData.module_id = Number(this.storage.get("module_id"))
		this.getModules()
	}

	download() {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		window.open(this.pdfURL, "_blank")
	}

	checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			let data = res.time_left
			let subscription_exists_status = res.subscription_details
			if (data.plan === "expired" || data.plan === "subscription_expired") {
				this.planExpired = true
			} else {
				this.planExpired = false
			}
		})
	}

	upgradePlan(): void {
		this.router.navigate(["/pages/subscriptions"])
	}

	clearRestriction() {
		this.restrict = false
	}
}
