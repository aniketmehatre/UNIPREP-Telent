import { Component, OnInit } from "@angular/core"
import { TravelToolsService } from "../travel-tools.service"
import { Router, RouterModule } from "@angular/router"
import { City } from "src/app/@Models/cost-of-living"
import { CostOfLivingService } from "../../job-tool/cost-of-living/cost-of-living.service"
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
import { PageFacadeService } from '../../page-facade.service';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
import { SharedModule } from "src/app/shared/shared.module"
import { AuthService } from "src/app/Auth/auth.service"
@Component({
	selector: "uni-travel-visit-planner",
	templateUrl: "./travel-visit-planner.component.html",
	styleUrls: ["./travel-visit-planner.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DialogModule, CardModule, InputNumberModule, SharedModule],
})
export class TravelVisitPlannerComponent implements OnInit {
	constructor(private travelToolService: TravelToolsService, private router: Router, private costOfLivingService: CostOfLivingService, private toast: MessageService, private sanitizer: DomSanitizer, private promptService: PromptService, private pageFacade: PageFacadeService, private authService: AuthService) { }

	recommendations: { id: number; question: string }[] = [
		{ id: 1, question: "Where are you traveling to?" },
		{ id: 2, question: "How long do you plan to stay on your trip?" },
		{ id: 3, question: "Which season would you prefer to travel in?" },
	]
	seasons: { value: string }[] = [{ value: "Summer" }, { value: "Winter" }, { value: "Fall" }, { value: "Spring" }, { value: "Rainy" }]
	isRecommendation: boolean = true
	isResponsePage: boolean = false
	isSavedPage: boolean = false
	activePageIndex: number = 0
	selectedData: { [key: string]: any } = {}
	allCountries: any = []
	invalidClass: boolean = false
	recommendationData: SafeHtml = ""
	savedResponse: any = []
	destinationLocationList: City[] = []
	isResponseSkeleton: boolean = false;
	userInputs: any;

	ngOnInit(): void {
		this.selectedData[2] = 1 //second page i need to show the days count so manually i enter the day.
		this.getCityList();
	}
	getCityList() {
		this.costOfLivingService.getCities().subscribe({
			next: (response) => {
				this.destinationLocationList = response
			},
		})
	}

	buyCredits() {
		if (this.authService.isInvalidSubscription('travel_tools')) {
			this.authService.hasUserSubscription$.next(true);
		} else {
			this.router.navigate(["/pages/export-credit"]);
		}
	}

	previous() {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(productId: number) {
		if (this.authService.isInvalidSubscription('travel_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.hideWarning(productId)
		if (!this.invalidClass) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++
			}
		}
	}

	getRecommendation(productId: number) {
		if(this.authService._creditCount === 0){
			this.toast.add({severity: "error",summary: "Error",detail: "Please Buy some Credits...!"});
			this.router.navigateByUrl('/pages/export-credit')
			return;
		}
		this.recommendationData = "";
		this.hideWarning(productId)
		if (!this.invalidClass) {
			let data = {
				destination: this.selectedData[1].city_name + ', ' + this.selectedData[1].country_name,
				trip_duration: this.selectedData[2] + " days",
				season: this.selectedData[3],
				mode: "travel_visit_planner",
			}
			this.userInputs = data;
			this.isRecommendation = false;
			this.isResponsePage = true;
			this.isResponseSkeleton = true;
			this.travelToolService.getChatgptRecommendations(data).subscribe({
				next: (response) => {
					this.isResponseSkeleton = false;
					this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(response.response)
					this.authService.aiCreditCount$.next(true);
				},
				error: (error) => {
					console.error(error);
					this.isResponseSkeleton = false;
				},
			})
		}
	}

	hideWarning(productId: number) {
		if (productId in this.selectedData) {
			this.invalidClass = false
		} else {
			this.invalidClass = true
		}
	}

	resetRecommendation() {
		this.recommendationData = ""
		this.isRecommendation = true
		this.isResponsePage = false
		this.isSavedPage = false
		this.activePageIndex = 0
		this.selectedData = []
		this.selectedData[2] = 1
	}

	savedRecommendations() {
		if (this.authService.isInvalidSubscription('travel_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.isRecommendation = false
		this.isResponsePage = false
		this.isSavedPage = true
		this.travelToolService.getTripList("travel_visit_planner").subscribe((response) => {
			this.savedResponse = response.data
		})
	}
	clickRecommendation(response: any, userInputs: any) {
		this.isRecommendation = false
		this.isResponsePage = true
		this.isSavedPage = false
		this.recommendationData = response

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
			let currentAnswer = ""
			if (values.id == 1) {
				currentAnswer = this.userInputs.destination
			} else if (values.id == 2) {
				currentAnswer = `${this.userInputs.trip_duration} Days `
			} else if (values.id == 3) {
				currentAnswer = `${this.userInputs.season} Season`
			}
			addingInput += `<p>${currentAnswer}</p><br>`
		});
		let params: any = {
			module_name: "Travel Visit Planner",
			file_name: "travel_visit_planner",
			response: this.recommendationData,
			inputString: addingInput
		};
		this.promptService.responseBuilder(params);
	}

	goBack() {
		this.router.navigateByUrl("/pages/travel-tools")
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("travel-visit-planner");
	}
}
