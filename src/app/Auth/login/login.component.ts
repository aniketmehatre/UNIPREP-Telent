import { CommonModule } from "@angular/common"
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	inject,
	OnDestroy,
	OnInit, ViewChild
} from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { MessageService } from "primeng/api"
import { FluidModule } from "primeng/fluid"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputIconModule } from "primeng/inputicon"
import { InputTextModule } from "primeng/inputtext"
import { PasswordModule } from "primeng/password"
import { AuthTokenService } from "src/app/core/services/auth-token.service"
import { DataService } from "src/app/data.service"
import { SubSink } from "subsink"
import { LocationService } from "../../location.service"
import { AuthService } from "../auth.service"
import { finalize } from 'rxjs/operators'
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, } from '@abacritt/angularx-social-login'
import { signal } from '@angular/core'

declare var google: any;
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true,
	imports: [CommonModule, FluidModule, PasswordModule, RouterModule, InputTextModule, InputIconModule,
		InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule,
		SocialLoginModule, GoogleSigninButtonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
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

	@ViewChild("button2") button2!: ElementRef
	private subs = new SubSink()
	loginForm: FormGroup
	domainNameCondition: string
	ipURL: string = "https://api.ipify.org?format=json"
	locationData: any
	isInstitute = signal(false)

	submitted = signal(false);
	show = signal(true);
	isLoading = signal(false);
	isDisabled = signal(false);
	imageUrlWhitelabel = signal<string | null>(null);
	domainname = signal('main');
	password = signal('password')

	ngOnDestroy() {
		this.subs.unsubscribe()
	}

	ngOnInit() {
		localStorage.clear()
		this.initializeComponent()
		this.setupSocialAuth()
		this.apiToCheckPartnerOrInstitute()
	}

	get canSubmit() {
		return this.loginForm.valid && !this.isLoading();
	}

	private initializeComponent() {
		this.domainNameCondition = window.location.hostname
		this.domainname.set(this.isDomainMain() ? 'main' : 'sub')
		this.dataService.loggedInAnotherDevice("none")
		fetch(this.ipURL)
			.then((response) => response.json())
			.then((data) => {
				this.locationData = data
			})
		this.locationService.getSourceByDomainName().subscribe((data:any) => {
            this.imageUrlWhitelabel = data.logo
            this.cdr.markForCheck()
        })
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]],
			domain_type: ['main']
		})
		this.loginForm.patchValue({ domain_type: this.domainname })
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
					this.toast.add({ severity: "error", summary: "Error", detail: error.message || 'Social login check failed' })
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
				this.toast.add({ severity: "error", summary: "Error", detail: error?.error?.message || error.message || 'Social login failed' })
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
				this.storage.set('user_type_id', userData.userdetails[0].usertype_id);
				let req = {
					userId: userData.userdetails[0].user_id,
					location: this.locationData.city,
					country: this.locationData.country_name,
				};
				this.locationService.sendSessionData(req, "login").subscribe();
				this.toast.add({ severity: "success", summary: "Success", detail: "Login Successful" })
				this.route.navigate(["/pages/dashboard"], { replaceUrl: true })
			},
			error: (error) => {
				this.toast.add({ severity: "error", summary: "Error", detail: error.message || 'Failed to load user data' })
			}
		})
	}

	countryLists: any
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

	get f() {
		return this.loginForm.controls;
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
				if (response?.token) {
					this.handleSuccessfulLogin(response.token)
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
		let req = {
			domain: window.location.hostname,
		}
		this.locationService.getSourceByDomain(req).subscribe((response) => {
			if (response.source == 'Institute') {
				this.isInstitute.set(true);
			}
		})
	}
}
