import { Component, OnInit } from "@angular/core"
import { FormGroup } from "@angular/forms"
import { FounderstoolService } from "../founderstool.service"
import { Router } from "@angular/router"
import { businessAdvisor } from "./business-advisor.data"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
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
import { PageFacadeService } from '../../page-facade.service';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SkeletonModule } from "primeng/skeleton"
import { SharedModule } from "src/app/shared/shared.module"
@Component({
	selector: "uni-ai-business-advisor",
	templateUrl: "./ai-business-advisor.component.html",
	styleUrls: ["./ai-business-advisor.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule],
})
export class AiBusinessAdvisorComponent implements OnInit {
	strategyBusinessList: any = businessAdvisor.strategies
	industryList: { Industry: string }[] = businessAdvisor.Industry
	businessGoalsList: { goal: string }[] = businessAdvisor.businessGoals
	challengeList: { challenge: string }[] = businessAdvisor.challenges
	targetAudienceList: { audience: string }[] = businessAdvisor.targetAudience
	budgetList: { goal: string }[] = businessAdvisor.budgetGoals
	durationList: { duration: string }[] = businessAdvisor.timeDuration

	recommadationSavedQuestionList: any = []
	recommendations: { id: number; question: string }[] = [
		{ id: 1, question: "What industry are you operating in?" },
		{ id: 2, question: "What are your primary business goals for the specified duration?" },
		{ id: 3, question: "What is the duration in which you want to achieve your goals?" },
		{ id: 4, question: "What challenges your business is currently facing?" },
		{ id: 5, question: "Who is your target audience?" },
		{ id: 6, question: "What is your budget for business goals?" },
		{ id: 7, question: "What is the overall strategy you want to align with?" },
	]
	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	recommendationData: SafeHtml
	activePageIndex: number = 0
	form: FormGroup
	inValidClass: boolean = false
	selectedData: { [key: string]: any } = {}
	enableModule: boolean = false
	isFromSavedData: boolean = false
	currencyList: any = []
	isResponseSkeleton: boolean = false;
	aiCreditCount:  number = 0;
	userInputs: any;

	constructor( private foundersToolService: FounderstoolService, private router: Router, private toast: MessageService, private sanitizer: DomSanitizer, private promptService: PromptService,private pageFacade: PageFacadeService) {}

	ngOnInit(): void {
		this.getCurrenyandLocation()
		this.getAICreditCount();
	}
	getAICreditCount(){
		this.promptService.getAicredits().subscribe({
		  next: resp =>{
			this.aiCreditCount = resp;
		  }
		})
	}
	getCurrenyandLocation() {
		this.foundersToolService.getCurrenciesList().subscribe((res: any) => {
			this.currencyList = res
		})
	}

	previous(): void {
		this.inValidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(productId: number): void {
		this.inValidClass = false
		if (productId in this.selectedData) {
			if (productId == 6) {
				if (this.selectedData[6].toString()?.length > 8) {
					this.inValidClass = true
					return
				}
				if(!this.selectedData[8]){
					this.inValidClass = true
					return;
				}
			}
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++
			}
		} else {
			this.inValidClass = true
		}
	}

	getRecommendation(productId: number) {
		this.inValidClass = false
		if (!(productId in this.selectedData)) {
			this.inValidClass = true
			return
		}
		let data: any = {
			type: this.selectedData[1],
			goals: this.selectedData[2],
			duration: this.selectedData[3],
			challenges: this.selectedData[4],
			customers: this.selectedData[5],
			budget: this.selectedData[6],
			strategy: this.selectedData[7],
			currency: this.selectedData[8],
			mode: "business_advisor",
		}
		this.userInputs = data;
		this.isRecommendationQuestion = false
		this.isRecommendationSavedData = false
		this.isRecommendationData = true
		this.isResponseSkeleton = true;
		this.foundersToolService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isResponseSkeleton = false;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response)
				this.getAICreditCount();
			},
			error: (error) => {
				this.isResponseSkeleton = false;
				this.isRecommendationData = false
			},
		})
	}

	resetRecommendation() {
		this.activePageIndex = 0
		this.selectedData = { 3: 1 }
		this.isRecommendationQuestion = true
		this.isRecommendationData = false
		this.isRecommendationSavedData = false
		this.isFromSavedData = false
	}

	saveRecommadation() {
		if (!this.isFromSavedData) {
			this.foundersToolService.getAnalysisList("business_advisor").subscribe({
				next: (response) => {
					this.isRecommendationQuestion = false
					this.isRecommendationData = false
					this.isRecommendationSavedData = true
					this.recommadationSavedQuestionList = response.data
				},
				error: (error) => {},
			})
		}
	}

	showRecommandationData(data: string, userInputs: any) {
		this.isRecommendationQuestion = false
		this.isRecommendationData = true
		this.isRecommendationSavedData = false
		this.isFromSavedData = true
		this.recommendationData = data

		const encodedJson = userInputs;
		const decodedInput = JSON.parse(encodedJson);
		this.userInputs = decodedInput;
	}

	goBack() {
		this.router.navigateByUrl("/pages/founderstool")
	}

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		let addingInput: string = '';
		this.recommendations.forEach((item) => {
			addingInput += `<p style="color: #3f4c83;"><strong>${item.question}</strong></p>`
			let currentAnswer = ""
			if(item.id == 1){
				currentAnswer = this.userInputs.type
			}
			else if(item.id == 2){
				currentAnswer = this.userInputs.goals
			}
			else if(item.id == 3){
				currentAnswer = `${this.userInputs.duration} Months`
			}
			else if(item.id == 4){
				currentAnswer = this.userInputs.challenges
			}
			else if(item.id == 5){
				currentAnswer = this.userInputs.customers
			}
			else if(item.id == 6){
				currentAnswer = this.userInputs.currency +' '+this.userInputs.budget
			}
			else if(item.id == 7){
				currentAnswer = this.userInputs.strategy
			}
			else if(item.id == 8){
				currentAnswer = this.userInputs.currency
			}
			else {
				currentAnswer = "No answer provided"
			}

			// if (this.selectedData && this.selectedData[item.id]) {
			// 	if (item.id == 6) {
			// 		currentAnswer = this.selectedData[8] + " " + this.selectedData[item.id]
			// 	} else if (item.id == 3) {
			// 		currentAnswer = `${this.selectedData[item.id]} Months`
			// 	} else {
			// 		currentAnswer = this.selectedData[item.id]
			// 	}
			// } else {
			// 	currentAnswer = "No answer provided"
			// }
			addingInput += `<p>${currentAnswer}</p><br>`
		})
		let params: any = {
			module_name: "AI Business Advisor",
			file_name: "ai_business_advisor",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink);
	}
}
