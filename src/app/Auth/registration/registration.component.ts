import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewChild, ElementRef } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { matchValidator } from "src/app/@Supports/matchvalidator"
import { LocationService } from "src/app/services/location.service"
import { AuthService } from "../auth.service"
import { MessageService } from "primeng/api"
import { NgxIntlTelInputModule } from "ngx-intl-tel-input"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
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
import { AuthTokenService } from "src/app/services/auth-token.service"
import { KeyFilterModule } from 'primeng/keyfilter';
import { Image } from "primeng/image";
import { HowItWorksComponent } from "src/app/shared/how-it-works/how-it-works.component";
import { HowItWorksService } from "src/app/shared/how-it-works/how-it-works.service"
@Component({
    selector: "app-registration",
    templateUrl: "./registration.component.html",
    styleUrls: ["./registration.component.scss"],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [CommonModule, InputOtpModule, FluidModule, PasswordModule, RouterModule, InputTextModule,
        InputIconModule, InputGroupModule, InputGroupAddonModule, SocialLoginModule, FormsModule, KeyFilterModule,
        ReactiveFormsModule, ToastModule, SelectModule, NgxIntlTelInputModule, GoogleSigninButtonModule, ButtonDirective, Image, HowItWorksComponent],
})
export class RegistrationComponent implements OnInit {
    public registrationForm: any = FormGroup
    displayTerms = "none"
    locationList: any
    countryList: any
    programLevelList: any
    intrestedCountryList: any
    currentLocationCountry: string = ""
    currentLocationCity: string = ""
    currentLocationState: string = ""
    public otpForm: any = FormGroup
    public emailOTPForm: any = FormGroup
    blockChars: RegExp = /^[^<>*!:?0-9]+$/;
    isEmailOTPSend: boolean = false
    isEmailOTPValidated: boolean = false
    isRemainingFieldVisible: boolean = false
    password: any
    preferredCountry: any
    show = false
    showConfirm = false
    confirmPassword: any
    source: string;
    resendTime = 1
    startTimer = 0
    interval: any
    showContactErrorIcon: boolean = false
    showEmailErrorIcon: boolean = false
    validNumberRequired: boolean = false
    registerFormInvalid: boolean = true
    submitted = false

    whiteLabelImage: string = '../../../uniprep-assets/images/uniprep-light.svg'

    showPassword: boolean = false
    otpError: boolean = false
    fallbackImage = '../../../uniprep-assets/images/uniprep-light.svg'
    loading = true;
    constructor(
        private service: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private toastr: MessageService,
        private authService: SocialAuthService,
        private storage: LocalStorageService,
        private route: ActivatedRoute,
        private authTokenService: AuthTokenService,
        private howItWorkService: HowItWorksService
    ) {
    }
    dateTime = new Date()
    position: any
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const position = params['position'];
            const jobId = params['job_id'];

            if (position && jobId) {
                this.position = position;
                this.storage.set('position', position)
                this.storage.set('jobId', jobId)
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: {},
                    replaceUrl: true
                });
                if (this.service.isTokenValid()) {
                    this.router.navigate([`/pages/talent-connect/easy-apply/${jobId}`])
                }
            } else {
                // console.log('One or both query params are missing.');
            }
        });
        this.position = this.storage.get('position')
        if (!this.position) {
            localStorage.clear()
        }
        //localStorage.clear()
        this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
            this.source = data.name;
            this.whiteLabelImage = data.logo
        })
        this.authService.authState.subscribe((user) => {

            this.service.googlesignUp(user).subscribe(
                (data) => {
                    this.storage.set(environment.tokenKey, data?.authorisation?.token);
                    this.service.saveToken(data?.authorisation?.token);
                    this.authTokenService.setToken(data?.authorisation?.token);
                    // if (data.token) {
                    //     this.storage.set(environment.tokenKey, data.token)
                    // } else {
                    //     this.storage.set(environment.tokenKey, data?.authorisation?.token)
                    // }
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
        // Enable only for testing
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
        this.emailOTPForm = this.formBuilder.group({
            otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
        })

        this.getUserLocation() //while registering the user needs to get the location based city, state, region, country.
    }

    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = this.fallbackImage;
        this.loading = false;
    }

    formatName() {
        const control = this.registrationForm.get('fullName');
        const value = control?.value || '';
        const formatted = value
            .toLowerCase()
            .replace(/\b\w/g, (char: any) => char.toUpperCase());
        control?.setValue(formatted, { emitEvent: false });
    }

    //
    // gethomeCountryList() {
    //     this.locationService.getHomeCountryNew().subscribe(
    //         (res: any) => {
    //             this.countryList = res
    //         },
    //         (error: any) => {
    //             this.toastr.add({
    //                 severity: "warning",
    //                 summary: "Warning",
    //                 detail: error.error.message,
    //             })
    //         }
    //     )
    // }


    get f() {
        return this.registrationForm.controls
    }
    onProcess: boolean = false;
    onSubmit() {
        if (this.registrationForm.value.password.length < 8 || this.registrationForm.value.confirmPassword.length < 8) {
            this.toastr.add({
                severity: "error",
                summary: "Error",
                detail: "Password must be 8 characters",
            })
            return
        }
        if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
            this.toastr.add({
                severity: "error",
                summary: "Error",
                detail: "Password and Confirm Password should be same",
            })
            return
        }
        this.onProcess = true;
        this.submitted = true
        let data = {
            name: this.registrationForm.value.fullName,
            email: this.registrationForm.value.emailAddress,
            password: this.registrationForm.value.password,
            password_confirmation: this.registrationForm.value.confirmPassword,
            platform_id: 1,
            usertype_id: 1,
            position: this.position ? this.position : ''
        }

        this.service.Registraion(data).subscribe({
            next: (res: any) => {
                this.toastr.add({ severity: "success", summary: "Success", detail: "User Registered" });
                if (res?.authorisation?.token) {
                    this.storage.set(environment.tokenKey, res?.authorisation?.token);
                    this.service.saveToken(res?.authorisation?.token);
                    this.authTokenService.setToken(res?.authorisation?.token);
                }
                this.router.navigate(["/pages/dashboard"], { replaceUrl: true });
            },
            error: (error) => {
                this.onProcess = false;
                const message = error.error?.message != undefined ? error.error?.message : error?.message;
                this.toastr.add({ severity: "error", summary: "Failed", detail: message });
            }
        });
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

        if (!otpValue || otpValue.length <= 3) {
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

    editEmailAgain() {
        this.isEmailOTPSend = false
    }

    onChangeEmail(event: any) {
        this.showEmailErrorIcon = false
        if (this.registrationForm.controls["emailAddress"].valid) {
            this.showEmailErrorIcon = true
        }
    }

    showHidePassword() {
        this.showPassword = !this.showPassword
        this.password = this.showPassword ? "text" : "password"
    }

    showHideConfirmPassword() {
        this.showConfirm = !this.showConfirm
        this.confirmPassword = this.showConfirm ? "text" : "password"
    }

    openVideoPopup(){
        let whichRegister = this.source === 'Uniprep' ? 'uniprep-student-register' : 'institute-student-register';
        this.howItWorkService.open(whichRegister);
    }
}
