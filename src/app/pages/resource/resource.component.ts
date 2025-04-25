import { Component, OnInit } from "@angular/core"
import { ResourceService } from "./resource.service"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { MessageService } from "primeng/api"
import { AuthService } from "src/app/Auth/auth.service"
import { Router } from "@angular/router"
import { PageFacadeService } from "../page-facade.service"
import { LocationService } from "../../location.service"
import { CommonModule } from "@angular/common"
import { MultiSelectModule } from "primeng/multiselect"
import { DialogModule } from "primeng/dialog"
import { SkeletonModule } from "primeng/skeleton"
interface country {
	id: number
	country: string
	flag: string
	status: number
	created_at: string
	updated_at: string
}

@Component({
	selector: "uni-resource",
	templateUrl: "./resource.component.html",
	styleUrls: ["./resource.component.scss"],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MultiSelectModule, DialogModule, SkeletonModule],
})
export class ResourceComponent implements OnInit {
	filterform: FormGroup
	newfile = "none"
	countries: country[] = []
	planExpired!: boolean
	showSkeleton: boolean = false

	constructor(private fb: FormBuilder, private resourceService: ResourceService, private toast: MessageService, private locationService: LocationService, private authService: AuthService, private pageFacade: PageFacadeService, private router: Router) {
		this.filterform = this.fb.group({
			coutryname: [""],
		})
	}

	resources: any = []
	resourceslist: any = []
	selectedCountryId: any
	loopRange = Array.from({ length: 20 })
		.fill(0)
		.map((_, index) => index)

	ngOnInit(): void {

		this.locationService.getCountry().subscribe((response) => {
			this.countries = response
		})
		let data = {
			coutryname: this.filterform.value.coutryname,
		}
		this.getResources(data)
		this.checkplanExpire()
	}
	getResources(data: any) {
		this.resourceService.getResources(data).subscribe((response: any) => {
			this.resourceslist = []
			this.resourceslist = response.resources
			this.showSkeleton = false
		})
		this.showSkeleton = true
	}
	getCountryName(flag: string): string {
		const countryNames = this.resourceslist.map((resource: { countryName: string }) => resource.countryName.split(",")).flat()
		const flags = this.resourceslist.map((resource: { countryFlag: string }) => resource.countryFlag.split(",")).flat()

		const flagIndex = flags.findIndex((f: string) => f.trim() === flag.trim())
		return flagIndex !== -1 ? countryNames[flagIndex].trim() : ""
	}
	filtersubmit() {
		const formData = this.filterform.value

		if (!formData.coutryname == null) {
			this.toast.add({ severity: "error", summary: "Error", detail: "Please make sure you have some filter!" })
			return
		}
		let data = {
			coutryname: this.filterform.value.coutryname,
		}
		this.newfile = "none"
		this.getResources(data)
	}
	closenewfilePopup() {
		this.newfile = "none"
	}
	// filterpop-up
	filterPopUp() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.newfile = "block"
	}
	onLocationSelect(event: any) {
		// Clear the array and add the newly selected city
		if (event!.value.includes(0)) {
			this.filterform.get("coutryname")!.setValue([0])
		}
	}
	checkplanExpire(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
	}

	canSeeResources() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
	}
	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
}
