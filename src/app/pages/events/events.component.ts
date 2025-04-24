import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { EventsService } from "./events.service"
import { DatePipe } from "@angular/common"
import { MessageService } from "primeng/api"
import { AuthService } from "src/app/Auth/auth.service"
import { Router, RouterModule } from "@angular/router"
import { PageFacadeService } from "../page-facade.service"
import { LocationService } from "src/app/location.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputTextModule } from "primeng/inputtext"
import { SelectModule } from "primeng/select"
import { MultiSelectModule } from 'primeng/multiselect';
import { RestrictionDialogComponent } from "src/app/shared/restriction-dialog/restriction-dialog.component"

interface country {
	id: number
	country: string
	flag: string
	status: number
	created_at: string
	updated_at: string
}
// Custom validator function
const dateRangeValidator: any = (control: FormGroup): ValidationErrors | null => {
	const fromDate = control.get("from")?.value
	const toDate = control.get("to")?.value

	// Check if either both dates are selected or none of them is selected
	if ((fromDate && !toDate) || (!fromDate && toDate)) {
		return { dateRange: "Please select both From date and To date." }
	}

	return null
}
@Component({
	selector: "uni-events",
	templateUrl: "./events.component.html",
	styleUrls: ["./events.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, FormsModule, ReactiveFormsModule, SelectModule, MultiSelectModule, InputGroupModule, InputGroupAddonModule, InputTextModule, RestrictionDialogComponent],
})
export class EventsComponent implements OnInit {
	activeButton: number = 1
	upcomingevent: boolean = false
	postevent: boolean = false
	newfile = "none"
	countries: country[] = []
	filterform: FormGroup
	perpage: number = 10
	totalcount: number = 0
	totalcountpost: number = 0
	pageno: number = 1
	upcommingevent: any[] = []
	postevetdetaisl: any[] = []
	valueNearYouFilter: string | undefined
	selectedCountryId: any
	planExpired!: boolean
	restrict: boolean = false
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
	constructor(private fb: FormBuilder, private service: EventsService, private datePipe: DatePipe, private toast: MessageService, private authService: AuthService, private router: Router, private pageFacade: PageFacadeService, private locationService: LocationService) {
		this.filterform = this.fb.group(
			{
				from: [""],
				to: [""],
				country: [""],
			},
			{ validator: dateRangeValidator }
		)
	}
	ngOnInit(): void {
		this.setActiveButton(this.activeButton)
		this.locationService.getCountry().subscribe((response) => {
			this.countries = response
		})
		let data = {
			perpage: 10,
			page: 1,
		}
		this.getEventUpComming(data)
		let postdata = {
			perpage: 10,
			page: 1,
		}
		this.getPostEvent(postdata)
		this.checkplanExpire()
	}

	// Button styles
	button1Style = {
		"background-color": "#FFFFFF",
		border: "1px solid var(--uniprep-primary)",
		color: "#000000",
	}

	button2Style = {
		"background-color": "#FFFFFF",
		border: "1px solid var(--uniprep-primary)",
		color: "#000000",
	}

	setActiveButton(buttonNumber: number): void {
		this.filterform.reset()
		// Reset styles for both buttons
		this.button1Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}

		this.button2Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}

		// Set styles for the clicked button
		if (buttonNumber === 1) {
			this.activeButton = 1
			this.upcomingevent = true
			this.postevent = false
			this.button1Style = {
				"background-color": "var(--uniprep-primary)",
				border: "1px solid var(--uniprep-primary)",
				color: "#FFFFFF",
			}
		} else if (buttonNumber === 2) {
			this.activeButton = 2
			this.postevent = true
			this.upcomingevent = false
			this.button2Style = {
				"background-color": "var(--uniprep-primary)",
				border: "1px solid var(--uniprep-primary)",
				color: "#FFFFFF",
			}
		}
	}

	// pop up closing
	closenewfilePopup() {
		this.newfile = "none"
	}
	// filterpop-up
	filterPopUp() {
		// this.setActiveButton(1)
		if (this.planExpired) {
			this.restrict = true
			return
		}
		this.newfile = "block"
	}
	paginate(event: any) {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		this.pageno = event.page + 1
		this.perpage = event.rows
		let data = {
			perpage: this.perpage,
			page: event.page + 1,
			to: this.filterform.value.to,
			from: this.filterform.value.from,
			country: this.filterform.value.country,
			nearby_search: this.valueNearYouFilter,
		}
		this.getEventUpComming(data)
	}
	paginatepost(event: any) {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		this.pageno = event.page + 1
		this.perpage = event.rows
		let data = {
			perpage: this.perpage,
			page: event.page + 1,
			nearby_search: this.valueNearYouFilter,
			country: this.filterform.value.country,
		}
		this.getPostEvent(data)
	}
	getEventUpComming(data: any) {
		this.service.getupcommingevent(data).subscribe((res) => {
			this.upcommingevent = []
			res.events.forEach((list: any) => {
				var bindingdata = {
					id: list.id,
					eventname: list.eventname,
					companylogo: list.companylogo,
					speakername: list.speakername,
					designation: list.designation,
					eventlink: list.eventlink,
					date: this.datechang(list.date),
					country: list.countryName,
					from: this.timeformatchange(list.from),
					to: this.timeformatchange(list.to),
					eventdescription: list.eventdescription,
					countrylog: list.countryFlag,
					daysago: list.remainingTime,
					registered: list.registered,
					registerusercount: list.registered_users_count,
					slotno: list.eventslots,
				}
				this.upcommingevent.push(bindingdata)
			})
			this.totalcount = res.count
		})
	}
	// format changing contact
	datechang(originalDate: any) {
		return this.datePipe.transform(originalDate, "dd MMM yy")
	}
	formattedTime: any
	timeformatchange(originalTime: any) {
		const timeArray = originalTime.split(":")
		const date = new Date()
		date.setHours(parseInt(timeArray[0], 10))
		date.setMinutes(parseInt(timeArray[1], 10))
		date.setSeconds(parseInt(timeArray[2], 10))

		// Format the Date object as "10 AM" using Angular's DatePipe
		return this.datePipe.transform(date, "h:mm a")
	}
	filtersubmit() {
		const formData = this.filterform.value
		if (!formData.to && !formData.from && !formData.country) {
			this.toast.add({ severity: "error", summary: "Error", detail: "Please make sure you have some filter!" })
			return
		}
		this.newfile = "none"
		var data = {
			to: this.filterform.value.to,
			from: this.filterform.value.from,
			country: this.filterform.value.country,
			page: 1,
			perpage: 10,
		}
		this.getEventUpComming(data)
		this.getPostEvent(data)
	}
	// post event
	getPostEvent(data: any) {
		this.service.postevets(data).subscribe((res) => {
			this.postevetdetaisl = []
			this.totalcountpost = 0
			res.events.forEach((list: any) => {
				var bindingdata = {
					id: list.id,
					eventname: list.eventname,
					companylogo: list.companylogo,
					speakername: list.speakername,
					designation: list.designation,
					eventlink: list.eventlink,
					date: this.datechang(list.date),
					country: list.countryName,
					from: this.timeformatchange(list.from),
					to: this.timeformatchange(list.to),
					eventdescription: list.eventdescription,
					countrylog: list.countryFlag,
					registerusercount: list.registered_users_count,
				}
				this.postevetdetaisl.push(bindingdata)
			})
			this.totalcountpost = res.count
		})
	}

	performSearch(events: any) {
		if (this.planExpired) {
			this.restrict = true
			this.valueNearYouFilter = ""
			return
		}
		var data = {
			nearby_search: this.valueNearYouFilter,
		}
		this.getEventUpComming(data)
		this.getPostEvent(data)
	}
	registerButton(event: any) {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		if (event.registered == 1) {
			this.toast.add({ severity: "error", summary: "Error", detail: "Already Registered" })
			return
		}
		var data = {
			id: event.id,
		}
		this.service.registered(data).subscribe(
			(response) => {
				this.toast.add({ severity: "success", summary: "Success", detail: response.message })
				this.ngOnInit()
			},
			(error) => {
				this.toast.add({ severity: "error", summary: "Error", detail: error.message })
			}
		)
	}
	goingEventLink(eventlink: any) {
		window.open(eventlink)
	}

	checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			let data = res.time_left
			let subscription_exists_status = res.subscription_details
			if (data.plan === "expired" || data.plan === "subscription_expired" || subscription_exists_status.subscription_plan === "free_trail") {
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
		let searchInput = document.getElementById("searchInput") as HTMLInputElement
		if (searchInput !== null) {
			searchInput.disabled = false
		}
	}
	searchClick() {
		if (this.planExpired) {
			this.restrict = true
			this.valueNearYouFilter = ""
			let searchInput = document.getElementById("searchInput") as HTMLInputElement
			if (searchInput !== null) {
				searchInput.disabled = true
			}
		}
	}
	resetFilter() {
		this.filterform.reset()
		let data = {
			perpage: 10,
			page: 1,
			country: this.filterform.value.country,
			to: this.filterform.value.to,
			from: this.filterform.value.from,
			nearby_search: this.valueNearYouFilter,
		}
		this.getPostEvent(data)
		this.getEventUpComming(data)
		this.newfile = "none"
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
}
