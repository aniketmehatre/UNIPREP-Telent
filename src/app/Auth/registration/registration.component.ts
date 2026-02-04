import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core"
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
    imports: [
        // PrimeNG, Angular, and custom modules used in this component
        CommonModule, InputOtpModule, FluidModule, PasswordModule, RouterModule, InputTextModule,
        InputIconModule, InputGroupModule, InputGroupAddonModule, SocialLoginModule, FormsModule, KeyFilterModule,
        ReactiveFormsModule, ToastModule, SelectModule, NgxIntlTelInputModule, GoogleSigninButtonModule, ButtonDirective, Image, HowItWorksComponent
    ],
})
export class RegistrationComponent implements OnInit {
    // Form groups for registration and email OTP verification
    registrationForm!: FormGroup
    emailOTPForm!: FormGroup

    // Regex to block special characters and numbers in name input
    blockChars: RegExp = /^[^<>*!:?0-9]+$/;

    // UI state for email OTP flow
    isEmailOTPSend: boolean = false
    isEmailOTPValidated: boolean = false
    isRemainingFieldVisible: boolean = false
    isSourceInstitute: boolean = true
    isSocialLoginEnabled: boolean = false

    // Password field visibility toggles
    password: 'password' | 'text' = 'password'
    show = false
    showConfirm = false
    confirmPassword: 'password' | 'text' = 'password'

    // Whitelabel/source values
    source: string = '';
    showEmailErrorIcon: boolean = false
    submitted = false

    // Default images for whitelabel and fallback
    whiteLabelImage: string = '../../../uniprep-assets/images/uniprep-light.svg'
    fallbackImage = '../../../uniprep-assets/images/uniprep-light.svg'

    // Miscellaneous UI state
    showPassword: boolean = false
    otpError: boolean = false
    loading = true;
    googleResponse: any

    // Dependency injection for services and router
    constructor(
        private service: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private toast: MessageService,
        private authService: SocialAuthService,
        private storage: LocalStorageService,
        private route: ActivatedRoute,
        private authTokenService: AuthTokenService,
        private howItWorkService: HowItWorksService
    ) { }

    // Job-related query params
    position: any
    jobId: number

