import { Component, OnInit } from "@angular/core"
import { CareerPlannerService } from "./career-planner.service"
import { PageFacadeService } from "../page-facade.service"
import { AuthService } from "src/app/Auth/auth.service"
import { Router, RouterModule } from "@angular/router"
import { LocationService } from "src/app/location.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { SidebarModule } from "primeng/sidebar"

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
import { RadioButtonModule } from "primeng/radiobutton"
import { PdfViewerModule } from "ng2-pdf-viewer";
import { RestrictionDialogComponent } from "src/app/shared/restriction-dialog/restriction-dialog.component"
interface Specialisation {
	id: number
	subject_id: number
	specialisation_name: string
}
@Component({
	selector: "uni-career-planner",
	templateUrl: "./career-planner.component.html",
	styleUrls: ["./career-planner.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RadioButtonModule, SidebarModule, PdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, RestrictionDialogComponent],
})
export class CareerPlannerComponent implements OnInit {
	products: any = [
		{
			id: 1,
			question: "What is the highest level of study degree you have completed?",
			arrayName: "highLevelStudy",
			placeholder: "",
		},
		{
			id: 2,
			question: "What subject did you study?",
			arrayName: "subjects",
			placeholder: "Select your subject",
		},
		{
			id: 3,
			question: "What was your specialisation?",
			arrayName: "specilisation",
			placeholder: "Select your specialisation",
		},
		{
			id: 4,
			question: "Have you completed any internships?",
			arrayName: "YesOrNo",
			placeholder: "",
		},
		{
			id: 5,
			question: "What was the subject of your intership?",
			arrayName: "subjects",
			placeholder: "Select your subject",
		},
		{
			id: 6,
			question: "Did you specialize in a particular area during your internship?",
			arrayName: "internshipSpecilisation",
			placeholder: "Select your specialisation",
		},
		{
			id: 7,
			question: "Do you have work experience?",
			arrayName: "YesOrNo",
			placeholder: "",
		},
		{
			id: 8,
			question: "What field do you have work experience in?",
			arrayName: "subjects",
			placeholder: "Select your subject",
		},
		{
			id: 9,
			question: "Did you specialise in a particular area during your work experience?",
			arrayName: "wrkExpSpecilisation",
			placeholder: "Select your field",
		},
	]

	highLevelStudy: any = [
		{
			id: 1,
			value: "Masters",
		},
		{
			id: 2,
			value: "Bachelors",
		},
		{
			id: 3,
			value: "PG Diploma",
		},
		{
			id: 4,
			value: "Diploma",
		},
		{
			id: 5,
			value: "None in List",
		},
	]

	YesOrNo: any = [
		{
			id: 1,
			value: "Yes",
		},
		{
			id: 2,
			value: "No",
		},
	]

	selectedData: { [key: string]: any } = {}
	enableModule!: boolean
	activePageIndex: number = 0
	invalidClass: boolean = false
	specilisation: any = []
	nxtOrRecommendBtn: boolean = false
	careerListData: any[] = []
	totalRowCount: number = 0
	jobSiteData: any[] = []
	page = 1
	perPage = 30
	currencyButtonName: string = "Dollar"
	currentPlan: string = ""
	planExpired!: boolean
	restrict: boolean = false

	arrayMap: any = {
		highLevelStudy: this.highLevelStudy,
		YesOrNo: this.YesOrNo,
		subjects: [],
		specilisation: [],
		internshipSpecilisation: [],
		wrkExpSpecilisation: [],
	}

	constructor(private careerPlannerService: CareerPlannerService, private pageFacade: PageFacadeService, private authService: AuthService, private router: Router, private locationService: LocationService) { }

	ngOnInit(): void {
		this.checkCareerPlanExist()
		this.checkplanExpire()
		this.locationService.getImage().subscribe((imageUrl) => {
			this.orglogowhitelabel = imageUrl
		})
	}

	toggleClass(buttonName: string) {
		this.currencyButtonName = buttonName
	}

	checkCareerPlanExist() {
		this.careerPlannerService.checkCareerPlanExist().subscribe((res) => {
			if (res == "Exist") {
				this.enableModule = true
				this.listPageDataLoading()
			} else {
				this.selectboxValueLoading()
			}
		})
	}

	selectboxValueLoading() {
		this.careerPlannerService.loadSelectBoxValues().subscribe((responce) => {
			this.arrayMap.subjects = responce.subject
			this.specilisation = responce.specilisation
		})
	}

	listPageDataLoading() {
		let data = {
			page: this.page,
			perPage: this.perPage,
		}
		this.careerPlannerService.loadListPageData(data).subscribe((res) => {
			const dataArray = Object.entries(res.data).map(([key, value]) => {
				const newKey = key.split("_")
				return { key: newKey[0], value: value }
			})
			this.careerListData = dataArray
			// this code is to get unique job sites
			this.careerListData.forEach((career) => {
				career?.value.forEach((value: any) => {
					const uniqueJobSiteNames = new Set()
					value.job_site_data = value.job_site_data.filter((site: any) => {
						if (!uniqueJobSiteNames.has(site?.job_site_name)) {
							uniqueJobSiteNames.add(site?.job_site_name)
							console.log(site?.job_site_url)
							return true
						}
						return false
					})
				})
			})

			this.totalRowCount = res.total_count
		})
	}

	previous(productId: number): void {
		this.nxtOrRecommendBtn = false
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			if (productId == 7 && this.selectedData[4] == 2) {
				if (this.activePageIndex != 6) {
					this.nxtOrRecommendBtn = true
				} else {
					this.nxtOrRecommendBtn = false
				}
				this.activePageIndex = 3
			} else {
				this.activePageIndex-- // Decrement the active page index if it's not the first page
				this.nxtOrRecommendBtn = false
			}
		}
	}

	next(productId: number): void {
		this.invalidClass = false
		if (productId in this.selectedData) {
			if (this.activePageIndex < this.products.length - 1) {
				if (productId === 4 || productId === 7) {
					if (this.selectedData[productId] == 2) {
						if (productId === 4) {
							// if the product id 8 and 9 is already choose so the values are stored. again i go to give the product id value is 4 the values are still exist in the array so i removed
							const entries = Object.entries(this.selectedData)
							const filteredEntries = entries.filter(([key, _]) => key !== "5" && key !== "6")
							this.selectedData = Object.fromEntries(filteredEntries)
							if (this.selectedData[7] == 2) {
								this.nxtOrRecommendBtn = true
							}
						}
						this.activePageIndex += 3
					} else {
						this.activePageIndex++
					}
				} else if (productId === 1) {
					if (this.selectedData[1] == 5) {
						this.products[1].question = "What subject are you interested in?"
						this.products[2].question = "What specialization are you interested in?"
						this.activePageIndex++
					} else {
						this.products[1].question = "What subject did you study?"
						this.products[2].question = "What was your specialisation?"
						this.activePageIndex++
					}
				} else {
					if (productId == 6 && this.selectedData[7] == 2) {
						this.nxtOrRecommendBtn = true
					} else {
						this.nxtOrRecommendBtn = false
					}
					this.activePageIndex++
				}
			}
		} else {
			this.invalidClass = true
		}
		let selectedSubjectResult: any = []

		this.specilisation.forEach((element: Specialisation) => {
			if (element.subject_id == this.selectedData[productId]) {
				//filter the subject specialization
				selectedSubjectResult.push(element)
			}
		})

		//if i use same array, i went next page the array values are changed so i use separate array for every place
		if (productId === 2) {
			this.arrayMap.specilisation = selectedSubjectResult
		} else if (productId === 5) {
			this.arrayMap.internshipSpecilisation = selectedSubjectResult
		} else if (productId === 8) {
			this.arrayMap.wrkExpSpecilisation = selectedSubjectResult
		}
	}

	getRecommendation(productId: number) {
		this.invalidClass = false
		if (productId === 9) {
			if (this.selectedData[9] === undefined) {
				this.invalidClass = true
				return
			} else if (this.selectedData[9].length === 0) {
				this.invalidClass = true
				return
			}
		}

		if (productId == 7 && this.selectedData[productId] == 2) {
			//if 4th page value is no if i click the previous button needs to redirect direcly 4th page
			// if the product id 8 and 9 is already choose so the values are stored. again i go to give the product id value is 7 the values are still exist in the array so i removed
			const entries = Object.entries(this.selectedData)
			const filteredEntries = entries.filter(([key, _]) => key !== "8" && key !== "9")
			this.selectedData = Object.fromEntries(filteredEntries)
		}

		this.careerPlannerService.storeCareerPlans(this.selectedData).subscribe((res) => {
			if (res.status) {
				this.enableModule = true
				this.listPageDataLoading()
			}
		})
	}

	onClickRadioButton(productId: number) {
		this.invalidClass = false
		if (productId == 7) {
			if (this.selectedData[productId] == 2) {
				this.nxtOrRecommendBtn = true
			} else {
				this.nxtOrRecommendBtn = false
			}
		}
	}

	paginate(event: any) {
		if (this.planExpired) {
			this.restrict = true
			return
		}

		this.page = event.page + 1
		this.perPage = event.rows
		this.listPageDataLoading()
	}

	handleClick(event: Event) {
		if (this.planExpired) {
			this.restrict = true
			event.preventDefault() // Prevent the default action of the anchor tag
		}
	}

	getHref(jobSiteURL: string): string {
		const url = jobSiteURL
		return !url.startsWith("http://") && !url.startsWith("https://") ? "http://" + url : url
	}

	resetRecommendation() {
		this.careerPlannerService.resetRecommendation().subscribe((res) => {
			this.enableModule = false
			this.selectboxValueLoading()
			this.activePageIndex = 0
			this.selectedData = []
			this.nxtOrRecommendBtn = false
			this.page = 1
			this.perPage = 30
		})
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}

	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
	checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			let data = res.time_left
			let subscription_exists_status = res.subscription_details
			if (data.plan === "expired" || data.plan === "subscription_expired" || subscription_exists_status.subscription_plan == "Student") {
				this.planExpired = true
			} else {
				this.planExpired = false
			}
		})
	}

	upgradePlan(): void {
		this.router.navigate(["/pages/subscriptions"])
	}
	clearRestriction() {
		this.restrict = false
	}

	goBack() {
		this.router.navigate(["/pages/job-tool/career-tool"])
	}
}
