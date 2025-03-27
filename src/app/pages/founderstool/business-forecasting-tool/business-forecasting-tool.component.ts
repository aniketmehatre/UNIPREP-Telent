import { Component, OnInit } from "@angular/core"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { MessageService } from "primeng/api"
import { AuthService } from "src/app/Auth/auth.service"
import { LocationService } from "src/app/location.service"
import { PageFacadeService } from "../../page-facade.service"
import { FounderstoolService } from "../founderstool.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { businessForeCastData } from "./business-forcasting.data"
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
import { DownloadRespose } from "src/app/@Models/travel-tools.model"
import { TravelToolsService } from "../../travel-tools/travel-tools.service"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"

@Component({
	selector: "uni-business-forecasting-tool",
	templateUrl: "./business-forecasting-tool.component.html",
	styleUrls: ["./business-forecasting-tool.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
})
export class BusinessForecastingToolComponent implements OnInit {
	industryList: any[] = businessForeCastData.Industry
	locationList: any
	seasonsList: any[] = businessForeCastData.Seasons
	factorsList = businessForeCastData["Revenue Drivers"]
	targetAudienceList = businessForeCastData["Target Audience"]
	assumptionsList = businessForeCastData["Growth Assumption"]
	durationList = businessForeCastData["Forecast period"]
	goalsList = businessForeCastData["Revenue goals"]
	isFromSavedData: boolean = false
	recommadationSavedQuestionList: any = []
	page = 1
	pageSize = 25
	first: number = 0
	planExpired!: boolean
	recommendRestrict: boolean = false
	form: FormGroup = new FormGroup({})
	restrict: boolean = false
	currentPlan: string = ""
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orglogowhitelabel: any
	orgnamewhitlabel: any
	locationName: string = ""
	currencyList: any
	goalList: any
	submitted: boolean = false
	data: any = {
		page: this.page,
		perpage: this.pageSize,
	}
	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	recommendationData: SafeHtml
	isSessonEnable: boolean = false
	enableModule: boolean = true
	activePageIndex: number = 0
	recommendations: any = [
		{
			id: 1,
			question: {
				heading: "Basic Information",
				branches: ["What industry is your start up in?", "Does your business have seasonal functionalities?", "If yes, please specify the peak seasons", "What are the key revenue drivers for your business?"],
			},
		},
		{
			id: 2,
			question: {
				heading: "Marketing & Sales",
				branches: ["Who is your target audience?", "What are the key growth assumptions for your startup?"],
			},
		},
		{
			id: 3,
			question: {
				heading: "Analysis",
				branches: ["What is the preferred timeframe for this revenue forecast?", "What are your revenue goals for the forecast period?"],
			},
		},
	]
	invalidClass: boolean = false
	selectedData: { [key: string]: any } = {}
	constructor(private fb: FormBuilder, private foundersToolsService: FounderstoolService, private locationService: LocationService, private authService: AuthService, private router: Router, private pageFacade: PageFacadeService, private toast: MessageService, private travelToolService: TravelToolsService, private sanitizer: DomSanitizer) {
		this.form = this.fb.group({
			industry: ["", Validators.required],
			seasons: [[]],
			factors: [[], Validators.required],
			target_audience: [[], Validators.required],
			assumptions: [[], Validators.required],
			forecast_peroid: ["", Validators.required],
			goals: [[], Validators.required],
			seasonalfunctionality: [false],
			duration: ["", Validators.required],
		})
	}

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
		this.getForeCastingOptionLists()
		this.getCurrenyandLocation()
	}

	backtoMain() {
		this.router.navigateByUrl("/pages/founderstool")
	}

	getForeCastingOptionLists() {
		this.goalList = [{ value: "Enhance Customer Retention Revenue" }, { value: "Diversify Revenue Streams" }, { value: "Achieve Break-Even Point" }, { value: "Maximize Upselling & Cross-Selling" }, { value: "Optimize Pricing Strategy for Higher Revenue" }, { value: "Expand into New Markets for Revenue Growth" }, { value: "Improve Sales Conversion Rates" }, { value: "Increase Revenue per Employee" }, { value: "Achieve Specific Quarterly/Annual Revenue Targets" }, { value: "Drive More Revenue from Subscription Models" }, { value: "Monetize New Products/Services" }, { value: "Reduce Revenue Leakage" }, { value: "Achieve Sustainable Year-over-Year Growth" }]
		// this.foundersToolsService.getmarketingAnaylsisOptionsList().subscribe((res: any) => {
		// console.log(res);
		// this.seasonsList = res?.seasons;
		// this.factorsList = res?.competitor;
		// this.targetAudienceList = res?.market;
		// this.assumptionsList = res?.models;
		// this.upComingMarketList = res?.productservice;
		// this.durationList = res?.revenuestreams;
		// this.analyseList = res?.saleschannel;
		// });
	}

	getCurrenyandLocation() {
		this.foundersToolsService.getCurrencyAndCountries().subscribe((res: any) => {
			this.currencyList = res
			console.log(this.currencyList, "currency list")
		})
		this.foundersToolsService.getLocationList().subscribe((res: any) => {
			this.locationList = res
			console.log(this.locationList, "locationList")
		})
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
		const formData = this.form.value
		if (!formData.forecast_peroid || !formData.goals) {
			this.submitted = true
			return
		}
		if (this.recommendRestrict) {
			this.restrict = true
			return
		}
		let data: any = {
			...this.form.value,
			mode: "revenue_forescasting_tool",
		}
		this.foundersToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isRecommendationQuestion = false
				this.isRecommendationData = true
				this.isRecommendationSavedData = false
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
		const formData = this.form.value
		if (this.activePageIndex == 0) {
			if (!formData.industry || (formData.seasonalfunctionality && (!formData.seasons || formData.seasons.length == 0)) || !formData.factors || formData.factors?.length == 0) {
				this.submitted = true
				return
			}
		}
		if (this.activePageIndex == 1) {
			if (!formData.target_audience || formData.target_audience?.length == 0 || !formData.assumptions || formData.assumptions?.length == 0) {
				this.submitted = true
				return
			}
		}
		if (this.activePageIndex == 2) {
			if (!formData.forecast_peroid || !formData.goals) {
				this.submitted = true
				return
			}
		}
		this.activePageIndex++
	}

	saveRecommadation() {
		if (!this.isFromSavedData) {
			this.foundersToolsService.getAnalysisList("revenue_forescasting_tool").subscribe({
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

	showRecommandationData(data: string) {
		this.isRecommendationQuestion = false
		this.isRecommendationData = true
		this.isRecommendationSavedData = false
		this.isFromSavedData = true
		this.recommendationData = data
	}

	onEnableDisableSeason(isSeasonEnable: boolean) {
		console.log(this.form.controls?.["factors"]) // Debugging line, ensure this is intentional
		this.form.get("seasonalfunctionality")?.setValue(isSeasonEnable)

		if (this.isSessonEnable) {
			this.form.controls?.["seasons"].addValidators(Validators.required)
			this.form.controls?.["seasons"].updateValueAndValidity()
		} else {
			this.form.controls?.["seasons"].clearValidators()
			this.form.controls?.["seasons"].updateValueAndValidity()
		}
	}

	resetRecommendation() {
		this.foundersToolsService.resetRecommendation().subscribe((res) => {
			this.isRecommendationQuestion = true
			this.isRecommendationData = false
			this.isRecommendationSavedData = false
			this.form.reset()
			this.activePageIndex = 0
			this.isFromSavedData = false
		})
	}

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		const formValue = ["industry", "seasonalfunctionality", "seasons", "factors", "target_audience", "assumptions", "forecast_peroid", "goals"]
		const formData = this.form.value
		let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">Revenue Forecasting Tool</h2>
				</div>
			</div><p><strong>Input:<br></strong></p>`

		// Keep track of which formValue index we're currently using
		let formValueIndex = 0

		this.recommendations.forEach((category: any, categoryIndex: number) => {
			addingInput += `<p><strong>${category.question.heading}</strong></p>`

			category.question.branches.forEach((branchQuestion: any, index: number) => {
				addingInput += `<p style="color: #d32f2f;><strong>${branchQuestion}</strong></p>`

				let currentAnswer = ""
				const currentFormField = formValue[formValueIndex]

				if (formData && formData[currentFormField]) {
					if (currentFormField == "seasonalfunctionality") {
						currentAnswer = formData[currentFormField] ? "Yes" : "No"
					} else {
						currentAnswer = formData[currentFormField]
					}
				} else {
					currentAnswer = "No answer provided"
				}

				addingInput += `<p>${currentAnswer}</p>`

				formValueIndex++
			})

			// Add spacing between categories
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
			module_name: "Revenue Forecasting Tool",
			file_name: "revenue_forecasting_tool",
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

	isGoBackNavigation() {
		this.router.navigateByUrl("/pages/founderstool/founderstoollist")
	}
}
