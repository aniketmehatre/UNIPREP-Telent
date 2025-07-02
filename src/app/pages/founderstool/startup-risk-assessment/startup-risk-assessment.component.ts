import { Component, OnInit } from "@angular/core"
import { FormGroup, FormBuilder } from "@angular/forms"
import { FounderstoolService } from "../founderstool.service"
import { Router } from "@angular/router"
import { riskAssessment } from "./risk-assessment.data"
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
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SkeletonModule } from "primeng/skeleton"
import { SharedModule } from "src/app/shared/shared.module"
import { PageFacadeService } from '../../page-facade.service';
import { AuthService } from "src/app/Auth/auth.service"
import { removeExtraResponse } from "../../prompt"
interface DropDown {
	[key: string]: string
}

@Component({
	selector: "uni-startup-risk-assessment",
	templateUrl: "./startup-risk-assessment.component.html",
	styleUrls: ["./startup-risk-assessment.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule],
})
export class StartupRiskAssessmentComponent implements OnInit {
	recommendations: { id: number; question: string }[] = [
		{ id: 1, question: "What industry is your business operating in?" },
		{ id: 2, question: "What is the business model for your company?" },
		{ id: 3, question: "What stage is your startup currently in?" },
		{ id: 4, question: "What key risks has your startup identified?" },
		{ id: 5, question: "What is the current financial status of your startup?" },
		{ id: 6, question: "How competitive is the market for your business?" },
		{ id: 7, question: "Who is your target audience?" },
		{ id: 8, question: "How is your allocated budget for different areas of your business?" },
		{ id: 9, question: "What is the geographical focus of your startup?" },
	]
	businessModelList: DropDown[] = riskAssessment.businessModel
	startupStageList: DropDown[] = riskAssessment.startupStage
	financialStatusList: DropDown[] = riskAssessment.financialSituation
	competitiveMarketList: DropDown[] = riskAssessment.marketCompetition
	targetAudienceList: DropDown[] = riskAssessment.targetAudience
	keyRisksList: DropDown[] = riskAssessment.keyRisks
	budgetAllocationList: DropDown[] = riskAssessment.budgetAllocation
	geographicalList: DropDown[] = riskAssessment.geographicalFocus
	industryList: DropDown[] = riskAssessment.Industry

	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	recommadationSavedQuestionList: any = []
	recommendationData: SafeHtml
	activePageIndex: number = 0
	form: FormGroup
	inValidClass: boolean = false
	selectedData: { [key: string]: any } = {}
	enableModule: boolean = false
	isFromSavedData: boolean = false
	currencyList: any = []
	isResponseSkeleton: boolean = false;
	
	userInputs: any;

	constructor(private fb: FormBuilder, private founderToolService: FounderstoolService, private router: Router,
		private toast: MessageService, private sanitizer: DomSanitizer, private promptService: PromptService,
		private pageFacade: PageFacadeService, private authService: AuthService) { }

	ngOnInit(): void {
		this.getCurrenyandLocation()
		// this.getStartUpRiskAssesmentOptionsList();
		
	}

	

	getCurrenyandLocation() {
		this.founderToolService.getCurrenciesList().subscribe((res: any) => {
			this.currencyList = res
		})
	}

	// getStartUpRiskAssesmentOptionsList() {
	//   this.founderToolService.getStartUpRiskAssesmentOptionsList().subscribe((res: any) => {
	//     console.log(res);
	//     this.competitiveMarketList = res?.competitive;
	//     this.financialStatusList = res?.financialstatus;
	//     this.businessModelList = res?.models;
	//     this.startupStageList = res?.stages;
	//   });
	// }

	previous(): void {
		this.inValidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(productId: number): void {
		if (this.authService.isInvalidSubscription('founders_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.inValidClass = false
		if (productId in this.selectedData) {
			if (productId == 8) {
				if (!this.selectedData[10]) {
					this.inValidClass = true
					return;
				}
				if (this.selectedData[8].toString()?.length > 8) {
					this.inValidClass = true
					return
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
		if(this.authService._creditCount === 0){
			this.toast.add({severity: "error",summary: "Error",detail: "Please Buy some Credits...!"});
			this.router.navigateByUrl('/pages/export-credit')
			return;
		}
		this.recommendationData = "";
		this.inValidClass = false
		if (!(productId in this.selectedData)) {
			this.inValidClass = true
			return
		}
		
		let data: any = {
			type: this.selectedData[1],
			model: this.selectedData[2],
			stage: this.selectedData[3],
			risks: this.selectedData[4],
			financial_status: this.selectedData[5],
			competitive_market: this.selectedData[6],
			customers: this.selectedData[7],
			budget: this.selectedData[8],
			geographical_focus: this.selectedData[9],
			currency: this.selectedData[10],
			mode: "startup_risk_assessment",
		}
		this.userInputs = data;
		this.isRecommendationQuestion = false
		this.isRecommendationSavedData = false
		this.isRecommendationData = true
		this.isResponseSkeleton = true;
		this.founderToolService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isResponseSkeleton = false;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response)
				this.authService.aiCreditCount$.next(true);
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
		if (this.authService.isInvalidSubscription('founders_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		if (!this.isFromSavedData) {
			this.founderToolService.getAnalysisList("startup_risk_assessment").subscribe({
				next: (response) => {
					this.isRecommendationQuestion = false
					this.isRecommendationData = false
					this.isRecommendationSavedData = true
					this.recommadationSavedQuestionList = response.data
				},
				error: (error) => { },
			})
		}
	}

	showRecommandationData(data: string, userInputs: any) {
		this.isRecommendationQuestion = false
		this.isRecommendationData = true
		this.isRecommendationSavedData = false
		this.isFromSavedData = true
		// this.recommendationData = data;
		this.recommendationData = removeExtraResponse(data);
		const encodedJson = userInputs;
		const decodedInput = JSON.parse(encodedJson);
		this.userInputs = decodedInput;
	}

	goBack() {
		this.router.navigateByUrl("/pages/founderstool/founderstoollist")
	}

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		let addingInput: string = '';
		this.recommendations.forEach((item) => {
			addingInput += `<p style="color: #3f4c83;"><strong>${item.question}</strong></p>`
			let currentAnswer = "";
			// if (this.selectedData && this.selectedData[item.id]) {
			if (item.id == 1) {
				currentAnswer = this.userInputs.type
			}
			else if (item.id == 2) {
				currentAnswer = this.userInputs.model
			}
			else if (item.id == 3) {
				currentAnswer = this.userInputs.stage
			}
			else if (item.id == 4) {
				currentAnswer = this.userInputs.risks
			}
			else if (item.id == 5) {
				currentAnswer = this.userInputs.financial_status
			}
			else if (item.id == 6) {
				currentAnswer = this.userInputs.competitive_market
			}
			else if (item.id == 7) {
				currentAnswer = this.userInputs.customers
			}
			else if (item.id == 8) {
				currentAnswer = this.userInputs.currency + ' ' + this.userInputs.budget
			}
			else if (item.id == 9) {
				currentAnswer = this.userInputs.geographical_focus
			}
			// } else {
			// 	currentAnswer = "No answer provided"
			// }
			addingInput += `<p>${currentAnswer}</p><br>`
		});
		let params: any = {
			module_name: "Startup Risk Assessment",
			file_name: "startup_risk_assessment",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("startup-risk-assessment");
	}
}
