import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"
import { GetAcademicListPayload } from "src/app/@Models/academic-tools.model"
import { AcademicService } from "../academic.service"
import { CategoryResponse } from "src/app/@Models/career-tool-category.model"
import { AuthService } from "src/app/Auth/auth.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { TooltipModule } from "primeng/tooltip"
import { SkeletonModule } from "primeng/skeleton";
import { RestrictionDialogComponent } from "src/app/shared/restriction-dialog/restriction-dialog.component"
@Component({
	selector: "uni-academic-tools-stream",
	templateUrl: "./academic-tools-stream.component.html",
	styleUrls: ["./academic-tools-stream.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, TooltipModule, SkeletonModule, RestrictionDialogComponent],
})
export class AcademicToolsStreamComponent implements OnInit {
	modulesList: any[] = []
	moduleId: string = "15"
	isSkeletonVisible: boolean = false
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index)
	currentModuleName: string = ""
	tooltip: string = ""
	submoduleId: string = ""
	planExpired: boolean = false
	restrict: boolean = false
	ehitlabelIsShow: boolean = true
	orgnamewhitlabel: any
	orglogowhitelabel: any
	imagewhitlabeldomainname: any
	constructor(private activatedRoute: ActivatedRoute, private location: Location, private router: Router, private academicService: AcademicService, private route: Router, private authService: AuthService) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((response) => {
			this.submoduleId = response["id"]
			this.getList()
			this.getAcademicToolList()
			this.checkplanExpire()
			this.imagewhitlabeldomainname = window.location.hostname
			if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
				this.ehitlabelIsShow = true
			} else {
				this.ehitlabelIsShow = false
			}
		})
	}
	navigateToQuiz(moduleId: number, academicCategoryId: number): void {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		// Navigate to the quiz route
		console.log(moduleId)
		this.router.navigate(["quiz/", moduleId, academicCategoryId], { relativeTo: this.activatedRoute })
	}
	getList() {
		const params: GetAcademicListPayload = {
			module_id: this.moduleId,
			category_id: this.submoduleId,
		}
		this.academicService.getAcadamicSubModuleList(params).subscribe((res) => {
			this.modulesList = res.data
		})
	}
	goBack() {
		if (window.history.length > 1) {
			this.location.back()
		} else {
			this.router.navigate(["/pages/modules/academic-tools"])
		}
	}

	actionedrouteData: any = []
	redirectTo(path: any) {
		if (path == "academic-tools") {
			this.route.navigate(["pages/modules/" + path])
		}
		if (path === "dashboard") {
			this.route.navigate(["pages/" + path])
		}
	}
	getAcademicToolList() {
		let req: { module_id: string } = {
			module_id: this.moduleId,
		}
		this.academicService.getAcademicToolList(req).subscribe((response: CategoryResponse) => {
			this.currentModuleName = response.data?.find((category) => category.id === Number(this.submoduleId))?.category as string
		})
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
