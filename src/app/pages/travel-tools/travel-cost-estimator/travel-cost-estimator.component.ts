import { Component, OnInit } from "@angular/core"
import { TravelToolsService } from "../travel-tools.service"
import { PageFacadeService } from "../../page-facade.service"
import { TravelCostEstimatorQuestionList } from "../trvel-tool-questions"
import { TravelCostEstimator } from "src/app/@Models/chat-gpt.model"
import { Router, RouterModule } from "@angular/router"
import { CostOfLivingService } from "../../job-tool/cost-of-living/cost-of-living.service"
import { City } from "src/app/@Models/cost-of-living"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ButtonModule } from "primeng/button"
import { CardModule } from "primeng/card"
import { CarouselModule } from "primeng/carousel"
import { DialogModule } from "primeng/dialog"
import { FluidModule } from "primeng/fluid"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputNumberModule } from "primeng/inputnumber"
import { InputTextModule } from "primeng/inputtext"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SharedModule } from "src/app/shared/shared.module"

@Component({
	selector: "uni-travel-cost-estimator",
	templateUrl: "./travel-cost-estimator.component.html",
	styleUrls: ["./travel-cost-estimator.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DialogModule, CardModule, InputNumberModule, SharedModule],
})
export class TravelCostEstimatorComponent implements OnInit {
	recommendations: { id: number; question: string }[] = TravelCostEstimatorQuestionList
	trvelExperienceList: { id: number; name: string }[] = [
		{ id: 1, name: "Basic" },
		{ id: 2, name: "Standard" },
		{ id: 3, name: "Luxury" },
	]
	activePageIndex: number = 0
	selectedData: { [key: string]: any } = {}
	invalidClass: boolean = false
	// currencyList: CountryandCurrency[] = [];
	departureLocationList: City[] = []
	destinationLocationList: City[] = []
	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	recommendationData: SafeHtml = ""
	recommadationSavedQuestionList: TravelCostEstimator[] = []
	isFromSavedData: boolean = false
	isResponseSkeleton: boolean = false;
	aiCreditCount: number = 0;
	userInputs: any= [];

	constructor(private travelToolsService: TravelToolsService, private router: Router, private costOfLivingService: CostOfLivingService, private toast: MessageService, private sanitizer: DomSanitizer, private promptService: PromptService,private pageFacade: PageFacadeService,) { }

	ngOnInit(): void {
		this.selectedData = { 3: 1 }
		this.getCityList();
		this.getAICreditCount();
	}

	getCityList() {
		this.costOfLivingService.getCities().subscribe({
			next: (response) => {
				this.departureLocationList = response
				this.destinationLocationList = response
			},
		})
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink);
	}

	getAICreditCount(){
		this.promptService.getAicredits().subscribe({
		  next: resp =>{
			this.aiCreditCount = resp;
		  }
		})
	}

	previous() {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(itemId: number) {
		this.invalidClass = false
		if (itemId in this.selectedData) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++
			}
		} else {
			this.invalidClass = true
		}
	}

	getRecommendation() {
		let data: any = {
			country: this.selectedData[1].city_name + ", " + this.selectedData[1].country_name,
			destination: this.selectedData[2].city_name + ", " + this.selectedData[2].country_name,
			duration: this.selectedData[3],
			experience: this.selectedData[4],
			currency: this.selectedData[1].currencycode,
			mode: "travelcostestimator",
		}
		this.userInputs = data; 
		this.isRecommendationQuestion = false
		this.isRecommendationSavedData = false
		this.isRecommendationData = true
		this.isResponseSkeleton = true;
		this.travelToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isResponseSkeleton = false;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response)
				this.getAICreditCount();
			},
			error: (error) => {
				console.error(error);
				this.isResponseSkeleton = false;
				this.isRecommendationData = false
			}
		});
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
			this.travelToolsService.getTripList("travelcostestimator").subscribe({
				next: (response) => {
					this.isRecommendationQuestion = false
					this.isRecommendationData = false
					this.isRecommendationSavedData = true
					this.recommadationSavedQuestionList = response.data
				},
				error: (error) => { },
			})
		} else {
			this.isRecommendationQuestion = false
			this.isRecommendationData = false
			this.isRecommendationSavedData = true
		}
	}

	showRecommandationData(data: string, userInputs: any) {
		console.log(userInputs);
		this.isRecommendationQuestion = false
		this.isRecommendationData = true
		this.isRecommendationSavedData = false
		this.isFromSavedData = true
		this.recommendationData = data

		const encodedJson = userInputs;
		const decodedInput = JSON.parse(encodedJson);
		this.userInputs = decodedInput;
	}

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		let addingInput: string = '';
		this.recommendations.forEach((values) => {
			addingInput += `<p style="color: #3f4c83;"><strong>${values.question}</strong></p>`
			let currentAnswer = "";
			if (values.id == 1) {
				currentAnswer = this.userInputs.country;
			} else if (values.id == 2) {
				currentAnswer = this.userInputs.destination;
			} else if (values.id == 3) {
				currentAnswer = `${this.userInputs.duration} Days`;
			} else if (values.id == 4) {
				currentAnswer = this.userInputs.experience;
			}
			addingInput += `<p>${currentAnswer}</p><br>`;
		})
		let params: any = {
			module_name: "Travel Cost Estimator",
			file_name: "travel_cost_estimator",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	goBack() {
		this.router.navigateByUrl("/pages/travel-tools")
	}
}
