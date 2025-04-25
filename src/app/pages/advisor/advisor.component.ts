import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core"
import { AdvisorService } from "./advisor.service"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { PageFacadeService } from "../page-facade.service"
import { AuthService } from "src/app/Auth/auth.service"
import { LocationService } from "src/app/location.service"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { TextareaModule } from "primeng/textarea"
import { ButtonModule } from "primeng/button"
import { SkeletonModule } from "primeng/skeleton"
import { CarouselModule } from "primeng/carousel"
@Component({
	selector: "uni-advisor",
	templateUrl: "./advisor.component.html",
	styleUrls: ["./advisor.component.scss"],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, FormsModule, ReactiveFormsModule, InputTextModule, InputGroupModule, InputGroupAddonModule, TextareaModule, ButtonModule, SkeletonModule, CarouselModule],
})
export class AdvisorComponent implements OnInit {
	@ViewChild("chatContainer") private chatContainer: ElementRef

	isQuestionAsked: boolean = false
	isQuestionNotAsked: boolean = true
	questions: any
	userQuestion: string = ""
	question: any
	answer: any
	chatdata: any[] = []
	showSkeleton: boolean = false
	responseType: string
	askExpertResponse: number = 0
	requestButton: string
	smallquestion: boolean = true
	responsiveOptions: any[] = []

	constructor(private service: AdvisorService, private ngxService: NgxUiLoaderService, private route: ActivatedRoute, private pageFacade: PageFacadeService, private authService: AuthService, private locationService: LocationService, private router: Router, private messageService: MessageService) { }

	ngOnInit() {
		this.questions = [
			{ question: "Must visit places in Milan.", icons: "fa-earth-americas" },
			{ question: "Top 10 fully funded scholarships for international students in the UK.", icons: "fa-diploma" },
			{ question: "Step-by-step guide to starting a business in France", icons: "fa-briefcase" },
			{ question: "High-paying job opportunities for finance graduates in the US.", icons: "fa-coins" },
			{ question: "Oxford University admission criteria for international students", icons: "fa-university" },
			{ question: "Number of Public holidays for full-time staff in the UK", icons: "fa-calendar" },
			{ question: "Document checklist required for Spain travel visa application", icons: "fa-folder" },
			{ question: "Top 10 in-demand jobs in the healthcare industry", icons: "fa-hospital" },
			{ question: "Top 20 government funding opportunities for startups in the UK", icons: "fa-rocket" },
		]
		this.responsiveOptions = [
			{
				breakpoint: "1199px",
				numVisible: 3,
				numScroll: 1,
			},
			{
				breakpoint: "991px",
				numVisible: 2,
				numScroll: 1,
			},
			{
				breakpoint: "767px",
				numVisible: 1,
				numScroll: 1,
			},
		]
		this.responseType = "Ask AI Advisor"
		this.requestButton = "Ask an Expert!"
		this.lengthCheck()
	}
	pquestion: any | null

	lengthCheck() {
		if (!this.userQuestion || this.userQuestion.trim().length < 3) {
			this.smallquestion = true
		} else {
			this.smallquestion = false
		}
	}

	scrollToLastChat() {
		setTimeout(() => {
			if (this.chatdata.length > 0) {
				const lastChatId = `chat-${this.chatdata.length - 2}`
				const lastChatElement = document.getElementById(lastChatId)
				if (lastChatElement) {
					lastChatElement.scrollIntoView({ behavior: "smooth", block: "start" })
				}
			}
		}, 300)
	}

	getChatHistory() {
		if (this.authService.isInvalidSubscription('ai_global_advisor')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.isQuestionAsked = true
		this.showSkeleton = true
		this.isQuestionNotAsked = false
		this.service.getChatHistory().subscribe((response) => {
			this.showSkeleton = false
			this.chatdata = response
			this.ngxService.stopBackground()
			this.userQuestion = ""
			this.scrollToLastChat()
		})
	}

	getAns() {
		if (this.authService.isInvalidSubscription('ai_global_advisor')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		if (this.userQuestion && this.userQuestion.trim() === "") {
			return;
		}
		if (!this.smallquestion) {
			if (this.askExpertResponse == 0) {
				this.isQuestionAsked = true
				this.showSkeleton = true
				this.isQuestionNotAsked = false
				this.ngxService.startBackground()
				var data = {
					question: this.userQuestion,
				}
				this.service.getAnswer(data).subscribe((response) => {
					this.showSkeleton = false
					this.chatdata = response
					this.ngxService.stopBackground()
					this.userQuestion = ""
					this.scrollToLastChat()
				})
			} else {
				this.isQuestionAsked = true
				this.showSkeleton = true
				this.isQuestionNotAsked = false

				this.ngxService.startBackground()
				var data = {
					question: this.userQuestion,
				}
				this.service.getTeamAnswer(data).subscribe((response) => {
					this.showSkeleton = false
					this.chatdata = response
					this.ngxService.stopBackground()
					this.userQuestion = ""
					this.scrollToLastChat()
					// alert("Thank you , Our team will get back to you in next 8 working hours");
					this.messageService.add({ severity: "success", summary: "Success", detail: "Thank you , Our team will get back to you in next 8 working hours" })
				})
			}
		}
		// this.isQuestionEmpty = true;
	}

	triggerSample(sample: any) {
		this.userQuestion = sample
		this.smallquestion = false
	}

	askExpert() {
		this.smallquestion = true
		// if (this.userQuestion && this.userQuestion.trim() === '') {
		//   return
		// }

		if (this.askExpertResponse == 0) {
			this.responseType = " Ask Expert"
			this.requestButton = "Ask AI Advisor"
			this.askExpertResponse = 1
		} else {
			this.responseType = " Ask AI Advisor"
			this.requestButton = "Ask Expert"
			this.askExpertResponse = 0
		}
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}

}
