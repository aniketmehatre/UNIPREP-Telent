import { Component, OnInit } from "@angular/core"
import { TravelToolsService } from "../travel-tools.service"
import { TravelPackingPlannerQuestionList } from "../trvel-tool-questions"
import { Router, RouterModule } from "@angular/router"
import { CostOfLivingService } from "../../job-tool/cost-of-living/cost-of-living.service"
import { City } from "src/app/@Models/cost-of-living"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
import { SkeletonModule } from "primeng/skeleton"
import { FluidModule } from "primeng/fluid"
import { InputTextModule } from "primeng/inputtext"
import { TooltipModule } from "primeng/tooltip"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { CarouselModule } from "primeng/carousel"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { SelectModule } from "primeng/select"
import { DialogModule } from "primeng/dialog"
import { CardModule } from "primeng/card"
import { InputNumberModule } from "primeng/inputnumber"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SharedModule } from "src/app/shared/shared.module"
import { PageFacadeService } from '../../page-facade.service';
import { AuthService } from "src/app/Auth/auth.service";
import { removeExtraResponse } from "../../prompt"

@Component({
	selector: "uni-travel-packing-planner",
	templateUrl: "./travel-packing-planner.component.html",
	styleUrls: ["./travel-packing-planner.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DialogModule, CardModule, InputNumberModule, SharedModule],
})
export class TravelPackingPlannerComponent implements OnInit {
	recommendations: { id: number; question: string }[] = TravelPackingPlannerQuestionList
	activePageIndex: number = 0
	destinationLocationList: City[] = []
	selectedData: { [key: string]: any } = {}
	invalidClass: boolean = false
	travelTypeList: { id: number; name: string }[] = [
		{ id: 1, name: "Business" },
		{ id: 2, name: "Leisure" },
		{ id: 3, name: "Adventure" },
	]
	transportationModeList: { id: number; name: string }[] = [
		{ id: 1, name: "Metro" },
		{ id: 2, name: "Train" },
		{ id: 3, name: "Bus" },
		{ id: 3, name: "Taxi/Car" },
		{ id: 3, name: "Walk" },
	]
	monthList: { id: number; name: string }[] = [
		{ id: 1, name: "January" },
		{ id: 2, name: "February" },
		{ id: 3, name: "March" },
		{ id: 4, name: "April" },
		{ id: 5, name: "May" },
		{ id: 6, name: "June" },
		{ id: 7, name: "July" },
		{ id: 8, name: "August" },
		{ id: 9, name: "September" },
		{ id: 10, name: "October" },
		{ id: 11, name: "November" },
		{ id: 12, name: "December" },
	]
	recommendationData: SafeHtml
	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	recommadationSavedQuestionList: any[] = [];
	isFromSavedData: boolean = false;
	isResponseSkeleton: boolean = false;
	
	userInputs: any;

	constructor(private travelToolsService: TravelToolsService, private router: Router, private costOfLivingService: CostOfLivingService, private toast: MessageService, private sanitizer: DomSanitizer, private promptService: PromptService, private pageFacade: PageFacadeService, private authService: AuthService) { }

	ngOnInit(): void {
		this.selectedData = { 4: 1 }
		this.getCityList();
		
	}

	

	buyCredits() {
		if (this.authService.isInvalidSubscription('travel_tools')) {
			this.authService.hasUserSubscription$.next(true);
		} else {
			this.router.navigate(["/pages/export-credit"]);
		}
	}

	getCityList() {
		this.costOfLivingService.getCities().subscribe({
			next: (response) => {
				this.destinationLocationList = response;
			},
		});
	}

	previous() {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--;
		}
	}

	next(itemId: number) {
		if (this.authService.isInvalidSubscription('travel_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.invalidClass = false
		if (itemId in this.selectedData) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++;
			}
		} else {
			this.invalidClass = true;
		}
	}

	getRecommendation() {
		if(this.authService._creditCount === 0){
			this.toast.add({severity: "error",summary: "Error",detail: "Please Buy some Credits...!"});
			this.router.navigateByUrl('/pages/export-credit')
			return;
		}
		this.recommendationData = "";
		let data: any = {
			destination: this.selectedData[1].city_name + ", " + this.selectedData[1].country_name,
			travel_type: this.selectedData[2],
			travel_mode: this.selectedData[3],
			duration: this.selectedData[4],
			travel_month: this.selectedData[5],
			mode: "travel_packaging_planner",
		}
		this.userInputs = data;
		this.isRecommendationQuestion = false;
		this.isRecommendationData = true;
		this.isRecommendationSavedData = false;
		this.isResponseSkeleton = true;
		this.travelToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isResponseSkeleton = false;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response);
				this.authService.aiCreditCount$.next(true);
			},
			error: (error) => {
				console.error(error);
				this.isResponseSkeleton = false;
				this.isRecommendationData = false;
			},
		})
	}

	resetRecommendation() {
		this.activePageIndex = 0
		this.selectedData = { 4: 1 }
		this.isRecommendationQuestion = true
		this.isRecommendationData = false
		this.isRecommendationSavedData = false
		this.isFromSavedData = false
	}

	saveRecommadation() {
		if (this.authService.isInvalidSubscription('travel_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		if (!this.isFromSavedData) {
			this.travelToolsService.getTripList("travel_packaging_planner").subscribe({
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

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		let addingInput: string = '';
		this.recommendations.forEach((values) => {
			addingInput += `<p style="color: #3f4c83;"><strong>${values.question}</strong></p>`
			let currentAnswer = "";
			if (values.id == 1) {
				currentAnswer = this.userInputs.destination
			} else if (values.id == 2) {
				currentAnswer = this.userInputs.travel_type
			} else if (values.id == 3) {
				currentAnswer = this.userInputs.travel_mode.join(", ")
			} else if (values.id == 4) {
				currentAnswer = `${this.userInputs.duration} Days`
			} else if (values.id == 5) {
				currentAnswer = `${this.userInputs.travel_month} Month`
			}
			addingInput += `<p>${currentAnswer}</p><br>`
		})
		let params: any = {
			module_name: "Travel Packaging Planner",
			file_name: "travel_packaging_planner",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	goBack() {
		this.router.navigateByUrl("/pages/travel-tools")
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("travel-packaging-planner");
	}
}
