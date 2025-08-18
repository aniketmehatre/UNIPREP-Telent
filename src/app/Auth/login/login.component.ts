import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, } from '@abacritt/angularx-social-login'
import { CommonModule } from "@angular/common"
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    signal,
    ViewChild
} from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { MessageService } from "primeng/api"
import { ButtonModule } from "primeng/button"
import { FluidModule } from "primeng/fluid"
import { Image } from "primeng/image"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputIconModule } from "primeng/inputicon"
import { InputTextModule } from "primeng/inputtext"
import { PasswordModule } from "primeng/password"
import { SkeletonModule } from "primeng/skeleton"
import { finalize } from 'rxjs/operators'
import { AuthTokenService } from "src/app/services/auth-token.service"
import { BrandColorService } from "src/app/services/brand-color.service"
import { CountryLocationService } from "src/app/services/country-location.service"
import { DataService } from "src/app/services/data.service"
import { HowItWorksComponent } from "src/app/shared/how-it-works/how-it-works.component"
import { HowItWorksService } from "src/app/shared/how-it-works/how-it-works.service"
import { SubSink } from "subsink"
import { LocationService } from "../../services/location.service"
import { AuthService } from "../auth.service"

declare var google: any;

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    imports: [CommonModule, FluidModule, PasswordModule, RouterModule, InputTextModule, InputIconModule,
        InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule,
        SocialLoginModule, GoogleSigninButtonModule, Image, SkeletonModule, ButtonModule, HowItWorksComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild("button2") button2!: ElementRef
    loginForm: FormGroup
    domainNameCondition: string
    ipURL: string = "https://api.ipify.org?format=json"
    fallbackImage = '../../../uniprep-assets/images/uniprep-light.svg'
    locationData: any
    isInstitute = signal(false)
    submitted = signal(false);
    show = signal(true);
    isLoading = signal(false);
    coBrandedImageUrl = signal<string>('../../../uniprep-assets/images/uniprep-light.svg');
    domainName = signal('main');
    password = signal('password')
    countryLists: any
    // inject Services
    private service = inject(AuthService);
    private formBuilder = inject(FormBuilder);
    private route = inject(Router);
    private toast = inject(MessageService);
    private dataService = inject(DataService);
    private locationService = inject(LocationService);
    private authService = inject(SocialAuthService);
    private storage = inject(LocalStorageService);
    private authTokenService = inject(AuthTokenService);
    private cdr = inject(ChangeDetectorRef);
    private subs = new SubSink()
    private brandColorService = inject(BrandColorService);
    private howItWorks = inject(HowItWorksService);
    private countryLocationService = inject(CountryLocationService);
    loading = true;
    jobId: any

    get canSubmit() {
        return this.loginForm.valid && !this.isLoading();
    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnDestroy() {
        this.subs.unsubscribe()
    }

    ngOnInit() {
        if (this.service.isTokenValid()) {
            this.route.navigate(["/pages/dashboard"])
        }
        this.jobId = Number(this.storage.get('jobId'));
        if (!this.jobId) {
            localStorage.clear()
        }
        this.initializeComponent()
        this.setupSocialAuth()
        this.apiToCheckPartnerOrInstitute()
    }

    loadCountryList(data: any) {
        this.locationService.getCountry().subscribe((countryList) => {
            const selectedCountry = countryList.find((element: any) =>
                element.id === Number(data.userdetails[0].selected_country)
            )

            if (selectedCountry) {
                this.storage.set("countryId", selectedCountry.id.toString())
                this.dataService.changeCountryName(selectedCountry.country)
                this.dataService.changeCountryFlag(selectedCountry.flag)
                this.dataService.changeCountryId(selectedCountry.id)
            }
        })
    }

    private initializeComponent() {
        this.domainNameCondition = window.location.hostname
        this.domainName.set(this.isDomainMain() ? 'main' : 'sub')
        this.dataService.loggedInAnotherDevice("none")
        fetch(this.ipURL)
            .then((response) => response.json())
            .then((data) => {
                this.locationData = data
            })
        this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
            this.coBrandedImageUrl.set(data.logo)
            if (data.brand_primary_color && data.brand_secondary_color) {
                this.brandColorService.fetchAndApplyColors(data.brand_primary_color, data.brand_secondary_color)
            } else {
                this.brandColorService.clearColorLocalStorage();
            }
            if (data.domainname) {
                const firstPart = data.domainname.split('.')[0];
                this.storage.set('domainname', firstPart)
            }
            this.loading = false
            this.cdr.markForCheck()
        })
        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required]],
            domain_type: ['main']
        })
        this.loginForm.patchValue({ domain_type: this.domainName })
    }

    openVideoPopup() {
        this.howItWorks.open('login-page');
    }

    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = this.fallbackImage;
        this.loading = false;
    }

    onSubmit(): void {
        this.submitted.set(true)
        if (this.loginForm.invalid) return

        this.isLoading.set(true)
        this.cdr.markForCheck()
        this.service.canDisableSignIn.next(true)

        this.service.validateSignIn(this.loginForm.value).pipe(
            finalize(() => {
                this.isLoading.set(false)
                this.cdr.markForCheck()
            })
        ).subscribe({
            next: (response) => {
                const disallowedDomains = [
                    'https://uniprep.ai',
                    'https://staging.uniprep.ai',
                    'http://localhost:4200',
                    'https://dev-student.uniprep.ai'
                ];
                if (disallowedDomains.includes(response.domain)) {
                    console.log('Allowed domain:', response.domain);
                    // this.handleSuccessfulLogin1(response.token, response.domain)
                if (this.jobId) {
                    window.location.href = `${response.domain}/pages/talent-connect/easy-apply/${this.jobId}/?token=${response.token}`;
                } else {
                    window.location.href = `${response.domain}/pages/dashboard?token=${response.token}`;
                }
                } else {
                    console.warn('Blocked domain:', response.domain);
                    // show error, redirect, or handle accordingly
                    if (response?.token) {
                        this.handleSuccessfulLogin(response.token)
                    }
                }
            },
            error: (error) => {
                this.toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: error?.error?.message || 'Login failed'
                })
            }
        })
    }

    apiToCheckPartnerOrInstitute() {

        this.locationService.getSourceByDomain(window.location.hostname).subscribe((response) => {
            if (response.source == 'Institute') {
                this.isInstitute.set(true);
            }
        })
    }

    private isDomainMain(): boolean {
        return this.domainNameCondition === "dev-student.uniprep.ai" ||
            this.domainNameCondition === "*.uniprep.ai" ||
            this.domainNameCondition === "uniprep.ai" ||
            this.domainNameCondition === "talent.uniprep.ai" ||
            this.domainNameCondition === "localhost"
    }

    private setupSocialAuth() {
        this.subs.sink = this.authService.authState.subscribe(user => {
            if (!user) return

            this.isLoading.set(true)
            this.cdr.markForCheck()

            this.service.isExist({ email: user.email }).pipe(
                finalize(() => {
                    this.isLoading.set(false)
                    this.cdr.markForCheck()
                })
            ).subscribe({
                next: (exists) => {
                    if (exists === "Exist") {
                        this.handleSocialLogin(user)
                    } else {
                        this.toast.add({ severity: "info", summary: "Info", detail: "Email not exist, Try Register" })
                    }
                },
                error: (error) => {
                    this.toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: error.message || 'Social login check failed'
                    })
                }
            })
        })
    }

    private handleSocialLogin(user: any) {
        this.isLoading.set(true)
        this.cdr.markForCheck()

        this.service.gmailLogin(user).pipe(
            finalize(() => {
                this.isLoading.set(false)
                this.cdr.markForCheck()
            })
        ).subscribe({
            next: (response) => {
                if (response.status === "false") {
                    this.toast.add({ severity: "error", summary: "Error", detail: response.message || 'Login failed' })
                    return
                }
                this.handleSuccessfulLogin(response.token)
            },
            error: (error) => {
                this.toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: error?.error?.message || error.message || 'Social login failed'
                })
            }
        })
    }

    private handleSuccessfulLogin(token: string) {
        this.service.saveToken(token)
        this.authTokenService.setToken(token)
        this.storage.set(environment.tokenKey, token)
        this.service.getMe().subscribe({
            next: (userData) => {
                this.loadCountryList(userData)
                let userDetails = userData.userdetails[0];
                let req = {
                    userId: userData.userdetails[0].user_id,
                    location: this.locationData.city,
                    country: this.locationData.country_name,
                };
                this.locationService.sendSessionData(req, "login").subscribe();
                this.toast.add({ severity: "success", summary: "Success", detail: "Login Successful" })
                if (!userDetails.city_id) {
                    setTimeout(() => {
                        this.updateLocation();
                    }, 1000); //because of the token is not set. so i added the timeout
                }

                // if (this.jobId) {
                //     this.route.navigate([this.jobId], { replaceUrl: true })
                // }
                if (this.jobId) {
                    this.route.navigate([`/pages/talent-connect/easy-apply/${this.storage.get('jobId')}`], { replaceUrl: true })
                } else {
                    this.route.navigate(["/pages/dashboard"], { replaceUrl: true })
                }
            },
            error: (error) => {
                this.toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.message || 'Failed to load user data'
                })
            }
        })
    }

    updateLocation() {
        this.updateCurrentLocation().then((userLocation) => {
            if (userLocation.country != "Unknown" && userLocation.city != "Unknown") {
                this.locationService.updateUserLocation(userLocation).subscribe()
            }
        })
    }

    // private getCountryFromIP() {
    //     const url = 'https://ipapi.co/json/';
    //     return this.http.get<any>(url);
    // }

    async updateCurrentLocation() {
        let userLocation: { country: string; city: string } = await this.countryLocationService.getUserCountry();
        return userLocation;
        // try {
        //     const ipData = await firstValueFrom(this.getCountryFromIP());
        //     return {
        //         country: ipData.country_name || 'Unknown',
        //         city: ipData.city || 'Unknown'
        //     };
        // } catch {
        //     return {
        //         country: 'Unknown',
        //         city: 'Unknown'
        //     };
        // }
    }
}
