import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AuthService } from "../../Auth/auth.service"
import { LocationService } from "../../location.service"
import { MessageService } from "primeng/api"
import { User } from "../../@Models/user.model"
import { UserManagementService } from "./user-management.service"
import { SubSink } from "subsink"
import { Router, RouterModule } from "@angular/router"
import { DashboardService } from "../dashboard/dashboard.service"
import { DataService } from "../../data.service"
import { Location } from "@angular/common"
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
import { SelectModule } from "primeng/select"
import { DialogModule } from "primeng/dialog"
import { CardModule } from "primeng/card"
import { InputNumberModule } from "primeng/inputnumber"
import {StorageService} from "../../storage.service";
@Component({
	selector: "uni-user-management",
	templateUrl: "./user-management.component.html",
	styleUrls: ["./user-management.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DialogModule, CardModule, InputNumberModule],
	providers: [UserManagementService],
})
export class UserManagementComponent implements OnInit {
	user!: User | null
	genderList = [
		{ name: "Select", code: "" },
		{ name: "Male", code: "M" },
		{ name: "Female", code: "F" },
		{ name: "Others", code: "O" },
	]
	locationList: any
	programlevelList: any[] = []
	today = new Date()
	submitted = false
	registrationForm!: FormGroup
	countryList: any
	intrestedCountryList: any
	currentDate = new Date()
	dateTime = new Date()
	maximumTime = new Date()
	selectedDate: any

	updatedpasswords: FormGroup
	ShowCrntPass: boolean = false
	CrntPass: string = "password"
	ShowNewPass: boolean = false
	NewPass: string = "password"
	ShowCnfrmPass: boolean = false
	CnfrmPass: string = "password"
	ShowPersonalInfo: boolean = false
	PasswordDivShow: boolean = false
	PasswordSubmitted = false
	newsLetter: boolean = false
	PersonalInfo: any = []
	tooltipContent: string = "<strong>Complete your Profile</strong><br><div class='text-center mt-1 mb-1'><small>update your profile details for more<br>personalized results in our Portal</small></div>"
	hideToolTip: boolean = true

	private subs = new SubSink()
	constructor(private authService: AuthService, private formBuilder: FormBuilder,
				private locationService: LocationService, private toast: MessageService,
				private dataService: DataService, private dashboardService: DashboardService,
				private userManagementService: UserManagementService, private router: Router,
				private _location: Location, private storage: StorageService,) {
		this.registrationForm = this.formBuilder.group({
			name: ["", [Validators.required]],
			location_id: ["", [Validators.required]],
			phone: ["", [Validators.required]],
			// email: ['', [Validators.required, Validators.email]],
			interested_country_id: [""],
			home_country: ["", [Validators.required]],
			last_degree_passing_year: [""],
			intake_year_looking: [""],
			intake_month_looking: [""],
			programlevel_id: [""],

			// gender: ['', [Validators.required]],
		})

		this.updatedpasswords = this.formBuilder.group({
			current_password: ["", [Validators.required]],
			new_password: ["", [Validators.required]],
			confirm_password: ["", [Validators.required]],
		})
	}

	get f() {
		return this.registrationForm.controls
	}

	get updatepassword() {
		return this.updatedpasswords.controls
	}

	goBack() {
		this._location.back()
	}

	ngOnInit(): void {
		this.dateTime.setDate(this.dateTime.getDate())

		this.getProgramLevelList()
		this.getCountryList()
		this.getIntrestedCountryList()
		this.authService.userData.subscribe((data) => {
			if (data) {
				this.user = data
				let mon = this.getMonthName(this.user?.intake_month_looking)
				this.newsLetter = this.user.newsletter_consent == 1 ? true : false
				// this.registrationForm = this.formBuilder.group({
				//     name: [this.user?.name, [Validators.required]],
				//     location_id: [this.user?.location_id, [Validators.required]],
				//     phone: [this.user?.phone, [Validators.required]],
				//     email: [this.user?.email, [Validators.required, Validators.email]],
				//     interested_country_id: [Number(this.user?.interested_country_id), [Validators.required]],
				//     home_country: [Number(this.user?.country), [Validators.required]],
				//     last_degree_passing_year: [this.user?.last_degree_passing_year, [Validators.required]],
				//     intake_year_looking: [this.user?.intake_year_looking, [Validators.required]],
				//     intake_month_looking: [new Date(mon+"/"+this.user?.intake_year_looking), [Validators.required]],
				//     programlevel_id: [this.user?.programlevel_id, [Validators.required]],
				//     gender: [this.user?.gender, [Validators.required]],
				//     // newsletter_consent: [this.user?.newsletter_consent == 1 ? true : false, [Validators.required]],
				// });
			}
		})
		this.GetPersonalProfileData()
		setTimeout(() => {
			this.hideToolTip = false
		}, 10000)
	}
	GetPersonalProfileData() {
		this.userManagementService.GetUserPersonalInfo().subscribe((data) => {
			this.PersonalInfo = data
			//  let mon = this.PersonalInfo?.intake_month_looking == null ? null : this.getMonthName(this.PersonalInfo?.intake_month_looking);
			this.registrationForm.patchValue({
				name: this.PersonalInfo?.name,
				location_id: this.PersonalInfo?.location_id,
				interested_country_id: this.PersonalInfo?.interested_country_id == null ? null : Number(this.PersonalInfo?.interested_country_id),
				home_country: this.PersonalInfo?.home_country_id == null ? null : Number(this.PersonalInfo?.country),
				last_degree_passing_year: this.PersonalInfo?.last_degree_passing_year,
				intake_year_looking: this.PersonalInfo?.intake_year_looking,
				intake_month_looking: this.PersonalInfo?.intake_month_looking,
				programlevel_id: this.PersonalInfo?.programlevel_id,
				phone: this.PersonalInfo?.phone,
			})
			this.selectedDate = new Date()
			this.selectedDate.setFullYear(this.registrationForm.get("intake_year_looking")?.value)
			this.selectedDate.setMonth(this.registrationForm.get("intake_month_looking")?.value)
			this.GetLocationList()
			this.registrationForm.get("intake_month_looking")?.setValue(this.registrationForm.get("intake_month_looking")?.value || this.registrationForm.get("intake_month_looking")?.value == 0 ? this.selectedDate : "")
			var selectedYear = this.registrationForm.get("intake_year_looking")?.value

			this.maximumTime.setFullYear(selectedYear)
			this.maximumTime.setMonth(11)
			if (this.currentDate.getFullYear() != selectedYear) {
				this.dateTime = new Date(selectedYear, 0, 1)
			} else {
				this.dateTime.setFullYear(selectedYear)
			}
		})
	}

	getMonthName(monthNumber: any) {
		const date = new Date()
		date.setMonth(monthNumber - 1)
		return date.toLocaleString("en-US", { month: "long" })
	}

	getMonthNumberFromName(monthName: any) {
		const year = new Date().getFullYear()
		return new Date(`${monthName} 1, ${year}`).getMonth() + 1
	}
	// using get location
	// test command
	GetLocationList() {
		if (this.registrationForm.get("home_country")?.value == 122) {
			this.locationService.getLocation().subscribe(
				(res: any) => {
					this.locationList = res
				},
				(error: any) => {
					this.toast.add({
						severity: "warning",
						summary: "Warning",
						detail: error.error.message,
					})
				}
			)
		} else {
			this.locationList = [{ id: 0, district: "Others" }]
			this.registrationForm?.get("location_id")?.setValue(0)
		}
	}

	getProgramLevelList() {
		this.authService.getProgramLevel().subscribe((response) => {
			this.programlevelList = response
		})
	}

	getCountryList() {
		this.locationService.getHomeCountry(2).subscribe(
			(res: any) => {
				this.countryList = res.filter((country: any) => country.id === 122)
			},
			(error: any) => {}
		)
	}
	getIntrestedCountryList() {
		this.locationService.getCountry().subscribe(
			(res: any) => {
				this.intrestedCountryList = res
			},
			(error: any) => {}
		)
	}

	yearChage(event: any) {
		this.registrationForm.get("intake_month_looking")?.setValue("")
		// this.registrationForm?.get('intake_month_looking')?.setValue(event);
		let intakeYearValue = this.registrationForm.get("intake_year_looking")?.value

		let intakeYear = intakeYearValue.toString().split(" ")[3]
		this.maximumTime.setFullYear(intakeYear)

		this.maximumTime.setMonth(11)
		if (this.dateTime.getFullYear() != intakeYear && this.currentDate.getFullYear() != intakeYear) {
			this.dateTime = new Date(intakeYear, 0, 1)
		} else {
			this.dateTime = new Date(intakeYear, this.currentDate.getMonth(), 1)
		}
	}

	logout() {
		this.locationService.sessionEndApiCall().subscribe((data: any) => {})
		this.authService.logout().subscribe((data) => {
			this.toast.add({
				severity: "info",
				summary: "Info",
				detail: "logged out successfully",
			})
			window.sessionStorage.clear()
			localStorage.clear()
			this.router.navigateByUrl("/login")
		})
	}

	onClickSubscribe() {
		this.subs.sink = this.userManagementService.GetPaidSubscriptionDetails().subscribe((data) => {
			if (data.includes(1)) {
				this.router.navigate(["/pages/subscriptions"])
			} else {
				this.router.navigate(["/pages/subscriptions"])
			}
		})
	}

	onSubmit() {
		this.submitted = true
		if (this.registrationForm.invalid) {
			return
		}
		var data: any = {
			userId: this.PersonalInfo?.user_id,
			name: this.registrationForm.value?.name,
			location_id: this.registrationForm.value?.location_id,
			interested_country_id: this.registrationForm.value?.interested_country_id == null ? "" : this.registrationForm.value?.interested_country_id,
			programlevel_id: this.registrationForm.value?.programlevel_id,
			home_country: this.registrationForm.value?.home_country,
			phone: this.registrationForm.value?.phone,
		}

		this.intrestedCountryList.forEach((element: any) => {
			if (element.id == this.registrationForm.value?.interested_country_id) {
				this.storage.set("countryId", element.id)
				this.dataService.changeCountryId(element.id)
				this.dataService.changeCountryName(element.country)
				this.dataService.changeCountryFlag(element.flag)
			}
		})
		if (this.registrationForm.value?.last_degree_passing_year == null) {
			data.last_degree_passing_year = ""
		} else if (typeof this.registrationForm.value?.last_degree_passing_year == "string") {
			data.last_degree_passing_year = this.registrationForm.value?.last_degree_passing_year
		} else {
			data.last_degree_passing_year = this.registrationForm.value?.last_degree_passing_year?.getFullYear()
		}
		if (this.registrationForm.value?.intake_year_looking == null) {
			data.intake_year_looking = ""
		} else if (typeof this.registrationForm.value?.intake_year_looking == "string") {
			data.intake_year_looking = this.registrationForm.value?.intake_year_looking
		} else {
			data.intake_year_looking = this.registrationForm.value?.intake_year_looking?.getFullYear()
		}
		if (this.registrationForm.value?.intake_month_looking == null) {
			data.intake_month_looking = ""
		} else if (typeof this.registrationForm.value?.intake_month_looking == "string") {
			data.intake_month_looking = this.registrationForm.value?.intake_month_looking
		} else {
			data.intake_month_looking = this.registrationForm.value?.intake_month_looking?.getMonth()
		}
		delete this.registrationForm.value.phone
		this.userManagementService.updateUserData(data).subscribe(
			(data) => {
				this.ShowPersonalInfo = false
				this.authService?.getMe().subscribe((item) => {})
				this.GetPersonalProfileData()
				this.toast.add({ severity: "success", summary: "Success", detail: "Successfully Updated" })
			},
			(error) => {
				this.toast.add({ severity: "error", summary: "Error", detail: error.message })
				this.ShowPersonalInfo = true
				return
			}
		)
	}

	UserUpdatePassword(updatedpasswords: any) {
		let data = this.updatedpasswords.value
		this.PasswordSubmitted = true
		if (this.updatedpasswords.invalid) {
			return
		}
		this.subs.sink = this.userManagementService.CompareUserPassword(data).subscribe((passwordconfirmation) => {
			if (passwordconfirmation.severity == "success") {
				this.updatedpasswords.patchValue({
					current_password: "",
					new_password: "",
					confirm_password: "",
				})
			}
			return this.toast.add({ severity: passwordconfirmation.severity, summary: "Success", detail: passwordconfirmation.message })
		})
		this.PasswordSubmitted = false
	}

	ShowCurrentPassword() {
		if (this.ShowCrntPass == true) {
			this.ShowCrntPass = false
			this.CrntPass = "password"
		} else {
			this.ShowCrntPass = true
			this.CrntPass = "text"
		}
	}

	ShowNewPassword() {
		if (this.ShowNewPass == true) {
			this.ShowNewPass = false
			this.NewPass = "password"
		} else {
			this.ShowNewPass = true
			this.NewPass = "text"
		}
	}

	ShowConfirmPassword() {
		if (this.ShowCnfrmPass == true) {
			this.ShowCnfrmPass = false
			this.CnfrmPass = "password"
		} else {
			this.ShowCnfrmPass = true
			this.CnfrmPass = "text"
		}
	}

	// EditPageShowAndHide(mode:string){
	//     if(mode == "Edit"){
	//         this.ShowPersonalInfo = true;
	//     }else{
	//         this.ShowPersonalInfo = false;
	//     }
	// }

	NewsLetterUpdate(e: any) {
		let isChecked = e.checked == true ? 1 : 0
		let OnOrOff = isChecked == 1 ? "On" : "Off"
		this.subs.sink = this.userManagementService.UpdateNewsLetter(isChecked).subscribe((data) => {
			return this.toast.add({ severity: "success", summary: "Success", detail: "Notification Turned " + OnOrOff + " successfully." })
		})
	}

	ShowPasswordDiv() {
		if (this.PasswordDivShow == true) {
			this.PasswordDivShow = false
		} else {
			this.PasswordDivShow = true
		}
	}

	changeLocation(event: any) {
		const selectedCountry = this.countryList.find((country: any) => country.id === event.value)
		if (selectedCountry) {
			console.log(selectedCountry.flag)
			this.dataService.changeHomeCountryFlag(selectedCountry.flag)
		}
		this.GetLocationList()
	}

	formatPhoneNumber(countryCode: string, phone: string): string {
		if (!countryCode || !phone) return '';

		// Ensure country code starts with +
		let formattedCode = countryCode.startsWith('+') ? countryCode : '+' + countryCode;

		return `${formattedCode} ${phone}`;  // Space between country code and number
	}
}
