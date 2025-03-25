import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
// import { CountryandCurrency } from 'src/app/@Models/currency.model';
import { TravelCostEstimatorQuestionList } from '../trvel-tool-questions';
import { TravelCostEstimator } from 'src/app/@Models/chat-gpt.model';
import { Router } from '@angular/router';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { City } from 'src/app/@Models/cost-of-living';
import { MessageService } from 'primeng/api';
import { sendDownloadParams } from 'src/app/@Models/travel-tools.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';
@Component({
	selector: 'uni-travel-cost-estimator',
	templateUrl: './travel-cost-estimator.component.html',
	styleUrls: ['./travel-cost-estimator.component.scss'],
	standalone: true,
	imports: [CommonModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DialogModule, CardModule, InputNumberModule]
})
export class TravelCostEstimatorComponent implements OnInit {

	recommendations: { id: number, question: string }[] = TravelCostEstimatorQuestionList;
	trvelExperienceList: { id: number, name: string }[] = [
		{ id: 1, name: 'Basic' },
		{ id: 2, name: 'Standard' },
		{ id: 3, name: 'Luxury' }
	];
	activePageIndex: number = 0;
	selectedData: { [key: string]: any } = {};
	invalidClass: boolean = false;
	// currencyList: CountryandCurrency[] = [];
	departureLocationList: City[] = [];
	destinationLocationList: City[] = [];
	isRecommendationQuestion: boolean = true;
	isRecommendationData: boolean = false;
	isRecommendationSavedData: boolean = false;
	recommendationData: SafeHtml = '';
	recommadationSavedQuestionList: TravelCostEstimator[] = [];
	isFromSavedData: boolean = false;

	constructor(
		private travelToolsService: TravelToolsService,
		private router: Router,
		private costOfLivingService: CostOfLivingService,
		private toast: MessageService,
		private sanitizer: DomSanitizer,
		private prompt: PromptService
	) { }

	ngOnInit(): void {
		this.selectedData = { 3: 1 };
		// this.getCurrencyList();
		this.getCityList();
	}

	getCityList() {
		this.costOfLivingService.getCities().subscribe({
			next: response => {
				this.departureLocationList = response;
				this.destinationLocationList = response;
			}
		});
	}

	// getCurrencyList() {
	//   this.travelToolsService.getCurrencies().subscribe({
	//     next: response => {
	//       this.currencyList = response;
	//     }
	//   });
	// }

	previous() {
		this.invalidClass = false;
		if (this.activePageIndex > 0) {
			this.activePageIndex--;
		}
	}

	next(itemId: number) {
		this.invalidClass = false;
		if (itemId in this.selectedData) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++;
			}
		} else {
			this.invalidClass = true;
		}
	}

	getRecommendation() {
		let data: any = {
			country: this.selectedData[1].city_name + ', ' + this.selectedData[1].country_name,
			destination: this.selectedData[2].city_name + ', ' + this.selectedData[2].country_name,
			duration: this.selectedData[3],
			experience: this.selectedData[4],
			currency: this.selectedData[1].currencycode,
			mode: 'travelcostestimator'
		}
		this.travelToolsService.getChatgptRecommendations(data).subscribe({
			next: response => {
				this.isRecommendationQuestion = false;
				this.isRecommendationData = true;
				this.isRecommendationSavedData = false;
				let chatGptResponse = response.response;
				// chatGptResponse = chatGptResponse
				// 	.replace(/```html|```/g, '')
				// 	.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
			},
			error: error => {
				console.error(error);
				this.isRecommendationData = false;
			}
		});
	}

	resetRecommendation() {
		this.activePageIndex = 0;
		this.selectedData = { 3: 1 };
		this.isRecommendationQuestion = true;
		this.isRecommendationData = false;
		this.isRecommendationSavedData = false;
		this.isFromSavedData = false;
	}

	saveRecommadation() {
		if (!this.isFromSavedData) {
			this.travelToolsService.getTripList('travelcostestimator').subscribe({
				next: response => {
					this.isRecommendationQuestion = false;
					this.isRecommendationData = false;
					this.isRecommendationSavedData = true;
					this.recommadationSavedQuestionList = response.data;
				},
				error: error => {
				}
			});
		}
		else {
			this.isRecommendationQuestion = false;
			this.isRecommendationData = false;
			this.isRecommendationSavedData = true;
		}
	}

	showRecommandationData(data: string) {
		this.isRecommendationQuestion = false;
		this.isRecommendationData = true;
		this.isRecommendationSavedData = false;
		this.isFromSavedData = true;
		this.recommendationData = data;
	}

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
	}

	downloadRecommadation() {

		let departureLocation = this.selectedData[1].city_name + ', ' + this.selectedData[1].country_name;
		let destinationLocation = this.selectedData[2].city_name + ', ' + this.selectedData[2].country_name;
		// let moduleName = "Travel Cost Estimator";
		// let addingInput = `
		// 	<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f0780e; padding-bottom: 10px; margin-bottom: 20px;">
		// 		<div style="text-align: center;">
		// 			<h2 style="margin: 0; color: #1a237e;">${moduleName}</h2>
		// 		</div>
		// 	</div>`;
		let inputString: string = `<p style="color: #f0780e;"><strong>Input:<br></strong></p>`;
		this.recommendations.forEach(values => {
			inputString += `<p  style="color: rgb(63, 76, 131);"><strong>${values.question}</strong></p>`;
			let currentAnswer = "";
			if (values.id == 1) {
				currentAnswer = departureLocation;
			} else if (values.id == 2) {
				currentAnswer = destinationLocation;
			} else if (values.id == 3) {
				currentAnswer = `${this.selectedData[3]} Days`;
			} else if (values.id == 4) {
				currentAnswer = this.selectedData[4];
			}
			inputString += `<p>${currentAnswer}</p><br>`;
		});
		inputString += `<div class=\"divider\"></div><p style="color: #f0780e;"><strong>Response:<br></strong></p>`;
		
		let params: sendDownloadParams = {
			module_name: "Travel Cost Estimator",
			file_name: "travel_cost_estimator",
			response: this.recommendationData,
			inputString: inputString
		};
		console.log(this.recommendationData);
		this.prompt.responseBuilder(params);
	}

	goBack() {
		this.router.navigateByUrl('/pages/travel-tools');
	}

}
