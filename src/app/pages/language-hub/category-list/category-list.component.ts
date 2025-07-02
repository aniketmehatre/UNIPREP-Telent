import { Component, OnInit } from "@angular/core"
import { LanguageHubService } from "../language-hub.service"
import { Router, RouterModule } from "@angular/router"
import { Location } from "@angular/common"
import { LanguageHubDataService } from "../language-hub-data.service"
import { MessageService } from "primeng/api"
import { PageFacadeService } from "../../page-facade.service"
import { AuthService } from "src/app/Auth/auth.service"
import { LanguageArrayGlobalService } from "../language-array-global.service"
import { LocationService } from "src/app/location.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { PaginatorModule } from "primeng/paginator"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { CarouselModule } from "primeng/carousel"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { StorageService } from "../../../storage.service"
@Component({
	selector: "uni-category-list",
	templateUrl: "./category-list.component.html",
	styleUrls: ["./category-list.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, PaginatorModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule],
})
export class CategoryListComponent implements OnInit {
	isSkeletonVisible: boolean = true
	categoryList: any
	totalQuestionCount: any
	selectedLanguageId: any
	selectedLanguageType: any
	currentModuleSlug: any
	quizpercentage: any = 0
	page: number = 1
	perpage: number = 25
	planExpired: boolean = false
	selectedLevelName: string = ""

	constructor(private languageHubService: LanguageHubService, private lhs: LanguageHubDataService, private router: Router, private toast: MessageService, private languageArrayGlobalService: LanguageArrayGlobalService, private location: Location, private pageFacade: PageFacadeService, private authService: AuthService, private locationService: LocationService, private storage: StorageService) {
		this.lhs.data$.subscribe((data) => {
			this.selectedLanguageId = data
		})
		this.lhs.dataLanguageType$.subscribe((data) => {
			this.selectedLanguageType = data
		})
		this.lhs.dataLanguageTypeName$.subscribe((data) => {
			this.selectedLevelName = data
		})
	}

	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index)

	ngOnInit(): void {
		if (!this.selectedLanguageId || !this.selectedLanguageType) {
			this.toast.add({ severity: "info", summary: "Info", detail: "No Data Found" })
			this.location.back()
		}
		this.init()
		this.checkLanguageQuizCompletedOrNot()
		this.checkplanExpire()
	}

	getFormattedValues(): string {
		return this.languageArrayGlobalService.getItems().join(" > ")
	}

	goToHome(event: any) {
		this.languageArrayGlobalService.removeItem(this.languageArrayGlobalService.getItems().length - 1)
		this.location.back()
	}

	init() {
		let req = {
			languageid: this.selectedLanguageId,
			languagetype: this.selectedLanguageType,
			perpage: this.perpage,
			page: this.page,
		}
		this.languageHubService.getCategoryList(req).subscribe(
			(_res) => {
				this.isSkeletonVisible = false
				this.totalQuestionCount = _res.count
				this.categoryList = _res.data
			},
			(error) => {
				// Handle error
				this.location.back()
				this.toast.add({ severity: "info", summary: "Info", detail: "No Data Found" })
				console.error("Error:", error)
			}
		)
	}

	onCategoryClick(categoryId: any, submoduleName: any) {
		this.languageArrayGlobalService.addItem(submoduleName)
		this.storage.set("selectedSubmoduleName", submoduleName)
		this.router.navigate([`/pages/language-hub/question-list/${categoryId}`])
	}

	checkLanguageQuizCompletedOrNot() {
		var data = {
			moduleid: 9,
			languageId: this.selectedLanguageId,
			languagetype: this.selectedLanguageType,
		}
		this.languageHubService.checklanguageQuizCompletion(data).subscribe((res) => {
			this.quizpercentage = res.progress
		})
	}

	startQuiz() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.storage.set("languagetypeidforquiz", this.selectedLanguageType)
		this.storage.set("languageidforquiz", this.selectedLanguageId)
		this.currentModuleSlug = "language-hub"
		this.router.navigate([`/pages/modules/${this.currentModuleSlug}/languagehubquiz`])
	}

	paginatePost(event: any) {
		this.page = event.page + 1
		this.perpage = event.rows
		this.init()
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("language-hub")
	}

	checkplanExpire(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
	}
}
