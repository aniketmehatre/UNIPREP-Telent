import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from "@angular/core"
import { PitchDeskService } from "./pitch-desk.service"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AuthService } from "src/app/Auth/auth.service"
import { Router, RouterModule } from "@angular/router"
import { MessageService } from "primeng/api"
import { DataService } from "src/app/data.service"
import { PageFacadeService } from "../page-facade.service"
import { UserManagementService } from "../user-management/user-management.service"
import { LocationService } from "src/app/location.service"

import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { InputTextModule } from "primeng/inputtext"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { CarouselModule } from "primeng/carousel"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { PaginatorModule } from "primeng/paginator"
import { PdfViewerModule } from "ng2-pdf-viewer"

@Component({
	selector: "uni-pitch-desk",
	templateUrl: "./pitch-desk.component.html",
	styleUrls: ["./pitch-desk.component.scss"],
	standalone: true,
	imports: [CommonModule, InputGroupModule, InputGroupAddonModule, DialogModule, RouterModule, InputTextModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, FormsModule, ReactiveFormsModule, PaginatorModule, PdfViewerModule],
})
export class PitchDeskComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild("pdfViewer") pdfViewer: any
	pitchDeskList: any[] = []
	page = 1
	pageSize = 50
	totalPitchDeckCount = 0
	isFilterVisible: string = "none"
	filterForm: FormGroup
	countrySelectBox: any = []
	fundingTypeSelectBox: any = []
	sectorSelectBox: any = []
	valueNearYouFilter: string = ""
	showDiv: boolean = true
	planExpired: boolean = false
	currentPlan: string = ""
	selectAllCheckboxes: boolean = false
	selectedCheckboxCount: number = 0
	exportCreditCount: number = 0
	exportDataIds: any = []
	isPdfLoaded: boolean = false
	favCount: number = 0
	PersonalInfo!: any
	viewFavourites: boolean = false
	imageWhiteLabelDomainName: any
	pdname: any
	private allPitchDeskData: any[] = []
	pdfURL: any
	isPdfDownloadOption: any
	pdfLoadError: boolean = false

	constructor(private pitchDesk: PitchDeskService, private userManagementService: UserManagementService, private fb: FormBuilder, private router: Router, private authService: AuthService, private toast: MessageService, private dataService: DataService, private pageFacade: PageFacadeService, private locationService: LocationService) {
		this.filterForm = this.fb.group({
			pitchdeck_name: [""],
			country: [""],
			funding_type: [""],
			sector: [""],
		})
	}

	ngOnInit(): void {
		this.checkplanExpire()
		this.selectBoxValues()
		this.GetPersonalProfileData()
		this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
			this.imageWhiteLabelDomainName = data.source
		})
	}

	ngOnDestroy(): void {
		// Clean up blob URL if it exists
		if (this.pdfURL && this.pdfURL.startsWith("blob:")) {
			URL.revokeObjectURL(this.pdfURL)
		}
	}

	ngAfterViewInit() {
		if (this.pdfViewer && this.pdfURL) {
			this.pdfViewer.pdfSrc = this.pdfURL
			this.pdfViewer.refresh()
		}
	}

	GetPersonalProfileData() {
		this.userManagementService.GetUserPersonalInfo().subscribe((data) => {
			this.PersonalInfo = data
		})
	}

	bookmarkQuestion(courseId: any, isFav: any) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		isFav = isFav != "1" ? true : false
		this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1
		this.pitchDesk.bookmarkCourseData(courseId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
			let pitchListData = this.pitchDeskList.find((item: any) => item.id == courseId)
			isFav == true ? (pitchListData.favourite = 1) : (pitchListData.favourite = null)
			this.toast.add({
				severity: "success",
				summary: "Success",
				detail: response.message,
			})
		})
	}

	viewFav() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.viewFavourites = !this.viewFavourites
		this.getPitchDeskList()
	}

	getPitchDeskList() {
		let data: any
		if (this.viewFavourites) {
			data = {
				favourites: this.viewFavourites,
				page: this.page,
				perpage: this.pageSize,
			}
		} else {
			data = {
				country: this.filterForm.value.country ? this.filterForm.value.country : "",
				funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : "",
				sector: this.filterForm.value.sector ? this.filterForm.value.sector : "",
				page: this.page,
				perpage: this.pageSize,
				planname: this.currentPlan ? this.currentPlan : "",
			}
		}
		this.pitchDesk.getPitchDeskData(data).subscribe((responce) => {
			if (this.planExpired) {
				this.totalPitchDeckCount = 50
			} else this.totalPitchDeckCount = responce.total_count

			// Store the complete data for client-side filtering
			this.allPitchDeskData = responce.data

			this.pitchDeskList = responce.data.map((item: any) => ({
				...item,
				isChecked: this.selectAllCheckboxes ? 1 : 0,
			}))
			this.selectedCheckboxCount = this.selectAllCheckboxes ? this.pitchDeskList.length : 0
			this.exportCreditCount = responce.credit_count ? responce.credit_count : 0
			this.favCount = responce.fav_count

			// If there's a search term, filter the results
			if (this.valueNearYouFilter) {
				this.performSearch()
			}
		})
		this.isFilterVisible = "none"
	}

	selectBoxValues() {
		this.pitchDesk.getSelectBoxValues().subscribe((responce) => {
			this.countrySelectBox = responce.country
			this.fundingTypeSelectBox = responce.funding_type
			this.sectorSelectBox = responce.sectors
		})
	}

	pageChange(event: any) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.selectAllCheckboxes = false
		this.selectedCheckboxCount = 0
		this.page = event.page + 1
		this.pageSize = event.rows
		this.getPitchDeskList()
	}

	filterBy() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.isFilterVisible = "block"
	}

	clearFilter() {
		this.filterForm.reset()
		this.getPitchDeskList()
	}

	performSearch() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		const searchValue = this.valueNearYouFilter.trim().toLowerCase()

		if (!searchValue) {
			// If search is empty, show all data from our stored complete list
			this.pitchDeskList = this.allPitchDeskData.map((item) => ({
				...item,
				isChecked: this.selectAllCheckboxes ? 1 : 0,
			}))
			return
		}

		// Filter the stored data client-side
		this.pitchDeskList = this.allPitchDeskData
			.filter((item) => item.pitchdeck_name.toLowerCase().includes(searchValue) || item.funding_type_name?.toLowerCase().includes(searchValue) || item.sector_name?.toLowerCase().includes(searchValue) || item.country_name?.toLowerCase().includes(searchValue))
			.map((item) => ({
				...item,
				isChecked: this.selectAllCheckboxes ? 1 : 0,
			}))

		// Update the total count for pagination
		this.totalPitchDeckCount = this.pitchDeskList.length
	}

	closeGuidelines() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.showDiv = !this.showDiv
	}

	showPdf(url: any, pdname: string) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		// if (this.planExpired) {
		// 	this.restrict = true;
		// 	return;
		// }
		//
		this.pdfLoadError = false
		this.isPdfLoaded = true
		this.pdname = pdname

		if (!this.planExpired && this.exportCreditCount != 0) {
			this.isPdfDownloadOption = true
		} else {
			this.isPdfDownloadOption = false
		}

		// Get the PDF file as a blob
		this.pitchDesk.getPdfFile(url).subscribe(
			(pdfBlob: Blob) => {
				try {
					// Create a blob URL from the PDF blob
					this.pdfURL = URL.createObjectURL(pdfBlob)
					setTimeout(() => {
						if (this.pdfViewer) {
							this.pdfViewer.pdfSrc = this.pdfURL
							this.pdfViewer.refresh()
						}
					}, 100)
				} catch (error) {
					console.error("Error creating blob URL:", error)
					this.pdfLoadError = true
				}
			},
			(error) => {
				console.error("Error fetching PDF:", error)
				this.pdfLoadError = true
			}
		)
	}

	onError(error: any) {
		console.error("PDF loading error:", error)
		this.pdfLoadError = true
	}

	download(): void {
		const parts = this.pdfURL.split("/")
		const lastPart = parts[parts.length - 1]

		// Wrap the asynchronous operation in a Promise
		new Promise<void>((resolve) => {
			this.pitchDesk.downloadPdf(this.pdfURL, lastPart)
			resolve() // Resolve the Promise once the operation is complete
		})
			.then(() => {
				// After the PDF is downloaded, make the second API call
				if (this.exportCreditCount != 0) {
					let data = {
						module_id: 6,
					}
					this.pitchDesk.singleCreditReduce(data).subscribe(
						() => {
							// Both API calls completed successfully
							this.getPitchDeskList()
							if (!this.planExpired && this.exportCreditCount != 0) {
								this.isPdfDownloadOption = true
							} else {
								this.isPdfDownloadOption = false
							}
						},
						(error) => {
							// Handle errors from the second API call
							console.error("Error while downloading document:", error)
						}
					)
				}
			})
			.catch((error) => {
				// Handle errors from the first API call
				console.error("Error while reduce the credit:", error)
			})
	}

	goBack() {
		this.isPdfLoaded = false
	}

	checkplanExpire(): void {
		this.planExpired = this.authService.isInvalidSubscription('pitch_desk');
		this.getPitchDeskList()

	}

	buyCredits(): void {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.router.navigate(["/pages/export-credit"])
	}

	onCheckboxChange(event: any, item: any) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}

		const isChecked = event.target.checked
		item.isChecked = isChecked ? 1 : 0

		// Update selected count and check if all items are selected
		this.selectedCheckboxCount = this.pitchDeskList.filter((item) => item.isChecked === 1).length
		this.selectAllCheckboxes = this.pitchDeskList.length > 0 && this.pitchDeskList.every((item) => item.isChecked === 1)

		// Update export data IDs
		if (isChecked) {
			if (!this.exportDataIds.includes(item.id)) {
				this.exportDataIds.push(item.id)
			}
		} else {
			this.exportDataIds = this.exportDataIds.filter((id: number) => id !== item.id)
		}
	}

	selectAllCheckbox() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}

		// Update all items in the list immediately
		this.pitchDeskList.forEach((item) => {
			item.isChecked = this.selectAllCheckboxes ? 1 : 0
		})

		// Update counts and IDs
		this.selectedCheckboxCount = this.selectAllCheckboxes ? this.pitchDeskList.length : 0
		this.exportDataIds = this.selectAllCheckboxes ? this.pitchDeskList.map((item) => item.id) : []
	}

	exportData() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		} else if (this.exportCreditCount != 0) {
			this.exportDataIds = []
			this.pitchDeskList.forEach((item) => {
				if (item.isChecked == 1) {
					this.exportDataIds.push(item.id)
				}
			})
			if (this.exportDataIds.length == 0) {
				this.toast.add({ severity: "error", summary: "error", detail: "Select Some data for export!." })
				return
			}
			if (this.imageWhiteLabelDomainName === "uniprep" || this.imageWhiteLabelDomainName === "Partner") {
				if (this.exportCreditCount < this.exportDataIds.length) {
					this.toast.add({ severity: "error", summary: "error", detail: "insufficient credits.Please Buy Some Credits." })
					this.router.navigate(["/pages/export-credit"])
					return
				}
			} else {
				if (this.exportCreditCount < this.exportDataIds.length) {
					this.toast.add({ severity: "error", summary: "error", detail: "To download additional data beyond your free credits, please upgrade your plan." })
					this.authService.hasUserSubscription$.next(true);
					return
				}
			}
			let data = {
				module_id: 6,
				export_id: this.exportDataIds,
			}
			this.pitchDesk.exportSelectedData(data).subscribe((response) => {
				window.open(response.link, "_blank")
				this.selectAllCheckboxes = false
				this.selectedCheckboxCount = 0
				this.getPitchDeskList()
			})
		} else if (this.exportCreditCount == 0) {
			if (this.imageWhiteLabelDomainName === "uniprep" || this.imageWhiteLabelDomainName === "Partner") {
				this.toast.add({ severity: "error", summary: "error", detail: "Please Buy Some Credits." })
				this.router.navigate(["/pages/export-credit"])
			} else {
				this.authService.hasUserSubscription$.next(true);
			}
		}
	}

	openReport() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		let data = {
			isVisible: true,
			reporttype: 7,
			moduleId: 7,
			report_mode: "other_module",
		}
		this.dataService.openReportWindow(data)
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
}
