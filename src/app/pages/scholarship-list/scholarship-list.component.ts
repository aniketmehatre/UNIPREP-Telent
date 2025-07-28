import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ScholarshipListService } from "./scholarship-list.service"
import { MessageService } from "primeng/api"
import { Router, RouterModule } from "@angular/router"
import { UserManagementService } from "../user-management/user-management.service"
import { DataService } from "src/app/services/data.service"
import { PageFacadeService } from "../page-facade.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { MultiSelectModule } from "primeng/multiselect"
import { ButtonModule } from "primeng/button"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { CarouselModule } from "primeng/carousel"
import { PaginatorModule } from "primeng/paginator"
@Component({
	selector: "uni-scholarship-list",
	templateUrl: "./scholarship-list.component.html",

	styleUrls: ["./scholarship-list.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, CarouselModule, DialogModule, MultiSelectModule, FormsModule, ReactiveFormsModule, SkeletonModule, TooltipModule, ButtonModule, PaginatorModule],
})
export class ScholarshipListComponent implements OnInit {
	scholarshipData: any[] = []
	industryInterested: any
	investorOrgType: any
	investorType: any
	countryList: any
	anyCountryList: any
	headQuartersList: any
	page = 1
	pageSize = 25
	first: number = 0
	searchScholarshpName: string = ""
	totalScholarShipCount: any
	isFilterVisible: boolean = false
	filterForm: FormGroup
	homeCountryList: any[] = []
	studyLevelList: any[] = []
	anyStudyLevelList: any[] = []
	regionList: any[] = []
	filterUniversityList: any[] = []
	scholarshipTypeList: any[] = []
	anyScholarshipTypeList: any[] = []
	coverList: any[] = []
	anyCoverList: any[] = []
	imagewhitlabeldomainname: any;
	currentPlan: string = ""
	PersonalInfo: any = {
		usertype_id: null,
		trail_config_id: null,
		trail_expired_flag: null,
		user_id: null,
	}
	viewFavouritesLabel: string = "View Favourites"
	allScholarshipList: any[] = []
	allScholarshipCount: number = 0
	// selectedIndex: any;
	// toSend: boolean = false;
	selectAllCheckboxes: boolean = false
	// selectedCheckboxCount: number = 0;
	exportCreditCount: number = 0
	exportDataIds: any = []
	selectedScholarship: number = 0
	favCount: number = 0

	constructor(private fb: FormBuilder, private scholarshipListService: ScholarshipListService, private toast: MessageService, private router: Router, private userManagementService: UserManagementService, private dataService: DataService, private pageFacade: PageFacadeService) {
		// Initialize form with empty arrays for MultiSelect controls
		this.filterForm = this.fb.group({
			country: [[]],
			home_country: [[]],
			study_level: [[]],
			university: [[]],
			valueRange: [[]],
			type: [[]],
			cover_id: [[]],
		})
	}
	enableModule: boolean = false
	activePageIndex: number = 0
	recommendations: any = [
		{
			id: 1,
			question: "Which country do you want to study in?",
		},
		{
			id: 2,
			question: "What is your preferred study level?",
		},
		{
			id: 3,
			question: "What type of scholarship you want to opt for?",
		},
		{
			id: 4,
			question: "What is your preferred scholarship coverage?",
		},
	]
	invalidClass: boolean = false
	selectedData: { [key: string]: any[] } = {}
	studyLevelCubes: any = [
		{ id: "UG", label: "Undergraduate" },
		{ id: "PG", label: "Postgraduate" },
		{ id: null, label: "Any" },
	]

	ngOnInit(): void {
		this.checkUserRecommendation()
		this.getScholarshipCountry()
		this.gethomeCountryList()
		this.getStudyLevel()
		this.getFilterUniversityList("")
		this.loadScholarShipData(0)
		this.getScholarshipType()
		this.getRegionList()
		this.getCovers()
		this.GetPersonalProfileData()
	}

	performSearch() {
		if (this.searchScholarshpName == "") {
			this.loadScholarShipData(0)
			return
		}
		var searchedScholarship: any = []
		this.scholarshipData.filter((item) => {
			if (item.name?.toLowerCase().includes(this.searchScholarshpName.toLowerCase())) {
				searchedScholarship.push(item)
			}
		})
		this.scholarshipData = [...searchedScholarship]
	}

	// resetFilter() {
	//   this.regionList = [];
	//   this.filterForm.reset();
	//   this.data = {
	//     page: this.page,
	//     perpage: this.pageSize,
	//   }
	//   this.loadScholarShipData(0);
	//   // this.getRegionList();
	//   this.getFilterUniversityList("");
	//   this.isFilterVisible = false;
	// }
	clearFilter() {
		this.regionList = []
		// Reset form with empty arrays for MultiSelect controls
		this.filterForm.patchValue({
			country: [],
			home_country: [],
			study_level: [],
			university: [],
			valueRange: [],
			type: [],
			cover_id: [],
		})
		this.getFilterUniversityList("")
		delete this.data.country
		delete this.data.home_country
		delete this.data.type
		delete this.data.study_level
		delete this.data.university
		delete this.data.cover_id
	}
	getScholarshipCountry() {
		this.scholarshipListService.getScholarCountry().subscribe((res) => {
			let allCountries = res
			this.countryList = allCountries
		})
	}

	gethomeCountryList() {
		this.scholarshipListService.getScholarshipCountry(2).subscribe(
			(res: any) => {
				this.homeCountryList = res
			},
			(error: any) => {
				this.toast.add({
					severity: "warning",
					summary: "Warning",
					detail: error.error.message,
				})
			}
		)
	}

	getStudyLevel() {
		this.scholarshipListService.getStudyLevel().subscribe(
			(response: any) => {
				console.log("Study Level Response:", response)

				if (Array.isArray(response)) {
					// Map the response to the correct format
					this.studyLevelList = response.map((item) => ({
						id: item.id,
						level: item.level || item.name || "",
					}))

					// Initialize the form control with an empty array if not already set
					const currentValue = this.filterForm.get("study_level")?.value
					if (!Array.isArray(currentValue)) {
						this.filterForm.patchValue({ study_level: [] })
					}

					// Create anyStudyLevelList without the Select All option for now
					this.anyStudyLevelList = [...this.studyLevelList]
				} else {
					console.warn("Study Level response is not an array:", response)
					this.studyLevelList = []
					this.anyStudyLevelList = []
					this.filterForm.patchValue({ study_level: [] })
				}
			},
			(error) => {
				console.error("Error fetching study levels:", error)
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: "Failed to load study levels",
				})
				this.studyLevelList = []
				this.anyStudyLevelList = []
				this.filterForm.patchValue({ study_level: [] })
			}
		)
	}

	getScholarshipType() {
		this.scholarshipListService.getScholarshipType().subscribe(
			(response: any) => {
				console.log("Scholarship Type Response:", response) // Debug log

				// Ensure response is an array and has data
				if (Array.isArray(response)) {
					this.scholarshipTypeList = response.map((item) => ({
						id: item.id,
						type: item.type || item.name || "", // Fallback to name if type is not present
					}))
					console.log("Processed Scholarship Type List:", this.scholarshipTypeList) // Debug log

					// Create anyScholarshipTypeList with Select All option
					this.anyScholarshipTypeList = [{ id: "any", type: "Select All" }, ...this.scholarshipTypeList]
				} else {
					console.warn("Scholarship Type response is not an array:", response)
					this.scholarshipTypeList = []
					this.anyScholarshipTypeList = []
				}
			},
			(error) => {
				console.error("Error fetching scholarship types:", error)
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: "Failed to load scholarship types",
				})
			}
		)
	}

	getCovers() {
		this.scholarshipListService.getCoverList().subscribe(
			(response: any) => {
				console.log("Covers Response:", response) // Debug log

				// Ensure response is an array and has data
				if (Array.isArray(response)) {
					this.coverList = response.map((item) => ({
						id: item.id,
						cover_name: item.cover_name || item.name || "", // Fallback to name if cover_name is not present
					}))
					console.log("Processed Cover List:", this.coverList) // Debug log

					// Create anyCoverList with Select All option
					this.anyCoverList = [{ id: "any", cover_name: "Select All" }, ...this.coverList]
				} else {
					console.warn("Covers response is not an array:", response)
					this.coverList = []
					this.anyCoverList = []
				}
			},
			(error) => {
				console.error("Error fetching covers:", error)
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: "Failed to load covers",
				})
			}
		)
	}

	loadScholarShipData(isFavourite: number) {
		if (isFavourite == 1) {
			this.data = {}
			this.data["favourite"] = 1
		} else {
			this.data["favourite"] = 0
		}
		this.data.planname = this.currentPlan ? this.currentPlan : ""

		this.scholarshipListService.getScholarshipList(this.data).subscribe((response) => {
			this.scholarshipData = response.scholarship
			this.favCount = response.favourite_count
			if (isFavourite != 1) {
				this.allScholarshipList = response.scholarship
				this.allScholarshipCount = response.count
			}
			this.exportCreditCount = response.credit_count ? response.credit_count : 0
			this.totalScholarShipCount = response.count
		})
		this.isFilterVisible = false
	}
	applyFilter() {
		const formData = this.filterForm.value
		console.log(this.data)
		if (!formData.home_country && !formData.country && !formData.study_level && !formData.university && !formData.type && !formData.valueRange && !formData.cover_id) {
			this.regionList = []
			this.filterForm.reset()
			this.data = {
				page: this.page,
				perpage: this.pageSize,
			}
			this.loadScholarShipData(0)
			this.getRegionList()
			this.getFilterUniversityList("")
			this.isFilterVisible = false
			return
		}
		this.data.page = 1
		this.data.perpage = 100
		if (this.filterForm.value.country) {
			this.data.country = this.filterForm.value.country
		}
		if (this.filterForm.value.home_country) {
			this.data.home_country = this.filterForm.value.home_country
		}
		if (this.filterForm.value.type) {
			this.data.type = this.filterForm.value.type
		}
		if (this.filterForm.value.study_level && this.filterForm.value.study_level.length > 0) {
			this.data.study_level = this.filterForm.value.study_level
		}
		// if (
		//   this.filterForm.value.region &&
		//   this.filterForm.value.region.length > 0
		// ) {
		//   this.data.region = this.filterForm.value.region;
		// }
		if (this.filterForm.value.university && this.filterForm.value.university.length > 0) {
			this.data.university = this.filterForm.value.university
		}
		if (this.filterForm.value.cover_id) {
			this.data.cover_id = this.filterForm.value.cover_id
		}
		this.first = 0
		this.scholarshipListService.getScholarshipList(this.data).subscribe((response) => {
			this.scholarshipData = response.scholarship
			this.totalScholarShipCount = response.count
		})
		this.isFilterVisible = false
	}
	getRegionList() {
		this.scholarshipListService.getRegion().subscribe((response) => {
			this.regionList = response
		})
	}
	countryChange(event: any) {
		// if (event.value == 105) {
		//   this.getRegionList();
		// } else {
		//   this.filterForm.value.region = null;
		//   this.regionList = [];
		// }
		this.getFilterUniversityList(event.value)
	}
	data: any = {
		page: this.page,
		perpage: this.pageSize,
	}
	pageChange(event: any) {
		this.selectAllCheckboxes = false
		this.selectedScholarship = 0
		this.page = event.first / this.pageSize + 1
		this.pageSize = event.rows
		this.first = event.first
		this.data.page = this.page
		this.data.perpage = this.pageSize
		this.loadScholarShipData(0)
	}

	closePopup() {
		this.isFilterVisible = false
	}

	filterBy() {
		this.isFilterVisible = true
	}

	exportTable() { }
	getFilterUniversityList(value: any) {
		this.scholarshipListService.getUniversity(value).subscribe((response) => {
			this.filterUniversityList = response
		})
	}

	scholarGuidlines(): void {
		this.router.navigate(["/pages/scholarship-guidlines"])
	}
	GetPersonalProfileData() {
		this.userManagementService.GetUserPersonalInfo().subscribe((data) => {
			this.PersonalInfo = data
		})
	}
	bookmarkQuestion(scholarshipId: any, isFav: any) {
		isFav = isFav != "1" ? true : false
		this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1

		this.scholarshipListService.bookmarkScholarshipData(scholarshipId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
			let scholarshipListData = this.scholarshipData.find((item) => item.id == scholarshipId)
			isFav == true ? (scholarshipListData.favourite = 1) : (scholarshipListData.favourite = null)
			this.toast.add({
				severity: "success",
				summary: "Success",
				detail: response.message,
			})
		})
	}
	viewFavourites() {
		this.viewFavouritesLabel = this.viewFavouritesLabel == "View Favourites" ? "View All" : "View Favourites"
		if (this.viewFavouritesLabel == "View All") {
			this.loadScholarShipData(1)
		} else {
			let scholarshipList = this.allScholarshipList.map((scholarship) => {
				let foundScholarship = this.scholarshipData.find((s) => s.id == scholarship.id)
				if (foundScholarship) {
					scholarship.favourite = foundScholarship.favourite
				}
				return scholarship
			})
			let favouriteScholarships = scholarshipList.filter((scholarship) => scholarship.favourite === 1)
			let nonFavouriteScholarships = scholarshipList.filter((scholarship) => scholarship.favourite !== 1)
			this.scholarshipData = favouriteScholarships.concat(nonFavouriteScholarships)
			this.totalScholarShipCount = this.allScholarshipCount
		}
	}
	checkBoxopen() { }
	// sholarshipquestionid: number[] = [];
	// selectedlistcount:number=0
	// questionSelectedCheckBox(event: any, index: number, ticketques: any) {
	// if (event.target.checked) {
	//   this.sholarshipquestionid.push(ticketques.id);
	//   console.log(this.sholarshipquestionid);
	// } else {
	//   const indexToRemove = this.sholarshipquestionid.indexOf(ticketques.id);
	//   if (indexToRemove !== -1) {
	//     this.sholarshipquestionid.splice(indexToRemove, 1);
	//     console.log(this.sholarshipquestionid);
	//   }
	// }
	// this.selectedlistcount=this.sholarshipquestionid.length;

	//   this.selectedIndex = event.target.checked ? index : undefined;
	//   this.toSend = event.target.checked;
	//     this.sholarshipquestionid=ticketques.id
	//     console.log(this.sholarshipquestionid);
	// }

	openReport() {
		let data = {
			isVisible: true,
			reporttype: 4,
			moduleId: 4,
			report_mode: "other_module",
		}
		this.dataService.openReportWindow(data)
	}

	buyCredits(): void {
		this.router.navigate(["/pages/export-credit"])
	}

	selectAllCheckbox() {
		this.selectedScholarship = 0
		this.selectAllCheckboxes = !this.selectAllCheckboxes
		if (this.selectAllCheckboxes) {
			this.scholarshipData.forEach((item) => {
				item.isChecked = 1
				this.selectedScholarship += 1
			})
		} else {
			this.scholarshipData.forEach((item) => {
				item.isChecked = 0
			})
		}
	}

	exportData() {
		if (this.exportCreditCount != 0) {
			this.exportDataIds = []
			this.scholarshipData.forEach((item) => {
				if (item.isChecked == 1) {
					this.exportDataIds.push(item.id)
				}
			})
			if (this.exportDataIds.length == 0) {
				this.toast.add({ severity: "error", summary: "error", detail: "Select Some data for export!." })
				return
			}
			if (this.exportCreditCount < this.exportDataIds.length) {
				if (this.exportCreditCount < this.exportDataIds.length) {
					this.toast.add({ severity: "error", summary: "error", detail: "insufficient credits.Please Buy Some Credits." })
					this.router.navigate(["/pages/export-credit"])
					return
				}
			} else {
				if (this.exportCreditCount < this.exportDataIds.length) {
					this.toast.add({ severity: "error", summary: "error", detail: "To download additional data beyond your free credits, please upgrade your plan." })
					return
				}
			}
			let data = {
				module_id: 3,
				export_id: this.exportDataIds,
			}
			this.scholarshipListService.exportSelectedData(data).subscribe((response) => {
				window.open(response.link, "_blank")
				this.selectAllCheckboxes = false
				// this.selectedCheckboxCount = 0;
				this.selectedScholarship = 0
				this.loadScholarShipData(0)
			})
		} else if (this.exportCreditCount == 0) {
			if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
				this.toast.add({ severity: "error", summary: "error", detail: "Please Buy Some Credits." })
				this.router.navigate(["/pages/export-credit"])
			}
		}
	}

	onCheckboxChange(event: any) {
		const isChecked = (event.target as HTMLInputElement).checked
		this.selectedScholarship = isChecked ? this.selectedScholarship + 1 : this.selectedScholarship - 1
		if (isChecked == false) {
			if (this.selectedScholarship) {
				this.selectAllCheckboxes = false
			}
		} else {
			if (this.scholarshipData.length == this.selectedScholarship) {
				this.selectAllCheckboxes = true
			}
		}
	}

	openHowItWorksVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("unischolar")
	}

	checkUserRecommendation() {
		this.scholarshipListService.getRecommendations().subscribe((res) => {
			if (res.status) {
				this.enableModule = true
				this.setRecommendationToForm(res.data)
			} else {
				this.enableModule = false
				// this.addAnyValueToOptions();
			}
		})
	}
	// addAnyValueToOptions(){
	//   setTimeout(() => {
	//     // let anyCountryArray: any = {id: null,country: "Any Country"};
	//     // this.anyCountryList.unshift(anyCountryArray);

	//     let anyScholarList:any = { id: null, type: "Any"};
	//     this.anyScholarshipTypeList.unshift(anyScholarList);

	//     let anyCoverList:any = {id: null,cover_name: "Any" };
	//     this.anyCoverList.unshift(anyCoverList);
	//   }, 1000);
	// }

	setRecommendationToForm(data: any) {
		this.filterForm.patchValue(data)
		this.applyFilter()
	}

	getRecommendation() {
		let keyMapping: any = { "1": "country", "2": "study_level", "3": "type", "4": "cover_id" }

		let newData = Object.fromEntries(
			Object.entries(this.selectedData).map(([key, value]) => {
				let mappedKey = keyMapping[key] || key
				if (Array.isArray(value)) {
					value = value.filter((item) => item !== null)
				}
				return [mappedKey, value]
			})
		)
		this.scholarshipListService.storeRecommendation(newData).subscribe()
		this.enableModule = true
		this.setRecommendationToForm(newData)
	}

	previous(): void {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(productId: number): void {
		this.invalidClass = false
		if (productId in this.selectedData) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++
			}
		} else {
			this.invalidClass = true
		}
	}

	selectCube(key: number, id: number | string) {
		// Ensure the key exists with an array value
		if (!this.selectedData[key]) {
			this.selectedData[key] = []
		}

		if (id === "any") {
			// Clear array if any is already selected
			if (this.selectedData[key].includes("any")) {
				this.selectedData[key] = []
				return
			}

			// Select all based on the key
			switch (key) {
				case 2:
					this.selectedData[key] = [...this.anyStudyLevelList.map((cube) => cube.id)]
					break
				case 3:
					this.selectedData[key] = [...this.anyScholarshipTypeList.map((cube) => cube.id)]
					break
				case 4:
					this.selectedData[key] = [...this.anyCoverList.map((cube) => cube.id)]
					break
			}
			return
		}

		// Handle individual selection
		const index = this.selectedData[key].indexOf(id)
		if (index > -1) {
			// Remove if already selected
			this.selectedData[key].splice(index, 1)
		} else {
			// Add if not selected
			this.selectedData[key].push(id)
		}
	}

	resetRecommendation() {
		this.scholarshipListService.resetRecommendation().subscribe((res) => {
			this.enableModule = false
			// Reset form with empty arrays for MultiSelect controls
			this.filterForm.patchValue({
				country: [],
				home_country: [],
				study_level: [],
				university: [],
				valueRange: [],
				type: [],
				cover_id: [],
			})
			// Initialize selectedData with empty arrays for each key
			this.selectedData = {
				1: [],
				2: [],
				3: [],
				4: [],
			}
			this.activePageIndex = 0
			this.viewFavouritesLabel = "View Favourites"
			this.data.favourite = 0
		})
	}
}
