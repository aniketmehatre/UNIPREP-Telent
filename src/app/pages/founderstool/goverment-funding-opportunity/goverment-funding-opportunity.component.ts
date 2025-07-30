import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { DataService } from "src/app/services/data.service";
import { PageFacadeService } from "../../page-facade.service";
import { UserManagementService } from "../../user-management/user-management.service";
import { FounderstoolService } from "../founderstool.service";
import { Country } from "ngx-intl-tel-input/lib/model/country.model";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from "primeng/select";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Carousel } from "primeng/carousel";
import { ButtonModule } from 'primeng/button';
import { Paginator } from "primeng/paginator";

@Component({
	selector: "uni-goverment-funding-opportunity",
	templateUrl: "./goverment-funding-opportunity.component.html",
	styleUrls: ["./goverment-funding-opportunity.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, SelectModule, MultiSelectModule, FormsModule, ReactiveFormsModule, Carousel, ButtonModule, Paginator],
})
export class GovermentFundingOppurtunityComponent implements OnInit {
	fundData: any[] = []
	countryList: Country[] = []
	stateList: any = []
	page = 1
	pageSize = 25
	first: number = 0
	searchScholarshpName: string = ""
	totalFundCount: any
	isFilterVisible: boolean = false
	filterForm: FormGroup
	planExpired!: boolean
	fundTypeList: any[] = [
		{
			id: 31,
			type: "Angola",
			flag: "https://flagcdn.com/ao.svg",
			country_code: "+244",
		},
	]
	anyFundTypeList: any[] = []
	currentPlan: string = ""
	PersonalInfo!: any
	viewFavouritesLabel: string = "View Favourites"
	allfundList: any[] = []
	allFundCount: number = 0
	selectAllCheckboxes: boolean = false
	exportCreditCount: number = 0
	exportDataIds: any = []
	selectedFund: number = 0
	favCount: number = 0
	imagewhitlabeldomainname: any
	data: any = {
		page: this.page,
		perpage: this.pageSize,
	}
	constructor(private fb: FormBuilder, private fundListService: FounderstoolService, private toast: MessageService, private router: Router, private userManagementService: UserManagementService, private dataService: DataService, private pageFacade: PageFacadeService) {
		this.filterForm = this.fb.group({
			country: [null],
			region: [null],
			type: [null],
		})
	}
	enableModule: boolean = false
	activePageIndex: number = 0
	recommendations: any = [
		{
			id: 1,
			question: "Select your Country",
		},
		{
			id: 2,
			question: "Select your State",
		},
		{
			id: 3,
			question: "Choose your Fund Type",
		},
	]
	invalidClass: boolean = false
	selectedData: { [key: string]: any } = {}

	ngOnInit(): void {
		this.checkUserRecommendation()
		this.getFundCountry()
		this.getFundType()
		this.GetPersonalProfileData()
		this.loadFundData(0, this.selectedData)
	}

	performSearch() {
		if (this.searchScholarshpName == "") {
			this.loadFundData(0, this.selectedData)
			return
		}
		var searchedFund: any = []
		this.fundData.filter((item) => {
			if (item.name?.toLowerCase().includes(this.searchScholarshpName.toLowerCase())) {
				searchedFund.push(item)
			}
		})
		this.fundData = [...searchedFund]
	}

	clearFilter() {
		this.filterForm.reset()
		delete this.data.country
		delete this.data.region
		delete this.data.type
	}

	getFundCountry() {
		this.fundListService.getFundCountries().subscribe((res: any) => {
			let allCountries = res
			this.countryList = allCountries
		})
	}

	getStateListByCountry(countryId: number) {
		this.fundListService.getFundStateByCountry(countryId).subscribe(
			(res: any) => {
				this.stateList = res
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

	getFundType() {
		this.fundListService.getFundType().subscribe((response: any[]) => {
			this.fundTypeList = response
			this.anyFundTypeList = [...response, { id: "any", type: "Select All" }]
		})
	}

	changeCountryId(event: number) {
		this.getStateListByCountry(event)
	}

	loadFundData(isFavourite: number, data: any) {
		if (isFavourite == 1) {
			this.data = {}
			this.data["favourite"] = 1
		} else {
			this.data["favourite"] = 0
		}
		this.data.planname = this.currentPlan ? this.currentPlan : ""
		let keyMapping: any = { "1": "country", "2": "region", "3": "type" }
		let newData = Object.fromEntries(
			Object.entries(data).map(([key, value]) => {
				let mappedKey = keyMapping[key] || key
				if (Array.isArray(value)) {
					value = value.filter((item) => item !== null)
				}
				return [mappedKey, value]
			})
		)
		this.fundListService.getFundList({ ...newData, ...this.data }).subscribe((response: { governmentfundings: any[]; favourite_count: number; count: number; credit_count: number }) => {
			this.fundData = response.governmentfundings
			this.favCount = response.favourite_count
			if (isFavourite != 1) {
				this.allfundList = response.governmentfundings
				this.allFundCount = response.count
			}
			this.exportCreditCount = response.credit_count ? response.credit_count : 0
			this.totalFundCount = response.count
		})
		this.isFilterVisible = false
	}

	applyFilter() {
		const formData = this.filterForm.value
		if (!formData.country && !formData.region && !formData.type) {
			this.filterForm.reset()
			this.data = {
				page: this.page,
				perpage: this.pageSize,
			}
			this.loadFundData(0, this.selectedData)
			this.isFilterVisible = false
			return
		}
		this.data.page = 1
		this.data.perpage = 100
		if (this.filterForm.value.country) {
			this.data.country = Array.isArray(this.filterForm.value.country) ? this.filterForm.value.country : [this.filterForm.value.country]
		}
		if (this.filterForm.value.region) {
			this.data.region = this.filterForm.value.region
		}
		if (this.filterForm.value.type) {
			this.data.type = this.filterForm.value.type
		}
		this.first = 0
		this.fundListService.getFundList(this.data).subscribe((response: { governmentfundings: any[]; count: any }) => {
			this.fundData = response.governmentfundings
			this.totalFundCount = response.count
		})
		this.isFilterVisible = false
	}

	pageChange(event: any) {
		this.selectAllCheckboxes = false
		this.selectedFund = 0
		this.page = event.first / this.pageSize + 1
		this.pageSize = event.rows
		this.first = event.first
		this.data.page = this.page
		this.data.perpage = this.pageSize
		this.loadFundData(0, this.selectedData)
	}

	closePopup() {
		this.isFilterVisible = false
	}

	filterBy() {
		this.isFilterVisible = true
	}

	exportTable() { }

	fundingGuidlines(): void {
		this.router.navigate(["/pages/funding-guidlines"])
	}

	GetPersonalProfileData() {
		this.userManagementService.GetUserPersonalInfo().subscribe((data) => {
			this.PersonalInfo = data
		})
	}

	onStateChange() {
		if (this.selectedData[2]?.includes(380)) {
			this.selectedData[2] = this.stateList.map((item: any) => item.id)
		} else if (this.stateList.length - 1 == this.selectedData[2]?.length && !this.selectedData[2].includes(380)) {
			this.selectedData[2] = []
		} else {
			this.selectedData[2] = this.selectedData[2]
		}
	}

	bookmarkQuestion(FundId: any, isFav: any) {
		console.log(isFav)
		isFav = isFav != "1" ? true : false
		this.fundListService.addFavFundData(FundId, this.PersonalInfo.user_id, isFav).subscribe((response: { message: any }) => {
			let fundListData = this.fundData.find((item) => item.id == FundId)
			if (fundListData) {
				isFav == true ? (fundListData.favourite = 1) : (fundListData.favourite = null)
				this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1
			}
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
			this.loadFundData(1, this.selectedData)
		} else {
			let fundList = this.allfundList.map((fund) => {
				let foundFund = this.fundData.find((s) => s.id == fund.id)
				if (foundFund) {
					fund.favourite = foundFund.favourite
				}
				return fund
			})
			let favouriteFunds = fundList.filter((fund) => fund.favourite === 1)
			let nonFavouriteFunds = fundList.filter((fund) => fund.favourite !== 1)
			this.fundData = favouriteFunds.concat(nonFavouriteFunds)
			this.totalFundCount = this.allFundCount
			// this.loadFundData(0, this.selectedData);
		}
	}

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
		this.selectedFund = 0
		this.selectAllCheckboxes = !this.selectAllCheckboxes
		if (this.selectAllCheckboxes) {
			this.fundData.forEach((item) => {
				item.isChecked = 1
				this.selectedFund += 1
			})
		} else {
			this.fundData.forEach((item) => {
				item.isChecked = 0
			})
		}
	}

	exportData() {
		if (this.exportCreditCount != 0) {
			this.exportDataIds = []
			this.fundData.forEach((item) => {
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
			this.fundListService.exportSelectedData(data).subscribe((response: { link: string | URL | undefined }) => {
				window.open(response.link, "_blank")
				this.selectAllCheckboxes = false
				// this.selectedCheckboxCount = 0;
				this.selectedFund = 0
				this.loadFundData(0, this.selectedData)
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
		this.selectedFund = isChecked ? this.selectedFund + 1 : this.selectedFund - 1
		if (isChecked == false) {
			if (this.selectedFund) {
				this.selectAllCheckboxes = false
			}
		} else {
			if (this.fundData.length == this.selectedFund) {
				this.selectAllCheckboxes = true
			}
		}
	}

	openHowItWorksVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup('government-funding-list')
	}

	checkUserRecommendation() {
		this.fundListService.getRecommendations().subscribe((res: { status: any; data: any }) => {
			if (res.status) {
				this.enableModule = true
				this.setRecommendationToForm(res.data)
			} else {
				this.enableModule = false
				// this.addAnyValueToOptions();
			}
		})
	}

	setRecommendationToForm(data: any) {
		// this.selectedData[0] = data?.country;
		// this.selectedData[1] = data?.region;
		// this.selectedData[2] = data?.type;
		this.filterForm.patchValue({
			country: Array.isArray(data?.country) ? data?.country[0] : data?.country,
			region: data?.region,
			type: data?.type,
		})
		this.applyFilter()
	}

	getRecommendation() {
		let keyMapping: any = { "1": "country", "2": "region", "3": "type" }
		let newData = Object.fromEntries(
			Object.entries(this.selectedData).map(([key, value]) => {
				let mappedKey = keyMapping[key] || key
				if (Array.isArray(value)) {
					value = value.filter((item) => item !== null)
				}
				return [mappedKey, value]
			})
		)
		this.fundListService.storeRecommendation(newData).subscribe()
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

	resetRecommendation() {
		this.fundListService.resetFundRecommendation().subscribe((res: any) => {
			this.enableModule = false
			this.filterForm.reset()
			this.selectedData = {}
			this.activePageIndex = 0
			this.viewFavouritesLabel = "View Favourites"
			this.data.favourite = 0
			// this.addAnyValueToOptions();
			this.fundData = []
		})
	}
}