    ngOnInit() {
        this.isSocialLoginEnabled = window.location.hostname === "uniprep.ai";
        // this.isRemainingFieldVisible = true
        // Handle referral/easy-apply query params and persist for later flows
        this.route.queryParams.subscribe(params => {
            this.position = params['position'];
            this.jobId = params['job_id'];
            this.jobId = Number(this.jobId);
            if (this.position && this.jobId) {
                // Clean URL after extracting the params
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: {},
                    replaceUrl: true
                });
                // If already logged in, directly route to easy-apply with jobId
                if (this.service.isTokenValid()) {
                    this.router.navigate([`/pages/talent-connect/easy-apply/${this.jobId}`])
                }
                this.storage.set('position', this.position)
                this.storage.set('jobId', this.jobId)
            }
        });

        // Load white-label configuration (source name and logo) based on domain
        this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
            if (data.source == 'Institute') {
                this.isSourceInstitute = false
            }
            this.source = data.name;
            this.whiteLabelImage = data.logo
        })

        // Google Sign-in: when auth state changes, attempt backend signup and redirect accordingly (only on uniprep.ai)
        if (this.isSocialLoginEnabled) {
            this.authService.authState.subscribe((user) => {
                if (!user) return;
                this.googleResponse = user
                this.googleResponse = { ...this.googleResponse, position: this.storage.get('position'), job_id: this.storage.get('jobId') }

                this.service.googlesignUp(this.googleResponse).subscribe({
                next: (data) => {
                    // Save token and redirect to easy-apply or dashboard
                    this.storage.set(environment.tokenKey, data?.authorisation?.token);
                    this.service.saveToken(data?.authorisation?.token);
                    this.authTokenService.setToken(data?.authorisation?.token);
                    this.jobId = Number(this.storage.get('jobId'));
                    if (this.jobId) {
                        window.location.href = `${window.location.origin}/pages/talent-connect/easy-apply/${this.jobId}/?token=${data?.authorisation?.token}`;
                    } else {
                        window.location.href = `${window.location.origin}/pages/talent-connect/easy-apply/?token=${data?.authorisation?.token}`;
                    }
                },
                error: (error: any) => {
                    // Show error toast if Google signup fails
                    this.toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: error?.error?.message || error?.message || "An unexpected error occurred, please contact the team",
                    })
                }
            })
            });
        }

        // Build registration and OTP forms with validation
        this.registrationForm = this.formBuilder.group({
            fullName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
            emailAddress: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8), matchValidator("confirmPassword", true)]],
            confirmPassword: ["", [Validators.required, matchValidator("password")]],
        })
        this.emailOTPForm = this.formBuilder.group({
            otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
        })

    }

    // Handle image load error by setting fallback image
    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = this.fallbackImage;
        this.loading = false;
    }

    // Format name input to capitalize each word
    formatName() {
        const control = this.registrationForm.get('fullName');
        const value = control?.value || '';
        const formatted = value
            .toLowerCase()
            .replace(/\b\w/g, (char: any) => char.toUpperCase());
        control?.setValue(formatted, { emitEvent: false });
    }

    // Shortcut accessor for template bindings
    get f() {
        return this.registrationForm.controls
    }

    onProcess: boolean = false;

    // Handle registration form submission
    onSubmit() {
        // Validate password length and match
        if (this.registrationForm.value.password.length < 8 || this.registrationForm.value.confirmPassword.length < 8) {
            this.toast.add({
                severity: "error",
                summary: "Error",
                detail: "Password must be 8 characters",
            })
            return
        }
        if (this.registrationForm.value.password != this.registrationForm.value.confirmPassword) {
            this.toast.add({
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
            position: this.storage.get('position') ? this.storage.get('position') : '',
            job_id: this.storage.get('jobId') ? this.storage.get('jobId') : '',
        }

        // Call registration API
        this.service.Registraion(data).subscribe({
            next: (res: any) => {
                this.toast.add({ severity: "success", summary: "Success", detail: "User Registered" });
                // Save token and redirect to appropriate page
                if (res?.authorisation?.token) {
                    this.storage.set(environment.tokenKey, res?.authorisation?.token);
                    this.service.saveToken(res?.authorisation?.token);
                    this.authTokenService.setToken(res?.authorisation?.token);
                }
                if (this.storage.get('jobId')) {
                    window.location.href = `${window.location.origin}/pages/talent-connect/easy-apply/${this.storage.get('jobId')}/?token=${res?.authorisation?.token}`;
                } else {
                    window.location.href = `${window.location.origin}/pages/dashboard?token=${res?.authorisation?.token}`;
                }
            },
            error: (error) => {
                this.onProcess = false;
                const message = error.error?.message != undefined ? error.error?.message : error?.message;
                this.toast.add({ severity: "error", summary: "Failed", detail: message });
            }
        });
    }

    // Send OTP to user's email for verification
    sendEmailOTP() {
        const name = this.registrationForm.value.fullName;
        const email = this.registrationForm.value.emailAddress;
        if (name && email) {
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(name)) {
                this.toast.add({
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
                    this.toast.add({ severity: "success", summary: "Success", detail: "OTP sent to your email." })
                },
                (error) => {
                    const errorMessage = error?.error?.message || "Failed to send OTP.";
                    this.toast.add({ severity: "error", summary: "Error", detail: errorMessage });
                }
            )
        } else {
            this.toast.add({ severity: "error", summary: "Error", detail: 'Fill required fields' });
        }
    }

    // Validate the OTP entered by the user
    onValidateEmailOTP() {
        const otpControl = this.emailOTPForm.get('otp');
        const otpValue = otpControl?.value;

        if (!otpValue || otpValue.length <= 3) {
            this.toast.add({ severity: "error", summary: "Error", detail: "Please enter a valid 4-digit OTP." });
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
                this.toast.add({ severity: "success", summary: "Success", detail: "OTP verified successfully." });
            },
            (error) => {
                this.otpError = true;
                const message = error.error?.message != undefined ? error.error?.message : error?.message
                this.toast.add({ severity: "error", summary: "Error", detail: message || "Invalid OTP." });
            }
        )
    }

    // Allow user to edit email if OTP failed
    editEmailAgain() {
        this.isEmailOTPSend = false
    }

    // Show/hide error icon based on email validity
    onChangeEmail(event: any) {
        this.showEmailErrorIcon = false
        if (this.registrationForm.controls["emailAddress"].valid) {
            this.showEmailErrorIcon = true
        }
    }

    // Toggle password field visibility
    showHidePassword() {
        this.showPassword = !this.showPassword
        this.password = this.showPassword ? "text" : "password"
    }

    // Toggle confirm password field visibility
    showHideConfirmPassword() {
        this.showConfirm = !this.showConfirm
        this.confirmPassword = this.showConfirm ? "text" : "password"
    }

    // Open "How It Works" video popup based on source
    openVideoPopup() {
        let whichRegister = this.source === 'Uniprep' ? 'uniprep-student-register' : 'institute-student-register';
        this.howItWorkService.open(whichRegister);
    }
}