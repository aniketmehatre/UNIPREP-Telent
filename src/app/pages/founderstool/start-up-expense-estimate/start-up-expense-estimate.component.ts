import { Component, OnInit } from "@angular/core"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MessageService } from "primeng/api"
import { AuthService } from "src/app/Auth/auth.service"
import { LocationService } from "src/app/location.service"
import { PageFacadeService } from "../../page-facade.service"
import { FounderstoolService } from "../founderstool.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { RouterModule } from "@angular/router"
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
import { startupDropdownData } from "./startup-expense.data"
import { TravelToolsService } from "../../travel-tools/travel-tools.service"
import { DownloadRespose } from "src/app/@Models/travel-tools.model"
import { CostOfLivingService } from "../../job-tool/cost-of-living/cost-of-living.service"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SkeletonModule } from "primeng/skeleton"
import { SharedModule } from "src/app/shared/shared.module"

interface selectList {
	name: string
}
@Component({
	selector: "uni-start-up-expense-estimate",
	templateUrl: "./start-up-expense-estimate.component.html",
	styleUrls: ["./start-up-expense-estimate.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SelectModule, SkeletonModule, SharedModule],
})
export class StartUpExpenseEstimateComponent implements OnInit {
	locationList: any[]
	industryList: { Industry: string }[] = startupDropdownData.Industry
	startupStageList: selectList[] = startupDropdownData["Startup Stage"]
	teamSizeList: selectList[] = startupDropdownData["Team Size"]
	primaryExpenseList: selectList[] = startupDropdownData["Key expenses"]
	revenueModelsList: selectList[] = startupDropdownData["Revenue Model"]
	captialInvestedList: selectList[] = startupDropdownData["Capital Investment"]
	expenseEstimation: selectList[] = startupDropdownData["Expense Estimation"]

	isFromSavedData: boolean = false
	recommadationSavedQuestionList: any = []
	page = 1
	pageSize = 25
	first: number = 0
	marketingForm: FormGroup = new FormGroup({})
	currentPlan: string = ""
	locationName: string = ""
	submitted: boolean = false
	data: any = {
		page: this.page,
		perpage: this.pageSize,
	}
	currenciesList: any
	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	recommendationData: SafeHtml
	departureFilter: string = ""
	locationsList: any = []
	departureLocationList: any = []
	isResponseSkeleton: boolean = false;
	

	constructor(private fb: FormBuilder, private foundersToolsService: FounderstoolService, private locationService: LocationService, private toast: MessageService, private authService: AuthService, private router: Router, private travelToolService: TravelToolsService, private pageFacade: PageFacadeService, private costOfLiving: CostOfLivingService, private sanitizer: DomSanitizer, private promptService: PromptService) {
		this.marketingForm = this.fb.group({
			industry: ["", Validators.required],
			location: [null, Validators.required],
			startup_stage: ["", Validators.required],
			team_size: ["", Validators.required],
			primary_expense: ["", Validators.required],
			current_investment: ["", Validators.required],
			revenue_model: ["", Validators.required],
			operating_expense: ["", Validators.required],
			budget: ["", Validators.required],
			expense_estimation: ["", Validators.required],
			investment_currency_code: [],
			expense_currency_code: [],
			sales_currency_code: [],
		})
		const marketingForm = this.marketingForm
		marketingForm.get("expense_currency_code")?.disable()
		marketingForm.get("sales_currency_code")?.disable()
		marketingForm.controls["investment_currency_code"].valueChanges.subscribe((value) => {
			if (value) {
				marketingForm.patchValue({
					expense_currency_code: value,
					sales_currency_code: value,
				})
			}
		})
	}

	enableModule: boolean = true
	activePageIndex: number = 0
	recommendations: any = [
		{
			id: 1,
			question: {
				heading: "Basic Information",
				branches: ["What industry is your startup in?", "Where is your startup located?", "What stage is your startup currently in?", "What is the size of your team?"],
			},
		},
		{
			id: 2,
			question: {
				heading: "Expense",
				branches: ["What are the main expense categories for your startup?", "What is the total amount you've invested in your startup?", "What is your revenue model ?", "What are your monthly operating expenses?"],
			},
		},
		{
			id: 3,
			question: {
				heading: "Analysis",
				branches: ["What is your monthly budget for sales and marketing?", "Over what time frame should the estimation be made?"],
			},
		},
	]
	invalidClass: boolean = false
	selectedData: { [key: string]: any } = {}

	ngOnInit(): void {
		this.getCurrenyandLocation()
		
	}
	
	goBack() {
		this.router.navigateByUrl("/pages/founderstool/founderstoollist")
	}

	getCurrenyandLocation() {
		this.foundersToolsService.getCurrenciesList().subscribe((res: any) => {
			this.currenciesList = res
		})
		this.costOfLiving.getCities().subscribe({
			next: (response) => {
				this.locationsList = response
				this.departureLocationList = response
			},
		})
	}

	openHowItWorksVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}

	checkUserRecommendation() {
		this.foundersToolsService.getRecommendations().subscribe((res) => {
			if (res.status) {
				this.enableModule = true
			} else {
				this.enableModule = false
				// this.addAnyValueToOptions();
			}
		})
	}

	getRecommendation() {
		if(this.authService._creditCount === 0){
			this.toast.add({severity: "error",summary: "Error",detail: "Please Buy some Credits...!"});
			this.router.navigateByUrl('/pages/export-credit')
			return;
		}
		this.recommendationData = "";
		this.submitted = false
		const formData = this.marketingForm.value
		if (this.activePageIndex == 2) {
			if (!formData.budget || !formData.expense_estimation) {
				this.submitted = true
				return
			}
		}
		let data: any = {
			...this.marketingForm.value,
			mode: "startup_expense_estimator",
			location: formData.location.city_name + ", " + formData.location.country_name,
		}
		this.isRecommendationQuestion = false
		this.isRecommendationSavedData = false
		this.isRecommendationData = true
		this.isResponseSkeleton = true;
		this.foundersToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isResponseSkeleton = false;
				// this.recommendationData = response.response;
				let chatGptResponse = response.response
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, "")
					.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
					.replace(/\(see https:\/\/angular\.dev\/best-practices\/security#preventing-cross-site-scripting-xss\)/g, "")
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse)
				this.authService.aiCreditCount$.next(true);
			},
			error: (error) => {
				this.isResponseSkeleton = false;
				this.isRecommendationData = false
			},
		})
	}

	previous(): void {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next() {
		if (this.authService.isInvalidSubscription('founders_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.submitted = false
		const formData = this.marketingForm.value
		if (this.activePageIndex == 0) {
			if (!formData.industry || !formData.location || !formData.startup_stage || !formData.team_size) {
				this.submitted = true
				return
			}
		}
		if (this.activePageIndex == 1) {
			if (!formData.current_investment || !formData.revenue_model || formData.revenue_model?.length == 0 || !formData.primary_expense || formData.primary_expense?.length == 0 || !formData.operating_expense) {
				this.submitted = true
				return
			}
		}
		if (this.activePageIndex == 2) {
			if (!formData.budget || !formData.expense_estimation) {
				this.submitted = true
				return
			}
		}
		this.activePageIndex++
	}

	saveRecommadation() {
		if (this.authService.isInvalidSubscription('founders_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		if (!this.isFromSavedData) {
			this.foundersToolsService.getAnalysisList("startup_expense_estimator").subscribe({
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

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		let addingInput: string = '';
		const formValue = ["industry", "location", "startup_stage", "team_size", "current_investment", "revenue_model", "primary_expense", "operating_expense", "budget", "expense_estimation"]
		const formData = this.marketingForm.value
		// Keep track of which formValue index we're currently using
		let formValueIndex = 0
		this.recommendations.forEach((category: any) => {
			addingInput += `<p><strong>${category.question.heading}</strong></p>`
			category.question.branches.forEach((branchQuestion: any) => {
				addingInput += `<p style="color: var(--p-primary-500);"><strong>${branchQuestion}</strong></p>`
				let currentAnswer = ""
				const currentFormField = formValue[formValueIndex]
				if (formData && formData[currentFormField]) {
					switch (currentFormField) {
						case "current_investment":
							currentAnswer = formData["investment_currency_code"] + " " + formData[currentFormField]
							break
						case "operating_expense":
							currentAnswer = formData["investment_currency_code"] + " " + formData[currentFormField]
							break
						case "budget":
							currentAnswer = formData["investment_currency_code"] + " " + formData[currentFormField]
							break
						case "location":
							currentAnswer = formData["location"].city_name + ", " + formData["location"].country_name
							break
						default:
							currentAnswer = formData[currentFormField]
							break
					}
				} else {
					currentAnswer = "No answer provided"
				}
				addingInput += `<p>${currentAnswer}</p><br>`
				formValueIndex++
			})
			addingInput += `<br>`
		});

		let params: any = {
			module_name: "Startup Expenses Estimate",
			file_name: "startup_expenses_estimate",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	showRecommandationData(data: string) {
		this.isRecommendationQuestion = false
		this.isRecommendationData = true
		this.isRecommendationSavedData = false
		this.isFromSavedData = true
		this.recommendationData = data
	}

	resetRecommendation() {
		this.foundersToolsService.resetRecommendation().subscribe((res) => {
			this.isRecommendationQuestion = true
			this.isRecommendationData = false
			this.isRecommendationSavedData = false
			this.marketingForm.reset()
			this.activePageIndex = 0
			this.isFromSavedData = false
		})
	}

}
