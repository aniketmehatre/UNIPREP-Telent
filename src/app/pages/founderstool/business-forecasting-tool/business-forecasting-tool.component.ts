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
import { TravelToolsService } from "../../travel-tools/travel-tools.service"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SkeletonModule } from "primeng/skeleton"
import { SharedModule } from "src/app/shared/shared.module"
import { removeExtraResponse } from "../../prompt"

@Component({
	selector: "uni-business-forecasting-tool",
	templateUrl: "./business-forecasting-tool.component.html",
	styleUrls: ["./business-forecasting-tool.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule],
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
	form: FormGroup = new FormGroup({})
	currentPlan: string = ""
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
				branches: ["What industry is your start up in?", "Does your business experience seasonal variations in its operations?", "If yes, please specify the peak seasons", "What are the key revenue drivers for your business?"],
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
	isResponseSkeleton: boolean = false;
	aiCreditCount: number = 0;
	userInputs: any;

	constructor(private fb: FormBuilder, private foundersToolsService: FounderstoolService, private locationService: LocationService, private authService: AuthService, private router: Router, private pageFacade: PageFacadeService, private toast: MessageService, private travelToolService: TravelToolsService, private sanitizer: DomSanitizer, private promptService: PromptService) {
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
		this.getForeCastingOptionLists()
		this.getCurrenyandLocation()
		this.getAICreditCount();
	}
	getAICreditCount() {
		this.promptService.getAicredits().subscribe({
			next: resp => {
				this.aiCreditCount = resp;
			}
		})
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
		this.recommendationData ="";
		this.submitted = false
		const formData = this.form.value
		if (!formData.forecast_peroid || !formData.goals) {
			this.submitted = true
			return
		}
		if (this.aiCreditCount == 0) {
			this.toast.add({ severity: "error", summary: "Error", detail: "Free AI Credits Over.Please Buy Some Credits..!" });
			return;
		}
		let data: any = {
			...this.form.value,
			mode: "revenue_forescasting_tool",
		}
		//when the user clicks the history on that time the user inputs won't be there.so we stored the inputs and using the this(userInputs) for both. current user input and history also.
		this.userInputs = data;
		this.isRecommendationQuestion = false
		this.isRecommendationSavedData = false
		this.isRecommendationData = true
		this.isResponseSkeleton = true;
		this.foundersToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isResponseSkeleton = false;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response)
				this.getAICreditCount();
			},
			error: (error) => {
				this.isResponseSkeleton = false;
				this.isRecommendationData = false;
				this.isRecommendationQuestion = true;
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
		if (this.authService.isInvalidSubscription('founders_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		if (!this.isFromSavedData) {
			this.foundersToolsService.getAnalysisList("revenue_forescasting_tool").subscribe({
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
		// this.recommendationData = data
		this.recommendationData = removeExtraResponse(data);

		const encodedJson = userInputs;
		const decodedInput = JSON.parse(encodedJson);
		this.userInputs = decodedInput;
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
		let addingInput: string = '';
		const formValue = ["industry", "seasonalfunctionality", "seasons", "factors", "target_audience", "assumptions", "forecast_peroid", "goals"]
		// const formData = this.form.value
		let formValueIndex = 0
		this.recommendations.forEach((category: any) => {
			addingInput += `<p><strong>${category.question.heading}</strong></p>`
			category.question.branches.forEach((branchQuestion: any) => {
				addingInput += `<p style="color: #3f4c83;><strong>${branchQuestion}</strong></p>`
				let currentAnswer = ""
				const currentFormField = formValue[formValueIndex]
				if (this.userInputs[currentFormField]) {
					if (currentFormField == "seasonalfunctionality") {
						currentAnswer = this.userInputs[currentFormField] ? "Yes" : "No"
					} else {
						currentAnswer = this.userInputs[currentFormField]
					}
				} else {
					currentAnswer = "No answer provided"
				}
				addingInput += `<p>${currentAnswer}</p><br>`
				formValueIndex++
			})
			// Add spacing between categories
			addingInput += `<br>`
		})
		let params: any = {
			module_name: "Revenue Forecasting Tool",
			file_name: "revenue_forecasting_tool",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	isGoBackNavigation() {
		this.router.navigateByUrl("/pages/founderstool/founderstoollist")
	}
}
