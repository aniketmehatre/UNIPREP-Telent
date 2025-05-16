import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { matchValidator } from "src/app/@Supports/matchvalidator"
import { LocationService } from "src/app/location.service"
import { AuthService } from "../auth.service"
import { MessageService } from "primeng/api"
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from "ngx-intl-tel-input"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { SubSink } from "subsink"
import { FluidModule } from "primeng/fluid"
import { CommonModule } from "@angular/common"
import { PasswordModule } from "primeng/password"
import { InputTextModule } from "primeng/inputtext"
import { InputIconModule } from "primeng/inputicon"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputOtpModule } from "primeng/inputotp"
import { ToastModule } from "primeng/toast"
import { SelectModule } from "primeng/select"
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, } from '@abacritt/angularx-social-login';
import { ButtonDirective } from "primeng/button";

@Component({
	selector: "app-registration",
	templateUrl: "./registration.component.html",
	styleUrls: ["./registration.component.scss"],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CommonModule, InputOtpModule, FluidModule, PasswordModule, RouterModule, InputTextModule,
		InputIconModule, InputGroupModule, InputGroupAddonModule, SocialLoginModule, FormsModule,
		ReactiveFormsModule, ToastModule, SelectModule, NgxIntlTelInputModule, GoogleSigninButtonModule, ButtonDirective],
})
export class RegistrationComponent implements OnInit {
	@ViewChild("otp1") otp1!: ElementRef
	@ViewChild("otp2") otp2!: ElementRef
	@ViewChild("otp3") otp3!: ElementRef
	@ViewChild("otp4") otp4!: ElementRef

	public registrationForm: any = FormGroup
	genderList: any
	intakeYearLooking: any
	displayTerms = "none"
	locationList: any
	countryList: any
	programLevelList: any
	intrestedCountryList: any
	countryCodes: any
	currentLocationCountry: string = ""
	currentLocationCity: string = ""
	currentLocationState: string = ""

	public otpForm: any = FormGroup
	public emailOTPForm: any = FormGroup

	// isMobileOTPSend: boolean = false
	// isMobileOTPValidated: boolean = false
	isEmailOTPSend: boolean = false
	isEmailOTPValidated: boolean = false
	isRemainingFieldVisible: boolean = false
	password: any
	preferredCountry: any
	show = false
	showConfirm = false
	confirmPassword: any

	// resent timer
	resendTime = 1
	startTimer = 0
	interval: any
	showContactErrorIcon: boolean = false
	showEmailErrorIcon: boolean = false
	validNumberRequired: boolean = false
	registerFormInvalid: boolean = true

	separateDialCode = false
	SearchCountryField = SearchCountryField
	CountryISO = CountryISO
	preferredCountries: CountryISO[] = [CountryISO.India]
	// isMobileOTPEdit: boolean = false
	imageUrlWhitelabel: string | null = null
	// domainnamecondition:any;
	// domainname:any;
	showPassword: boolean = false
	otpValue: string = ""
	otpError: boolean = false

	homeCountryList: any = [
		{
			id: 15,
			country: "India",
			flag: "https://uniprep.ai/uniprepapi/storage/app/public/country-flags/1689510580Horse8b (2).svg",
		},
	]

	constructor(
		private service: AuthService,
		private router: Router,
		private formBuilder: FormBuilder,
		private locationService: LocationService,
		private toastr: MessageService,
		// private fb: FacebookService,
		private authService: SocialAuthService,
		private storage: LocalStorageService
	) { }

