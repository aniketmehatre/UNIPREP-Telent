import { Component, OnInit } from "@angular/core"
import { CareerGrowthService } from "./career-growth-checker.service"
import { Router } from "@angular/router"
import { debounceTime, switchMap, distinctUntilChanged, catchError, map } from "rxjs/operators"
import { Observable, of } from "rxjs"
import { FormBuilder, FormGroup } from "@angular/forms"
import { AuthService } from "src/app/Auth/auth.service"
import { LocationService } from "src/app/location.service"
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
interface JobRole {
	id: number
	jobrole: string
}

interface JobDetail {
	id: number
	job_role_id: number
	pointer_job_role: string
	country: number
	roles_resp: string
	skills: string
	experience: string
	salary: string
	india_salary: string
	status: number
	created_at: string
	updated_at: string | null
	jobrole: string
	slug: string
	forCG: number
	rolesArray?: string[]
	skillsArray?: string[]
}

interface Country {
	id: number
	country: string
	alt_name: string | null
	country_code: string
	country_flag: string
	scholarship_visibility: number
	status: number
	created_at: string
	updated_at: string
}

@Component({
	selector: "uni-career-growth-checker",
	templateUrl: "./career-growth-checker.component.html",
	styleUrls: ["./career-growth-checker.component.scss"],
	standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class CareerGrowthCheckerComponent implements OnInit {
	constructor(private careerGrowthService: CareerGrowthService, private router: Router, private fb: FormBuilder, private authService: AuthService, private locationService: LocationService) {}

	options: JobRole[] = []
	jobDetails: JobDetail[] = []
	allOptions: JobRole[] = []
	countries: Country[] = []
	hasfilteredoptions: boolean = false
	filteredOptions: JobRole[] = []
	searchTerm: string = ""
	fromCountry: any
	showSearch: boolean = true
	showResult: boolean = false
	roleDetails: any = []
	selectedCountryId: string | null = null
	checkForm: FormGroup
	selectedJobId: string | null = null
	currentrole: string | null = null
	invalidClass: boolean = false
	invalidClassCountry: boolean = false
	hasFilteredOptions: boolean = false
	isSelecting: boolean = false

	ngOnInit(): void {
		this.locationService.getImage().subscribe((imageUrl) => {
			this.orglogowhitelabel = imageUrl
		})
		this.locationService.getOrgName().subscribe((orgname) => {
			this.orgnamewhitlabel = orgname
		})
		this.imagewhitlabeldomainname = window.location.hostname
		if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
			this.ehitlabelIsShow = true
		} else {
			this.ehitlabelIsShow = false
		}
		this.checkForm = this.fb.group({
			jobSearch: [""],
			country: [""],
		})
		this.showSearch = true
		this.showResult = false
		var data = {
			role: "",
		}

		this.careerGrowthService.getCountries().subscribe((data) => {
			const desiredCountries = ["United States", "United Kingdom", "China", "Norway", "Germany", "France", "Singapore", "Switzerland", "United Arab Emirates", "Spain", "Ireland", "Australia", "New Zealand", "Canada", "Netherlands", "Austria", "Belgium", "Czech Republic", "Denmark", "Estonia", "Finland", "Hungary", "Italy", "Latvia", "Lithuania", "Malta", "Poland", "Portugal", "Sweden", "Japan"]
			const countriesList: Country[] = data.countries_list

			this.countries = countriesList.filter((country) => desiredCountries.includes(country.country))
		})

		this.checkForm
			.get("jobSearch")
			?.valueChanges.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				switchMap((value: string) => {
					if (this.isSelecting) {
						return []
					}

					const query = value.toLowerCase().trim()

					if (query && query.length > 3) {
						return this.fetchJobRoles(query).pipe(
							map((res: any) => {
								if (res && res.data && Array.isArray(res.data)) {
									// Filter and sort the job roles based on priority
									return res.data.sort((a: any, b: any) => {
										const aJob = a.jobrole.toLowerCase()
										const bJob = b.jobrole.toLowerCase()

										if (aJob === query && bJob !== query) {
											return -1 // Exact match for a
										} else if (aJob !== query && bJob === query) {
											return 1 // Exact match for b
										} else if (aJob.startsWith(query) && !bJob.startsWith(query)) {
											return -1 // a starts with query
										} else if (!aJob.startsWith(query) && bJob.startsWith(query)) {
											return 1 // b starts with query
										} else {
											return 0 // Keep original order
										}
									})
								}
								return []
							})
						)
					} else {
						return []
					}
				})
			)
			.subscribe(
				(filteredResults: any[]) => {
					this.filteredOptions = filteredResults
					this.hasFilteredOptions = this.filteredOptions.length > 0
				},
				(err) => {
					console.error("Error fetching job roles:", err)
					this.filteredOptions = []
					this.hasFilteredOptions = false
				}
			)
		this.checkplanExpire()
	}

	fetchJobRoles(searchTerm: string): Observable<any[]> {
		if (!searchTerm) {
			this.filteredOptions = []
			this.hasFilteredOptions = false
			return of([])
		}

		return this.careerGrowthService.JobRoles({ jobrole: searchTerm }).pipe(
			catchError(() => {
				return of([])
			})
		)
	}

	selectOption(option: any) {
		this.isSelecting = true
		this.checkForm.get("jobSearch")?.setValue(option.jobrole)
		this.selectedJobId = option.id
		this.hasFilteredOptions = false
	}

	// filterOptions(searchTerm: string): void {
	//   const term = searchTerm.trim().toLowerCase();
	//   this.filteredOptions = this.allOptions.filter(op =>
	//     op.jobrole.toLowerCase().includes(term)
	//   );
	//   this.hasFilteredOptions = this.filteredOptions.length > 0;
	// }

	// onInputChange(event: Event) {
	//   const inputElement = event.target as HTMLInputElement;
	//   this.filterOptions(inputElement.value);
	// }

	search() {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		const jobSearchValue = this.checkForm.value.jobSearch

		const isValidJobRole = this.filteredOptions.some((option) => option.jobrole === jobSearchValue)

		if (!isValidJobRole) {
			this.invalidClass = true
			return
		} else {
			this.invalidClass = false
		}

		const countryId = this.checkForm.get("country")?.value
		this.currentrole = this.checkForm.get("jobSearch")?.value
		if (countryId) {
			var data = {
				roleId: this.selectedJobId,
				country: countryId,
			}
			this.invalidClassCountry = false
			this.careerGrowthService.GetProgressionDetails(data).subscribe((res) => {

			 
				if (res.progressionNames != null) {
					this.showSearch = false
					this.showResult = true
					this.roleDetails = res.progressionNames
					this.jobDetails = res.details
					for (const group of this.jobDetails) {
						const detail: JobDetail = group
						const parsedRolesResp = group.roles_resp.split(",").map((item) => item.trim())
						detail.rolesArray = parsedRolesResp
						const parsedSkills = detail.skills.split(",").map((item) => item.trim())
						detail.skillsArray = parsedSkills
					}
				} else {
					this.showSearch = true
					this.showResult = false
				}
			})
		} else {
			this.invalidClassCountry = true
			return
		}
	}

	getJobTypeId(jobRole: string): number | null {
		const jobType = this.allOptions.find((option) => option.jobrole.toLowerCase() === jobRole.toLowerCase())
		return jobType ? jobType.id : null
	}

	scrollToCareerProgression(index: number) {
		const element = document.getElementById(`career-progress-${index}`)

		if (!element) {
			console.warn(`Element with ID career-progress-${index} not found.`)
			return
		}

		const headerOffset = document.querySelector(".fixed-header")?.clientHeight || 0

		element.scrollIntoView({ behavior: "smooth", block: "end" })
	}
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
	planExpired: boolean = false
	restrict: boolean = false
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
}
