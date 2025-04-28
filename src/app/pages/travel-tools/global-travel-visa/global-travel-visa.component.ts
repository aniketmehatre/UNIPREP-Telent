import { Component, OnInit } from "@angular/core"
import { TravelToolsService } from "../travel-tools.service"
import { Router, RouterModule } from "@angular/router"
import { CommonModule } from "@angular/common"
import { CarouselModule } from "primeng/carousel"
import { Countries } from "src/app/@Models/country.model"
import { BasicType } from "src/app/@Models/recommandation-question.model"
import { Meta } from "@angular/platform-browser"
import { MessageService } from "primeng/api"
import { CardModule } from "primeng/card"
import { DialogModule } from "primeng/dialog"
import { DataService } from "src/app/data.service"
import { TooltipModule } from "primeng/tooltip"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputTextModule } from "primeng/inputtext"
import { MultiSelectModule } from "primeng/multiselect"
import { ButtonModule } from "primeng/button"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { InputGroupModule } from "primeng/inputgroup"
import { SelectModule } from "primeng/select"
import { environment } from "@env/environment"
import { AuthService } from "src/app/Auth/auth.service"

@Component({
	selector: "uni-global-travel-visa",
	templateUrl: "./global-travel-visa.component.html",
	styleUrls: ["./global-travel-visa.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, CarouselModule, CardModule, DialogModule, SelectModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule],
})
export class GlobalTravelVisaComponent implements OnInit {
	recommendations: { id: number; question: string }[] = [
		{ id: 1, question: "Select Your Nationality?" },
		{ id: 2, question: "Select the country you are looking for?" },
		// { id: 3, question: "Select your residential status of Country?" }
	]
	residentStatus: { value: string; label: string }[] = [
		{ value: "Resident", label: "Resident" },
		{ value: "Non-Resident", label: "Non-Resident" },
	]
	activePageIndex: number = 0
	selectedData: { [key: string]: any } = {}
	allCountries: Countries[] = []
	visaCountries: Countries[] = []
	invalidClass: boolean = false
	title: string = ""
	isRecommendationQuestion: boolean = true
	isRecommendationData: boolean = false
	isRecommendationSavedData: boolean = false
	isRecommendationEachVisaNameData: boolean = false
	recommendationDataList: any[] = []
	recomendationData: any[] = []
	modeName: any
	moduleId: any
	moduleTitile: string = ""
	countryNameTitle: any = ""
	visaNameTite: any = ""
	visaCategoryTitle: any = ""
	visaCategoryList: any[] = [
		{
			id: 1,
			question: "What is the VISA Eligibility",
			answer: `Lorem ipsum dolor sit amet consectetur adipisicing elit.Consequatur harum neque deserunt reiciendis minus repellat tempora deleniti mollitia, in natus sint laudantium repellendus earum beatae nostrum dolorum illo dolorem culpa a. Eveniet perferendis aut quisquam? Ipsa illo minima inventore assumenda quibusdam voluptas eum iure, magnam consectetur omnis officiis, similique accusantium nobis natus vero nulla nostrum distinctio. Officiis porro dolore veniam ad a sint quia vel ipsam, aliquam repellendus repudiandae commodi odit, hic praesentium eius rem quo nobis animi doloremque dignissimos impedit! Nobis ratione quidem dolor tenetur quod, quae at? Vel amet esse suscipit quas iure, libero dolor adipisci eos exercitationem reiciendis earum? Veniam, at. Nesciunt eaque quas dolorem itaque beatae ratione sunt sapiente, placeat sint impedit et nostrum doloremque. Maiores, eveniet sed tempora quia accusantium qui maxime vero aperiam? Quo consectetur quod quidem. Aspernatur, sit officia! Vitae molestiae atque distinctio harum fugit, eaque minus, placeat ab excepturi voluptas impedit inventore dolore dolorem unde ipsum, corporis molestias laboriosam ipsam. Nulla rerum deserunt asperiores provident, distinctio ad nemo laborum, eveniet doloribus quis veniam itaque fugit autem quae alias minus magnam. Magni, pariatur error. Voluptatem, pariatur quis ipsa, corrupti praesentium animi maiores odit iure esse hic aliquam cum, perspiciatis ipsum architecto sunt repellat.`,
		},
	]
	visaCategoryQuestionList: any[] = []
	eachVisaNameCategory: any[] = [];
	eachVisaCategoryAllList: any[] = [];
	isQuestionAnswerVisible: boolean = false
	selectedQuestionData: any
	isNotSelectingDropdown: boolean = false
	imageUrl: any = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/travel-tools/`;

	constructor(private travelToolService: TravelToolsService, private router: Router, private meta: Meta,
		private toast: MessageService, private dataService: DataService, private authService: AuthService) { }

	ngOnInit(): void {
		this.getCurrentModule()
		this.getCountriesList()
		this.getVisaCountriesList()
	}

	getCurrentModule() {
		let currentEndpoint = this.router.url.split("/").pop() || ""
		const titles: { [key: string]: string } = {
			"travel-visa": "Global Travel Visa",
			"global-work-visa": "Global Work Visa",
			"enterpreneur-visa": "Global Entrepreneur Visa",
			"study-visa": "Global Study Visa",
		}
		this.title = titles[currentEndpoint] || ""
		const modeName: { [key: string]: string } = {
			"travel-visa": "global_travel_visa",
			"enterpreneur-visa": "global_entrepreneur_visa",
			"study-visa": "global_study_visa",
		}
		this.modeName = modeName[currentEndpoint] || ""
		const modeid: { [key: string]: number } = {
			"travel-visa": 36,
			"enterpreneur-visa": 35,
			"study-visa": 37,
		}
		this.moduleId = modeid[currentEndpoint] || ""

		const moduleTitile: { [key: string]: string } = {
			"travel-visa": "Travel Tools",
			"enterpreneur-visa": "Founders Tools",
			"study-visa": "Education Tools",
		}
		this.moduleTitile = moduleTitile[currentEndpoint] || ""
		// image url
	}

	getCountriesList() {
		this.travelToolService.getCountriesList().subscribe((response) => {
			const country = response.find((item: any) => item.id === 122)
			this.allCountries = country ? [country] : []
		})
	}
	getVisaCountriesList() {
		var data = {
			mode: this.modeName,
		}
		this.travelToolService.getVisaCountriesList(data).subscribe((response: any) => {
			this.visaCountries = response.data
		})
	}
	previous() {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(itemId: number) {
		if (this.title == "Global Study Visa") {
			if (this.authService.isInvalidSubscription('education_tools')) {
				this.authService.hasUserSubscription$.next(true);
				return;
			}
		}
		else if (this.title == "Global Entrepreneur Visa") {
			if (this.authService.isInvalidSubscription('founders_tools')) {
				this.authService.hasUserSubscription$.next(true);
				return;
			}
		}
		else if (this.title == "Global Travel Visa") {
			if (this.authService.isInvalidSubscription('travel_tools')) {
				this.authService.hasUserSubscription$.next(true);
				return;
			}
		}
		if (itemId == 1) {
			this.invalidClass = !(itemId in { 1: 122 })
		} else {
			this.invalidClass = !(itemId in this.selectedData)
		}
		if (!this.invalidClass) {
			this.activePageIndex < this.recommendations.length - 1 ? this.activePageIndex++ : this.getRecommendation()
		}
	}

	resetRecommendation() {
		this.activePageIndex = 0
		this.isRecommendationQuestion = true
		this.isRecommendationData = false
		this.isRecommendationSavedData = false
		this.isRecommendationEachVisaNameData = false
		this.selectedData = {}
	}

	getRecommendation() {
		this.isRecommendationQuestion = false // if api is done, then have to remove
		this.isRecommendationData = true
		this.isRecommendationSavedData = false
		this.isRecommendationEachVisaNameData = false
		this.recommendationDataList = []
		let data = {
			// source_id: this.selectedData[1],
			country: this.selectedData[2].id,
			mode: this.modeName,
			// resident_id: this.selectedData[3]
		}
		this.travelToolService.getVisaRecommendationsAllList(data).subscribe({
			next: (response) => {
				this.isRecommendationQuestion = false
				this.isRecommendationData = true
				this.isRecommendationSavedData = false
				this.isRecommendationEachVisaNameData = false
				this.recomendationData = response.Data
				const uniqueVisaData = Array.from(
					new Map(
						this.recomendationData.map((item) => [item.visa_name, { visa_name: item.visa_name, visa_icons: item.visa_icons }])
					).values()
				);
				this.recommendationDataList = uniqueVisaData
			},
			error: (error) => {
				this.isRecommendationData = false
			},
		})
	}

	getVisaCategoryList(name: any) {
		this.visaNameTite = name;
		this.isRecommendationQuestion = false
		this.isRecommendationData = false
		this.isRecommendationSavedData = false
		this.isRecommendationEachVisaNameData = true
		this.eachVisaNameCategory = [];
		this.eachVisaCategoryAllList = [];
		const bridgingVisaData = this.recomendationData.filter((item) => item.visa_name === name)
		const uniqueVisaCategory = Array.from(
			new Set(bridgingVisaData.map((item) => item.question_category)) // Extract unique visa category names
		).map((question_category) => ({ question_category }))
		this.eachVisaNameCategory = uniqueVisaCategory;
		this.eachVisaCategoryAllList = bridgingVisaData;
	}

	viewOneQuestion(data: any) {
		this.isQuestionAnswerVisible = true
		console.log(data);

		this.selectedQuestionData = data
	}

	onShowModal(value: any) {
		let socialShare: any = document.getElementById("socialSharingList")
		socialShare.style.display = "none"
	}

	showSocialSharingList() {
		let socialShare: any = document.getElementById("socialSharingList")
		if (socialShare.style.display == "") {
			socialShare.style.display = "block"
		} else {
			socialShare.style.display = socialShare.style.display == "none" ? "block" : "none"
		}
	}

	shareQuestion(type: string) {
		const socialMedias: { [key: string]: string } = {
			Whatsapp: "whatsapp://send?text=",
			Instagram: "https://www.instagram.com?url=",
			Facebook: "https://www.facebook.com/sharer/sharer.php?u=",
			LinkedIn: "https://www.linkedin.com/shareArticle?url=",
			Twitter: "https://twitter.com/intent/tweet?url=",
			Mail: "mailto:?body=",
		}
		const url = window.location.href + "/" + this.selectedQuestionData?.id
		this.meta.updateTag({ property: "og:url", content: url })
		const shareUrl = socialMedias[type] + encodeURIComponent(url)
		window.open(shareUrl, "_blank")
	}

	copyLink() {
		// this.meta.updateTag(
		//   { property: 'og:title', content:  this.selectedQuestionName.question},
		// );
		// this.meta.updateTag(
		//   { name: 'title', content:  this.selectedQuestionName.question},
		// );
		const safeUrl = encodeURI(window.location.href)
		const selectedDegreeId = this.selectedQuestionData?.degree_id || ""
		const selectedQuestionId = this.selectedQuestionData?.id || ""
		const textToCopy = `${safeUrl}/${selectedDegreeId}/${selectedQuestionId}`
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				this.toast.add({ severity: "success", summary: "Success", detail: "Question Copied" })
			})
			.catch((err) => {
				this.toast.add({ severity: "error", summary: "Warning", detail: "Failed to copy the question" })
				console.error("Failed to copy text: ", err)
			})
	}

	goBack() {
		if (this.isRecommendationData) {
			this.isRecommendationData = false
			this.isRecommendationQuestion = true
			this.activePageIndex = 0
		} else if (this.isRecommendationEachVisaNameData) {
			this.isRecommendationEachVisaNameData = false
			this.isRecommendationData = true
		} else if (this.isRecommendationSavedData) {
			this.isRecommendationSavedData = false
			this.isRecommendationEachVisaNameData = true
		} else {
			const urls: { [key: string]: string } = {
				"Global Travel Visa": "/pages/travel-tools",
				"Global Work Visa": "/pages/job-tool",
				"Global Entrepreneur Visa": "/pages/founderstool",
				"Global Study Visa": "/pages/education-tools",
			}
			const targetUrl = urls[this.title] || ""
			this.router.navigateByUrl(targetUrl)
		}
	}
	viewQuestions(category: any) {
		this.visaCategoryTitle = category;
		this.visaCategoryQuestionList = []
		this.isRecommendationQuestion = false
		this.isRecommendationData = false
		this.isRecommendationSavedData = true
		this.isRecommendationEachVisaNameData = false
		const bridgingVisaData = this.eachVisaCategoryAllList.filter((item) => item.question_category === category)
		this.visaCategoryQuestionList = bridgingVisaData
	}
	openReport() {
		let data: any = {
			isVisible: true,
			moduleId: this.moduleId,
			questionId: this.selectedQuestionData?.id,
			countryId: 0,
		}
		// if (this.currentModuleId == 8) {
		//   data.reporttype = 8;
		// }
		this.dataService.openReportWindow(data)
	}
	goToHome(data: any) {
		this.isQuestionAnswerVisible = false
	}
	// getVisaName(name:string){
	//   let result = name.includes("Applying for");
	//   return result
	// }
	// getVisaName1(name:string){
	//   let result = name.includes("Visa Cost");
	//   return result
	// }
	// getVisaName2(name:string){
	//   let result = name.includes("Business & Residency");
	//   return result
	// }
	// getVisaName3(name:string){
	//   let result = name.includes("Validity & Restrictions");
	//   return result
	// }
	// getVisaName4(name:string){
	//   let result = name.includes("Post-Arrival");
	//   return result
	// }
	// getVisaName5(name:string){
	//   let result = name.includes("Visa Centers");
	//   return result
	// }
	getVisaName(name: string) {
		let image = ""
		if (name.includes("Applying for")) {
			image = this.imageUrl + "ApplyingforanEntrepreneurVisa.svg"
		} else if (name.includes("Visa Cost")) {
			image = this.imageUrl + "VisaCostProcessingTime.svg"
		} else if (name.includes("Visa Centers")) {
			image = this.imageUrl + "VisaCentersApplicationSubmission.svg"
		} else if (name.includes("Restrictions")) {
			image = this.imageUrl + "EntrepreneurVisaValidityRestrictions.svg"
		} else if (name.includes("Post-Arrival Questions")) {
			image = this.imageUrl + "PostArrivalQuestions.svg"
		} else if (name.includes("Residency-Related")) {
			image = this.imageUrl + "BusinessResidencyRelatedEntrepreneurVisaQuestionsforIndianNationals.svg"
		}
		return image
	}
	onChangeCountry(eve: any) {
		this.countryNameTitle = eve.value.country
	}
}