	dateTime = new Date()
	private subs = new SubSink()
	ngOnInit() {
		localStorage.clear()
		// this.domainnamecondition=window.location.hostname
		// if ( this.domainnamecondition === "dev-student.uniprep.ai" ||  this.domainnamecondition === "uniprep.ai" ||  this.domainnamecondition === "localhost") {
		//   this.domainname="main"
		// }
		this.locationService.getImage().subscribe((imageUrl) => {
			this.imageUrlWhitelabel = imageUrl
		})
		this.authService.authState.subscribe((user) => {
			this.service.googlesignUp(user).subscribe(
				(data) => {
					if (data.token) {
						this.storage.set(environment.tokenKey, data.token)
					} else {
						this.storage.set(environment.tokenKey, data?.authorisation?.token)
					}
					this.router.navigate(["/pages/dashboard"], { replaceUrl: true })
				},
				(error: any) => {
					this.toastr.add({
						severity: "error",
						summary: "Error",
						detail: error?.error?.message || error?.message || "An unexpected error occurred, please contact the team",
					})
				}
			)
		})
		//var socialUser = user;
		//this.loggedIn = (user != null);

		// this.isMobileOTPSend = true;
		// this.isMobileOTPValidated = true;
		// this.isEmailOTPSend = true;
		// this.isEmailOTPValidated = true;
		// this.isRemainingFieldVisible = true;

		this.dateTime.setDate(this.dateTime.getDate())

		this.password = "password"
		this.registrationForm = this.formBuilder.group({
			fullName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
			emailAddress: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(8), matchValidator("confirmPassword", true)]],
			confirmPassword: ["", [Validators.required, matchValidator("password")]],
		})

		this.otpForm = this.formBuilder.group({
			otp1: ["", [Validators.required]],
			otp2: ["", [Validators.required]],
			otp3: ["", [Validators.required]],
			otp4: ["", [Validators.required]],
		})
		this.emailOTPForm = this.formBuilder.group({
			otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
		})

		this.getUserLocation() //while registering the user needs to get the location based city, state, region, country.
	}

	yearChage(event: any) {
		this.registrationForm?.get("intakeMonth")?.setValue(event)
	}

	GetLocationList() {
		if (this.registrationForm.get("country").value == 122) {
			this.locationService.getLocation().subscribe(
				(res: any) => {
					this.locationList = res
				},
				(error: any) => {
					this.toastr.add({
						severity: "warning",
						summary: "Warning",
						detail: error.error.message,
					})
				}
			)
		} else {
			this.locationList = [{ id: 0, district: "Others" }]
			this.registrationForm.get("location").setValue(0)
		}
	}

	gethomeCountryList() {
		this.locationService.getHomeCountryNew().subscribe(
			(res: any) => {
				this.countryList = res
			},
			(error: any) => {
				this.toastr.add({
					severity: "warning",
					summary: "Warning",
					detail: error.error.message,
				})
			}
		)
	}
	getIntrestedCountryList() {
		this.locationService.getCountry().subscribe(
			(res: any) => {
				this.intrestedCountryList = res
			},
			(error: any) => {
				this.toastr.add({
					severity: "warning",
					summary: "Warning",
					detail: error.error.message,
				})
			}
		)
	}

	getProgramLevelList() {
		this.locationService.getProgramLevel().subscribe(
			(res: any) => {
				this.programLevelList = res
			},
			(error: any) => {
				this.toastr.add({
					severity: "warning",
					summary: "Warning",
					detail: error.error.message,
				})
			}
		)
	}

	submitted = false

	get f() {
		return this.registrationForm.controls
	}

	onSubmit() {
		if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
			this.toastr.add({
				severity: "error",
				summary: "Error",
				detail: "Password and Confirm Password should be same",
			})
			return
		}

		this.submitted = true
		let data = {
			name: this.registrationForm.value.fullName,
			email: this.registrationForm.value.emailAddress,
			password: this.registrationForm.value.password,
			password_confirmation: this.registrationForm.value.confirmPassword,
			platform_id: 1,
			usertype_id: 1,
		}

		this.service.Registraion(data).subscribe(
			(res: any) => {
				this.toastr.add({
					severity: "success",
					summary: "Success",
					detail: "User Registered",
				})
				if (res?.token) {
					this.storage.set(environment.tokenKey, res.token)
				} else {
					this.storage.set(environment.tokenKey, res?.authorisation?.token)

				}
				// this.toastr.add({
				// 	severity: "success",
				// 	summary: "Success",
				// 	detail: "Login Successful"
				// })
				this.router.navigate(["/pages/dashboard"], { replaceUrl: true })
			},
			(error) => {
				const message = error.error?.message != undefined ? error.error?.message : error?.message

				this.toastr.add({
					severity: "error",
					summary: "Failed",
					detail: message,
				})
			}
		)
	}

	getUserLocation() {
		fetch("https://ipapi.co/json/")
			.then((response) => response.json())
			.then((data) => {
				this.preferredCountry = data.country_code.toLocaleLowerCase()
			})
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const longitude = position.coords.longitude
					const latitude = position.coords.latitude
					fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
						.then((response) => response.json())
						.then((data) => {
							this.currentLocationCountry = data.address.country
							this.currentLocationCity = data.address.city
							this.currentLocationState = data.address.state
						})
				},
				(error) => {
					//if you're not giving the location access get the current country name using IP address
					fetch("https://ipapi.co/json/")
						.then((response) => response.json())
						.then((data) => {
							this.currentLocationCountry = data.country_name
							this.currentLocationCity = data.city
							this.currentLocationState = data.region
						})
				}
			)
		} else {
			console.log("No support for geolocation")
		}
	}

	openTermsPopup() {
		this.displayTerms = "block"
	}

	closeTermsPopup() {
		this.displayTerms = "none"
	}

	sendMobileOTP() {
		// if (this.otpForm.invalid) {
		//   return;
		// }
		let val = {
			phone: this.registrationForm.value.contactNumber.number,
			country_code: this.registrationForm.value.contactNumber.dialCode,
		}
		if (this.registrationForm.value.fullName != null && this.registrationForm.value.contactNumber.number) {
			this.service.getSmsOTP(val).subscribe(
				(res: any) => {
					this.resendTime++
					this.startTimer = 60
					if (this.resendTime >= 3) {
						this.startTimer = 30
					}
					this.processTimer()
					// this.isMobileOTPSend = true
					// this.isMobileOTPEdit = true
					this.toastr.add({
						severity: "success",
						summary: "Success",
						detail: "OTP Generated and Sent to " + val.phone,
					})
				},
				(error: any) => {
					// this.isMobileOTPSend = false
				}
			)
		} else {
			this.toastr.add({
				severity: "info",
				summary: "Info",
				detail: "Enter Above Filed",
			})
		}
	}

	onValidateMobileOTP() {
		if (this.otpForm.invalid) {
			return
		}
		let _otp = this.otpForm.value.otp1 + this.otpForm.value.otp2 + this.otpForm.value.otp3 + this.otpForm.value.otp4
		// if (!this.isMobileOTPValidated) {
		// 	let val = {
		// 		phone: this.registrationForm.value.contactNumber.number,
		// 		country_code: this.registrationForm.value.contactNumber.dialCode,
		// 		otp: _otp,
		// 	}
		// 	this.service.verifySmsOTP(val).subscribe(
		// 		(res: any) => {
		// 			this.isMobileOTPValidated = true
		// 			this.otpForm.reset()
		// 			this.toastr.add({
		// 				severity: "success",
		// 				summary: "Success",
		// 				detail: "OTP Verified Successfully",
		// 			})
		// 		},
		// 		(error: any) => {
		// 			this.isMobileOTPValidated = false
		// 		}
		// 	)
		// }
	}

	numericOnly(event: any): boolean {
		let pattern = /^([0-9])$/
		return pattern.test(event.key)
	}

	sendEmailOTP() {
		const name = this.registrationForm.value.fullName;
		const email = this.registrationForm.value.emailAddress;
		if (name && email) {
			const nameRegex = /^[a-zA-Z\s]+$/;
			if (!nameRegex.test(name)) {
				this.toastr.add({
					severity: "error",
					summary: "Invalid Name",
					detail: "Name should not contain special characters or numbers."
				});
				return;
			}
			const data = {
				name: this.registrationForm.value.fullName,
				email: this.registrationForm.value.emailAddress,
			}
			this.service.sendOtp(data).subscribe(
				(res) => {
					this.isEmailOTPSend = true
					this.registrationForm.controls["emailAddress"].readonly = true
					this.toastr.add({ severity: "success", summary: "Success", detail: "OTP sent to your email." })
				},
				(error) => {
					const errorMessage = error?.error?.message || "Failed to send OTP.";
					this.toastr.add({ severity: "error", summary: "Error", detail: errorMessage });
					//this.toastr.add({ severity: "error", summary: "Error", detail: error.message || "Failed to send OTP." || "This email has already been taken."})
				}
			)
		} else {
			this.toastr.add({ severity: "error", summary: "Error", detail: 'Fill required fields' });
		}

	}

	onValidateEmailOTP() {
		const otpControl = this.emailOTPForm.get('otp');
		const otpValue = otpControl?.value;

		if (!otpValue || otpValue.length !== 4) {
			this.toastr.add({ severity: "error", summary: "Error", detail: "Please enter a valid 4-digit OTP." });
			return;
		}

		const data = {
			otp: otpValue,
			email: this.registrationForm.value.emailAddress,
		}

		this.service.validateEmailOTP(data).subscribe(
			(res) => {
				this.isEmailOTPSend = false;
				this.isEmailOTPValidated = true;
				this.isRemainingFieldVisible = true;
				this.toastr.add({ severity: "success", summary: "Success", detail: "OTP verified successfully." });
			},
			(error) => {
				this.otpError = true;
				const message = error.error?.message != undefined ? error.error?.message : error?.message
				this.toastr.add({ severity: "error", summary: "Error", detail: message || "Invalid OTP." });
			}
		)
	}

	processTimer() {
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = undefined
		}
		this.interval = setInterval(() => {
			this.startTimer -= 1

			if (this.startTimer <= 0) {
				clearInterval(this.interval)
			}
		}, 1000)
	}

	editMobileNumberAgain() {
		// this.isMobileOTPSend = false
	}

	editEmailAgain() {
		this.isEmailOTPSend = false
	}

	onChangeContact(event: any) {
		this.showContactErrorIcon = false
		if (event?.target?.value?.length != 0) {
			this.showContactErrorIcon = true
			this.registerFormInvalid = true
		} else {
			this.validNumberRequired = false
			this.registerFormInvalid = false
		}
	}

	onChangeEmail(event: any) {
		this.showEmailErrorIcon = false
		if (this.registrationForm.controls["emailAddress"].valid) {
			this.showEmailErrorIcon = true
		}
	}

	changeLocation(event: any) {
		this.GetLocationList()
	}
	changeCountryCode(event: any) {
		let changeHomeCountry = this.countryList.find((data: any) => data.country_code == event.value)
		this.registrationForm.get("country").setValue(changeHomeCountry.id)
		this.GetLocationList()
	}

	loginWithFacebook() {
		// this.fb.login().then(response => {
		//     console.log('Facebook login response:', response);
		// }).catch(error => {
		//     console.error('Facebook login error:', error);
		// });
	}

	showHidePassword() {
		this.showPassword = !this.showPassword
		this.password = this.showPassword ? "text" : "password"
	}
	showHideConfirmPassword() {
		this.showConfirm = !this.showConfirm
		this.confirmPassword = this.showConfirm ? "text" : "password"
	}
}
