import { GoogleSigninButtonModule, SocialLoginModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { LocalStorageService } from 'ngx-localstorage';
import { MessageService } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { matchValidator } from 'src/app/@Supports/matchvalidator';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { SubSink } from 'subsink';
import { LandingPartnerServices } from '../landing-partner.service';

@Component({
	selector: 'uni-partner-register',
	imports: [CommonModule, GoogleSigninButtonModule, InputOtpModule, FluidModule, PasswordModule, RouterModule, InputTextModule, InputIconModule, InputGroupModule, InputGroupAddonModule, SocialLoginModule, FormsModule, ReactiveFormsModule, ToastModule, SelectModule, NgxIntlTelInputModule],
	standalone: true,
	templateUrl: './partner-register.component.html',
	styleUrl: './partner-register.component.scss',
})
export class PartnerRegisterComponent {
	@ViewChild("otp1") otp1!: ElementRef;
	@ViewChild("otp2") otp2!: ElementRef;
	@ViewChild("otp3") otp3!: ElementRef;
	@ViewChild("otp4") otp4!: ElementRef;
	@ViewChild("telInput") telInput: any;

	public registrationForm: any = FormGroup;
	displayTerms = "none";
	locationList: any;
	countryList: any;
	currentLocationCountry: string = "";
	currentLocationCity: string = "";
	currentLocationState: string = "";
	public otpForm: any = FormGroup;
	public emailOTPForm: any = FormGroup;
	isMobileOTPSend: boolean = false;
	isEmailOTPSend: boolean = false;
	isEmailOTPValidated: boolean = false;
	isRemainingFieldVisible: boolean = false;
	password: any;
	preferredCountry: any;
	show = false;
	confirmPassword: any;
	startTimer = 0;
	interval: any;
	showContactErrorIcon: boolean = false;
	showEmailErrorIcon: boolean = false;
	validNumberRequired: boolean = false;
	registerFormInvalid: boolean = true;
	imageUrlWhiteLabel: string | null = null;
	otpError: boolean = false;
	submitted = false;
	isShowConfirmationResponse: boolean = false;
	genderOptions: any[] = []
	afterRegisterAwaitingConfirmation: boolean = false;
	constructor(private service: AuthService, private router: Router, private formBuilder: FormBuilder, private locationService: LocationService, private toast: MessageService, private authService: SocialAuthService, private storage: LocalStorageService, private landingService: LandingPartnerServices) { }

	dateTime = new Date();
	private subs = new SubSink();
	ngOnInit() {
		this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
			this.imageUrlWhiteLabel = data.logo
		})
		this.genderOptions = [
			{ id: 'M', name: 'Male' },
			{ id: 'F', name: 'Female' },
			{ id: 'O', name: 'Others' }
		];
		this.dateTime.setDate(this.dateTime.getDate());

		this.password = "password";
		this.registrationForm = this.formBuilder.group({
			full_name: ["", [Validators.required]],
			emailAddress: ["", [Validators.required, Validators.email]],
			mobileNumber: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
			home_country: ["", [Validators.required]],
			location: ["", [Validators.required]],
			password: ["", [Validators.required, Validators.minLength(8), matchValidator("confirmPassword", true)]],
			confirmPassword: ["", [Validators.required, matchValidator("password")]],
			companyName: ["", [Validators.required]],
			companyWebsite: ["", [Validators.required], Validators.pattern(
				'^(https?:\\/\\/)?' + // optional protocol
				'(([\\da-z.-]+)\\.([a-z.]{2,6}))' + // domain
				'(\\:[0-9]{1,5})?' + // optional port
				'(\\/[^\\s]*)?$' // optional path
			)],
			designation: ["", [Validators.required]],
			gender: ["", [Validators.required]],
		});

		this.otpForm = this.formBuilder.group({
			otp1: ["", [Validators.required]],
			otp2: ["", [Validators.required]],
			otp3: ["", [Validators.required]],
			otp4: ["", [Validators.required]],
		});
		this.emailOTPForm = this.formBuilder.group({
			otp: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
		});
		this.initializePhoneNumber();
		this.fetchCountryList();
		// this.getUserLocation() //while registering the user needs to get the location based city, state, region, country.
	}


	initializePhoneNumber() {
		fetch("https://ipapi.co/json/")
			.then((response) => response.json())
			.then((data) => {
				this.preferredCountry = data.country_code.toLocaleLowerCase();
			});
	}

	GetLocationList() {
		if (this.registrationForm.get("home_country").value == 122) {
			this.registrationForm.get('location')?.enable();
			this.registrationForm.get('location')?.reset();
			this.locationService.getLocation().subscribe(
				(res: any) => {
					this.locationList = res;
				},
				(error: any) => {
					this.toast.add({
						severity: "warning",
						summary: "Warning",
						detail: error.error.message,
					});
				}
			);
		} else {
			this.locationList = [{
				id: 0, district: "Others", state: "Others" 
			}];
			this.registrationForm.get("location").setValue(0);
			this.registrationForm.get('location')?.disable();
		}
	}

	fetchCountryList() {
		this.locationService.getHomeCountry(2).subscribe(
			(res: any) => {
				this.countryList = res;
			},
			(error: any) => {
				this.toast.add({
					severity: "warning",
					summary: "Warning",
					detail: error.error.message,
				});
			}
		);
	}
	onChangeCountry(event: any) {
		this.GetLocationList();
	}
	get f() {
		return this.registrationForm.controls;
	}

	onSubmit() {
		if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
			this.toast.add({
				severity: "error",
				summary: "Error",
				detail: "Password and Confirm Password do not match.",
			});
			return;
		}
		this.submitted = true;
		let data = {
			name: this.registrationForm.value.full_name,
			phonenumber: this.registrationForm.value.mobileNumber?.number,
			email: this.registrationForm.value.emailAddress,
			password: this.registrationForm.value.password,
			password_confirmation: this.registrationForm.value.confirmPassword,
			country_id: this.registrationForm.value.home_country,
			location_id: this.registrationForm.value.location,
			company_name: this.registrationForm.value.companyName,
			company_website: this.registrationForm.value.companyWebsite,
			company_designation: this.registrationForm.value.designation,
			phone: this.registrationForm.value.mobileNumber,
			gender: this.registrationForm.value.gender
		};

		this.landingService.registerEmployer(data).subscribe({
			next: (res: any) => {
				console.log(res);
				this.toast.add({
					severity: "success",
					summary: "Success",
					detail: res.message,
				});
				this.afterRegisterAwaitingConfirmation = true;
			},
			error: (error) => {
				const message = error.error?.message != undefined ? error.error?.message : error?.message;
				this.toast.add({
					severity: "error",
					summary: "Failed",
					detail: message,
				});
			},
		});
	}

	getUserLocation() {
		this.initializePhoneNumber();
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const longitude = position.coords.longitude;
					const latitude = position.coords.latitude;
					fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
						.then((response) => response.json())
						.then((data) => {
							this.currentLocationCountry = data.address.country;
							this.currentLocationCity = data.address.city;
							this.currentLocationState = data.address.state;
						});
				},
				(error) => {
					//if you're not giving the location access get the current country name using IP address
					fetch("https://ipapi.co/json/")
						.then((response) => response.json())
						.then((data) => {
							this.currentLocationCountry = data.country_name;
							this.currentLocationCity = data.city;
							this.currentLocationState = data.region;
						});
				}
			);
		} else {
			console.log("No support for geolocation");
		}
	}

	openTermsPopup() {
		this.displayTerms = "block";
	}

	closeTermsPopup() {
		this.displayTerms = "none";
	}

	numericOnly(event: any): boolean {
		let pattern = /^([0-9])$/;
		return pattern.test(event.key);
	}

	sendEmailOTP() {
		this.landingService.sendEmailOTP(this.registrationForm.value.emailAddress, this.registrationForm.value.full_name || '', this.registrationForm.value.mobileNumber?.number || '').subscribe({
			next: (response) => {
				this.isEmailOTPSend = true;
				this.toast.add({ severity: "success", summary: "Sent", detail: "OTP sent successfully." });
			},
			error: (error) => {
				const messages = error.error.message;
				const errorMessage = Array.isArray(messages) ? messages.join('\n') : messages;

				this.toast.add({
					severity: "error",
					summary: "Email sending failed",
					detail: errorMessage,
					life: 5000
				});
			},
		});
	}

	onValidateEmailOTP() {
		const otpControl = this.emailOTPForm.get("otp");
		const otpValue = otpControl?.value;

		if (!otpValue || otpValue.length !== 4) {
			this.toast.add({ severity: "error", summary: "Error", detail: "Please enter a valid 4-digit OTP." });
			return;
		}

		const data = {
			otp: otpValue,
			email: this.registrationForm.value.emailAddress,
			full_name: this.registrationForm.value.full_name,
		};
		this.landingService.verifyEmailOTP(data).subscribe({
			next: (response) => {
				this.isEmailOTPSend = true;
				console.log("Email Sent:", response);
				if (response.message == "OTP Matches") {
					this.isEmailOTPSend = false;
					this.isEmailOTPValidated = true;
					this.isRemainingFieldVisible = true;
					this.toast.add({ severity: "success", summary: "Success", detail: "OTP verified successfully." });
				}
			},
			error: (error) => {
				this.toast.add({ severity: "error", summary: "Verify Otp Failed", detail: "please check your otp" });
				console.error("Verify OTP failed", error);
			},
		});
	}

	focusNextInput(event: KeyboardEvent | TouchEvent, num: number) {
		const isBackspace = event instanceof KeyboardEvent && (event as KeyboardEvent).key.toLowerCase() === "backspace";

		if (isBackspace) {
			switch (num) {
				case 2:
					this.otp1.nativeElement.focus();
					break;
				case 3:
					this.otp2.nativeElement.focus();
					break;
				case 4:
					this.otp3.nativeElement.focus();
					break;
			}
			// Prevent the default backspace behavior
			event.preventDefault();
		} else if (/^\d$/.test((event as KeyboardEvent).key)) {
			switch (num) {
				case 1:
					this.otp2.nativeElement.focus();
					break;
				case 2:
					this.otp3.nativeElement.focus();
					break;
				case 3:
					this.otp4.nativeElement.focus();
					break;
			}
		}

		// Prevent the default behavior for touch events
		if (event instanceof TouchEvent) {
			event.preventDefault();
		}
	}

	processTimer() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = undefined;
		}
		this.interval = setInterval(() => {
			this.startTimer -= 1;

			if (this.startTimer <= 0) {
				clearInterval(this.interval);
			}
		}, 1000);
	}

	editMobileNumberAgain() {
		this.isMobileOTPSend = false;
	}

	editEmailAgain() {
		this.isEmailOTPSend = false;
	}

	onChangeContact(event: any) {
		this.showContactErrorIcon = false;
		if (event?.target?.value?.length != 0) {
			this.showContactErrorIcon = true;
			this.registerFormInvalid = true;
		} else {
			this.validNumberRequired = false;
			this.registerFormInvalid = false;
		}
	}

	onChangeEmail(event: any) {
		this.showEmailErrorIcon = false;
		if (this.registrationForm.controls["emailAddress"].valid) {
			this.showEmailErrorIcon = true;
		}
	}
	// restrictions
	blockNumbers(event: KeyboardEvent) {
		const pattern = /[a-zA-Z\s]/;
		const inputChar = String.fromCharCode(event.keyCode || event.which);

		if (!pattern.test(inputChar)) {
			event.preventDefault();
		}
	}
}