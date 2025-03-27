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

interface selectList {
	name: string
}
@Component({
	selector: "uni-start-up-expense-estimate",
	templateUrl: "./start-up-expense-estimate.component.html",
	styleUrls: ["./start-up-expense-estimate.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SelectModule],
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
	planExpired!: boolean
	recommendRestrict: boolean = false
	marketingForm: FormGroup = new FormGroup({})
	restrict: boolean = false
	currentPlan: string = ""
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orglogowhitelabel: any
	orgnamewhitlabel: any
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
	constructor(private fb: FormBuilder, private foundersToolsService: FounderstoolService, private locationService: LocationService, private toast: MessageService, private authService: AuthService, private router: Router, private travelToolService: TravelToolsService, private pageFacade: PageFacadeService, private costOfLiving: CostOfLivingService, private sanitizer: DomSanitizer) {
		this.marketingForm = this.fb.group({
			industry: ["", Validators.required],
			location: ["", Validators.required],
			locationFilterString: [""],
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
		this.locationService.getImage().subscribe((imageUrl) => {
			this.orglogowhitelabel = imageUrl
		})
		this.locationService.getOrgName().subscribe((orgname) => {
			this.orgnamewhitlabel = orgname
		})
		this.imagewhitlabeldomainname = window.location.hostname
		if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
			this.ehitlabelIsShow = true
		} else {
			this.ehitlabelIsShow = false
		}
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

	customFilterFunction(type: string) {
		if (type === "departure") {
			let locationFilterString = this.marketingForm.value.locationFilterString
			if (locationFilterString === "") {
				this.departureLocationList = this.locationsList
				return
			}
			this.departureLocationList = this.locationsList.filter((city: any) => city?.city_name?.toLowerCase().includes(locationFilterString.toLowerCase()) || city?.country_name?.toLowerCase().includes(locationFilterString.toLowerCase()))
		}
	}

	checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			let data = res.time_left
			let subscription_exists_status = res.subscription_details
			this.currentPlan = subscription_exists_status?.subscription_plan
			if (data.plan === "expired" || data.plan === "subscription_expired" || subscription_exists_status?.subscription_plan === "free_trail") {
				this.planExpired = true
			} else {
				this.planExpired = false
			}
			if (data.plan === "expired" || data.plan === "subscription_expired") {
				this.recommendRestrict = true
			} else {
				this.recommendRestrict = false
			}
		})
	}

	upgradePlan(): void {
		this.router.navigate(["/pages/subscriptions"])
	}
	clearRestriction() {
		this.restrict = false
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
		this.submitted = false
		const formData = this.marketingForm.value
		if (this.activePageIndex == 2) {
			if (!formData.budget || !formData.expense_estimation) {
				this.submitted = true
				return
			}
		}
		if (this.recommendRestrict) {
			this.restrict = true
			return
		}
		let data: any = {
			...this.marketingForm.value,
			mode: "startup_expense_estimator",
			location: formData.location.city_name + ", " + formData.location.country_name,
		}
		this.foundersToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isRecommendationQuestion = false
				this.isRecommendationData = true
				this.isRecommendationSavedData = false
				// this.recommendationData = response.response;
				let chatGptResponse = response.response
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, "")
					.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
					.replace(/\(see https:\/\/angular\.dev\/best-practices\/security#preventing-cross-site-scripting-xss\)/g, "")
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse)
			},
			error: (error) => {
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
		if (!this.isFromSavedData) {
			this.foundersToolsService.getAnalysisList("startup_expense_estimator").subscribe({
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

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		const formValue = ["industry", "location", "startup_stage", "team_size", "current_investment", "revenue_model", "primary_expense", "operating_expense", "budget", "expense_estimation"]
		const formData = this.marketingForm.value
		let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Startup Expense Estimator</h2>
				</div>
			</div><p><strong>Input:<br></strong></p>`

		// Keep track of which formValue index we're currently using
		let formValueIndex = 0
		this.recommendations.forEach((category: any) => {
			addingInput += `<p><strong>${category.question.heading}</strong></p>`

			category.question.branches.forEach((branchQuestion: any) => {
				addingInput += `<p style="color: #d32f2f;"><strong>${branchQuestion}</strong></p>`

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
				addingInput += `<p>${currentAnswer}</p>`

				formValueIndex++
			})

			addingInput += `<br>`
		})

		let finalRecommendation = addingInput + '<div class="divider"></div><p><strong>Response:<br></strong></p>' + this.recommendationData
		finalRecommendation = finalRecommendation
			.replace(/```html|```/g, "")
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, "")
			.replace(/SafeValue must use \[property\]=binding:/g, "")
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\(see https:\/\/angular\.dev\/best-practices\/security#preventing-cross-site-scripting-xss\)/g, "")
			.replace(/class="container"/g, 'style="line-height:1.9"') //because if i add container the margin will increase so i removed the container now the spacing is proper.
		let paramData: DownloadRespose = {
			response: finalRecommendation,
			module_name: "Startup Expenses Estimate",
			file_name: "startup_expense_estimate",
		}
		this.travelToolService
			.convertHTMLtoPDF(paramData)
			.then(() => {
				console.log("PDF successfully generated.")
			})
			.catch((error) => {
				console.error("Error generating PDF:", error)
			})
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

	resetFunction(departure: string) {}
}
