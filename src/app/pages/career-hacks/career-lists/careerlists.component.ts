import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { Location } from "@angular/common"
import { MenuItem, MessageService } from "primeng/api"
import { ActivatedRoute, Router } from "@angular/router"
import { PageFacadeService } from "../../page-facade.service"
import { AuthService } from "src/app/Auth/auth.service"
import { Meta } from "@angular/platform-browser"
import { CareerJobHacksService } from "../careerhacks.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { DataService } from "src/app/data.service"
import { SkeletonModule } from "primeng/skeleton"
import { SocialShareService } from "src/app/shared/social-share.service"

@Component({
	selector: "uni-careerhackslists",
	templateUrl: "./careerlists.component.html",
	styleUrls: ["./careerlists.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, SkeletonModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
	providers: [DataService],
})
export class CareerListsComponent implements OnInit {
	isSkeletonVisible: boolean = true
	isQuestionAnswerVisible: boolean = false
	planExpired: boolean = false
	page: number = 1
	perpage: number = 50
	totalDataCount: any = 0
	ListData: any = []
	selectedQuestionData: any
	@Input() prepData: any
	@Output() windowChange = new EventEmitter()
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index)
	constructor(private pageFacade: PageFacadeService, private authService: AuthService, private meta: Meta,
		private service: CareerJobHacksService, private dataService: DataService, private socialShareService: SocialShareService) { }

	ngOnInit(): void {
		this.gethackList()
		this.checkPlanExpiry()
	}
	onShowModal(value: any) {
		let socialShare: any = document.getElementById("socialSharingList")
		socialShare.style.display = "none"
	}
	module_id: any
	gethackList() {
		this.service
			.getcareerjobhacks({
				country_id: this.prepData.country_id,
				page: this.page,
				perpage: this.perpage,
			})
			.subscribe((response: any) => {
				this.ListData = response.data
				this.module_id = response.module_id
				this.totalDataCount = response.totalcount
				this.isSkeletonVisible = false
			})
	}
	goToHome(event: any) {
		this.isQuestionAnswerVisible = false
	}
	backtoMain() {
		this.windowChange.emit({ stage: 1 })
	}
	paginate(event: any) {
		this.page = event.page + 1
		this.perpage = event.rows
		this.gethackList()
	}

	checkPlanExpiry(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
	selectedQuestion = ""
	selectedAnswer: any
	customizedResponse: any
	selectedQuestionId: any
	readAnswer(quizdata: any) {
		this.selectedQuestion = quizdata?.ques
		this.selectedAnswer = quizdata?.ans
		this.selectedQuestionId = quizdata?.id
		this.prepData.questionid = quizdata?.id
	}

	showSocialSharingList() {
		let socialShare: any = document.getElementById("socialSharingList")
		if (socialShare.style.display == "") {
			socialShare.style.display = "block"
		} else {
			socialShare.style.display = socialShare.style.display == "none" ? "block" : "none"
		}
	}

	shareQuestion(type: string) {
		const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
		const url = encodeURI(window.location.origin + '/pages/career-hacks/' + this.selectedQuestionData?.id);
		this.meta.updateTag({ property: 'og:url', content: url });
		const shareUrl = socialMedias[type] + encodeURIComponent(url);
		window.open(shareUrl, '_blank');
	}

	copyLink() {
		const textToCopy = encodeURI(window.location.origin + '/pages/career-hacks/' + this.selectedQuestionData?.id);
		this.socialShareService.copyQuestion(textToCopy);
	}

	readSavedResponse(selectedData: any) {
		this.selectedQuestionData = selectedData
		this.isQuestionAnswerVisible = true
	}
	getContentPreview(content: string): string {
		const plainText = content.replace(/<[^>]*>/g, "")
		return plainText.length > 75 ? plainText.slice(0, 75) + " ..." : plainText
	}
	openReport() {
		const data = {
			isVisible: true,
			moduleId: this.module_id,
			questionId: this.selectedQuestionData?.id,
			countryId: this.selectedQuestionData.country_id,
		}
		this.dataService.openReportWindow(data);
	}

}
