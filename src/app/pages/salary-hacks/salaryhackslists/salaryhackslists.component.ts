import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common" // Import CommonModule
import { Location } from "@angular/common"
import { MenuItem, MessageService } from "primeng/api"
import { ActivatedRoute, Router } from "@angular/router"
import { PageFacadeService } from "../../page-facade.service"
import { AuthService } from "src/app/Auth/auth.service"
import { Meta } from "@angular/platform-browser"
import { SalaryHacksService } from "../salaryhacks.service"
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
import { DataService } from "src/app/data.service";
import { SkeletonModule } from "primeng/skeleton";
@Component({
	selector: "uni-salaryhackslists",
	templateUrl: "./salaryhackslists.component.html",
	styleUrls: ["./salaryhackslists.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule],
	providers: [MessageService]
})
export class SalaryhacksListsComponent {
	isSkeletonVisible: boolean = true;
	isQuestionAnswerVisible: boolean = false;
	planExpired: boolean = false;
	page: number = 1;
	perpage: number = 50;
	totalDataCount: any = 0;
	ListData: any = [];
	selectedQuestionData: any;
	@Input() prepData: any;
	@Output() windowChange = new EventEmitter();
	loopRange = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => index);
	constructor(
		private location: Location,
		private route: ActivatedRoute,
		private toast: MessageService,
		private router: Router,
		private pageFacade: PageFacadeService,
		private authService: AuthService,
		private meta: Meta,
		private service: SalaryHacksService,
		private dataService: DataService,
	) { }
	ngOnInit(): void {
		this.gethackList();
		this.checkPlanExpiry();
	}
	onShowModal(value: any) {
		let socialShare: any = document.getElementById("socialSharingList");
		socialShare.style.display = "none";
	}
	module_id: any;
	gethackList() {
		this.service
			.getSalaryegotitationhacks({
				country_id: this.prepData.country_id,
				page: this.page,
				perpage: this.perpage,
			})
			.subscribe((response: any) => {
				this.ListData = response.data;
				this.module_id = response.module_id;
				this.totalDataCount = response.totalcount;
				this.isSkeletonVisible = false;
			});
	}
	goToHome(event: any) {
		this.isQuestionAnswerVisible = false;
	}
	backtoMain() {
		this.windowChange.emit({ stage: 1 });
	}
	paginate(event: any) {
		this.page = event.page + 1;
		this.perpage = event.rows;
		this.gethackList();
	}

	ngOnChanges() {
		if (this.prepData?.country_id) {
			this.gethackList()
		}
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

	shareViaWhatsapp() {
		let url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`
		window.open(shareUrl, "_blank")
	}

	shareViaInstagram() {
		let url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`
		window.open(shareUrl, "_blank")
	}

	shareViaFacebook() {
		let url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
		window.open(shareUrl, "_blank")
	}

	shareViaLinkedIn() {
		let url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`
		window.open(shareUrl, "_blank")
	}

	shareViaTwitter() {
		let url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
		window.open(shareUrl, "_blank")
	}

	shareViaMail() {
		let url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = `mailto:?body=${encodeURIComponent(url)}`
		window.open(shareUrl, "_blank")
	}

	copyLink() {
		const textarea = document.createElement("textarea")
		const safeUrl = encodeURI(window.location.href)
		const selectedQuestionId = this.selectedQuestionData?.id || ""
		textarea.textContent = `${safeUrl}/${selectedQuestionId}`
		document.body.append(textarea)
		textarea.select()
		document.execCommand("copy")
		textarea.remove()
		this.toast.add({
			severity: "success",
			summary: "Success",
			detail: "Question Copied",
		})
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
		let data: any = {
			isVisible: true,
			moduleId: this.module_id,
			questionId: this.selectedQuestionData?.id,
			countryId: this.selectedQuestionData.country_id,
		};
		this.dataService.openReportWindow(data);
	}
}