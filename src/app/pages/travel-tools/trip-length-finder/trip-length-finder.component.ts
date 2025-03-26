import { Component, OnInit } from "@angular/core"
import { TravelToolsService } from "../travel-tools.service"
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
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { PromptService } from "../../prompt.service"
@Component({
	selector: "uni-trip-length-finder",
	templateUrl: "./trip-length-finder.component.html",
	styleUrls: ["./trip-length-finder.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule],
})
export class TripLengthFinderComponent implements OnInit {
	constructor(private travelToolService: TravelToolsService, private router: Router, private costOfLivingService: CostOfLivingService, private toast: MessageService, private sanitizer: DomSanitizer, private prompt: PromptService) {}

	recommendations: { id: number; question: string }[] = [{ id: 1, question: "Which Destination are you planning to visit?" }]
	isRecommendation: boolean = true
	isResponsePage: boolean = false
	isSavedPage: boolean = false
	activePageIndex: number = 0
	selectedData: { [key: string]: any } = {}
	invalidClass: boolean = false
	recommendationData: SafeHtml
	savedResponse: any = []
	destinationLocationList: City[] = []

	ngOnInit(): void {
		this.getCityList()
	}

	getCityList() {
		this.costOfLivingService.getCities().subscribe({
			next: (response) => {
				this.destinationLocationList = response
			},
		})
	}

	getRecommendation(productId: number) {
		this.hideWarning(productId)
		if (!this.invalidClass) {
			let data = {
				country: this.selectedData[1].city_name ?? this.selectedData[1].country_name,
				mode: "trip_length_finder",
			}
			this.travelToolService.getChatgptRecommendations(data).subscribe((response: any) => {
				let chatGptResponse = response.response
				// chatGptResponse = chatGptResponse
				// 	.replace(/```html|```/g, '')
				//   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
				//   .replace(/<head>(.*?)<\/head>/gs, ''); // Fix escaping;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse)
				this.isRecommendation = false
				this.isResponsePage = true
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
	}

	savedRecommendations() {
		this.isRecommendation = false
		this.isResponsePage = false
		this.isSavedPage = true

		this.travelToolService.getTripList("trip_length_finder").subscribe((response) => {
			this.savedResponse = response.data
		})
	}

	clickRecommendation(response: any) {
		this.isRecommendation = false
		this.isResponsePage = true
		this.isSavedPage = false
		this.recommendationData = response
	}

	onSaveRes() {
		this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" })
	}

	downloadRecommadation() {
		let selectedCityAndCountry = this.selectedData[1].city_name + ", " + this.selectedData[1].country_name
		// let titleCard = `
		//   <div class="title-bar">
		// 		<div style="text-align: center;">
		// 			<h2 style="color: #1a237e;">Trip Length Finder</h2>
		// 		</div>
		// 	</div><p><strong>Input:<br></strong></p>
		//   <p style="color: #d32f2f;"><strong>Which Destination are you planning to visit?</strong></p>
		//   <p>${selectedCityAndCountry}</p>
		//   <div class="divider"></div><p><strong>Response:<br></strong></p>
		// `;

		// let styles = `
		// <style>
		// body{
		//   width: 100%;
		//   font-family: 'Poppins', sans-serif;
		//   color: black;
		//   text-align: left;
		//   line-height: 1.9;
		//   font-size: 16px;
		// }
		// .container {
		//   page-break-before: auto;
		//   page-break-after: auto;
		// }

		// .title-bar {
		//   display: flex;
		//   align-items: center;
		//   justify-content:center;
		//   border-bottom: 2px solid #d32f2f;
		//   padding-bottom: 10px;
		//   margin-bottom: 20px;
		//   page-break-after: avoid;
		// }

		// .module-logo{
		//   width: 100%;
		//   height: 100%;
		//   object-fit: contain;
		// }

		// h2,
		// h3 {
		//   color: #1a237e;
		//   page-break-before: auto;
		//   page-break-inside: avoid;
		//   page-break-after: avoid;
		// }

		// .title-highlight {
		//   color: #d32f2f;
		//   font-weight: bold;
		//   font-size: 22px;
		// }

		// .loan-details,
		// .section-content {
		//   padding: 15px;
		//   border-radius: 8px;
		//   page-break-inside: avoid;
		// }

		// li {
		//   page-break-inside: avoid;
		//   word-wrap: break-word;
		// }

		// ul {
		//   padding-left: 20px;
		//   page-break-inside: avoid;
		// }
		// .icon {
		//   color: #3949ab;
		//   margin-right: 10px;
		// }
		// .divider {
		//   height: 2px;
		//   background: linear-gradient(to right, #3949ab, #d32f2f);
		//   margin: 20px 0;
		// }
		// .blue-background {
		//   background-color: #e3f2fd;
		//   page-break-inside: avoid;
		// }
		// .packing-list,
		// .summary {
		//   padding: 15px;
		//   border-radius: 8px;
		//   font-size: 16px;
		//   page-break-inside: avoid;
		// }
		// p {
		//   page-break-inside: avoid;
		// }
		// </style>`;
		let inputString: string = `<p style="color: #f0780e;"><strong>Input:<br></strong></p>
      <p style="color: rgb(63, 76, 131);"><strong>Which Destination are you planning to visit?</strong></p>
      <p>${selectedCityAndCountry}</p>
      <div class="divider"></div><p><strong>Response:<br></strong></p>`
		let params: any = {
			module_name: "Trip Length Finder",
			file_name: "trip_length_finder",
			response: this.recommendationData,
			inputString: inputString,
		}
		this.prompt.responseBuilder(params)
	}

	goBack() {
		this.router.navigateByUrl("/pages/travel-tools")
	}
}
