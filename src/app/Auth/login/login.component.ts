import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../auth.service"
import { MessageService } from "primeng/api"
import { SubSink } from "subsink"
import { DataService } from "src/app/data.service"
import { DashboardService } from "../../pages/dashboard/dashboard.service"
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService } from "@abacritt/angularx-social-login"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { Observable } from "rxjs/internal/Observable"
import { FacebookLoginProvider } from "angularx-social-login"
// import {FacebookService} from "ngx-facebook";
import { LocationService } from "../../location.service"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { InputTextModule } from "primeng/inputtext"
import { CommonModule } from "@angular/common"
import { InputIconModule } from "primeng/inputicon"
import { SocialLoginModule, SocialAuthServiceConfig } from "@abacritt/angularx-social-login"

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true,
	imports: [CommonModule, RouterModule, InputTextModule, InputIconModule, InputGroupModule, InputGroupAddonModule, SocialLoginModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit, OnDestroy {
	@ViewChild("button2") button2!: ElementRef
	private subs = new SubSink()
	loginForm: any = FormGroup
	submitted: boolean = false
	show: boolean = true
	password: string = "password"
	isDisabled: boolean = false
	locationData: any
	imageUrlWhitelabel: string | null = null
	domainname: any
	domainnamecondition: any
	constructor(private service: AuthService, private formBuilder: FormBuilder, private route: Router, private toast: MessageService, private dataService: DataService, private el: ElementRef, private locationService: LocationService, private authService: SocialAuthService, private storage: LocalStorageService) {}

	linkedInCredentials = {
		clientId: environment.linkedinId,
		redirectUrl: "http://localhost:4200/pages/dashboard",
		scope: "r_liteprofile%20r_emailaddress%20w_member_social", // To read basic user profile data and email
	}

	button1Clicked() {
		this.button2.nativeElement.click()
	}

	ngOnDestroy() {
		this.subs.unsubscribe()
	}

	showPassword(): void {
		if (this.password === "password") {
			this.password = "text"
			this.show = false
		} else {
			this.password = "password"
			this.show = true
		}
	}

	ngOnInit() {
		if (this.service.isTokenValid()) {
			this.route.navigate(["/pages/dashboard"]) // Redirect to dashboard
		}
		this.locationService.getImage().subscribe((imageUrl) => {
			this.imageUrlWhitelabel = imageUrl
		})
		this.domainnamecondition = window.location.hostname
		if (this.domainnamecondition === "dev-student.uniprep.ai" || this.domainnamecondition === "uniprep.ai" || this.domainnamecondition === "localhost") {
			this.domainname = "main"
		} else {
			this.domainname = "sub"
		}
		this.dataService.loggedInAnotherDevice("none")
		fetch("https://ipapi.co/json/")
			.then((response) => response.json())
			.then((data) => {
				this.locationData = data
			})
		this.authService.authState.subscribe((user) => {
			let data = {
				email: user.email,
			}
			this.service.isExist(data).subscribe((data) => {
				if (data == "Exist") {
					this.service.gmailLogin(user).subscribe(
						(data) => {
							if (data.status == "error") {
								this.toast.add({ severity: "error", summary: "Error", detail: data })
								return
							}
							this.service.saveToken(data.token)
							this.storage.set(environment.tokenKey, data.token)
							this.service.getMe().subscribe((data) => {
								this.loadCountryList(data)
								this.toast.add({ severity: "success", summary: "Success", detail: "Login" })
								this.route.navigate(["/pages/dashboard"])
							})
						},
						(error: any) => {
							this.toast.add({
								severity: "error",
								summary: "Error",
								detail: error,
							})
						}
					)
				} else {
					this.toast.add({ severity: "info", summary: "Info", detail: "Email not exist , Try Register" })
				}
			})
			//var socialUser = user;
			//this.loggedIn = (user != null);
		})
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]],
			domain_type: [this.domainname],
		})
		this.subs.sink = this.service.selectloggedIn$().subscribe((loggedIn) => {
			if (!loggedIn) {
				return
			}

			this.dataService.showTimerInHeader(loggedIn)
			this.subs.sink = this.service!.getMe().subscribe((data) => {
				this.service.saveToken(data.userdetails[0].token)
				this.loadCountryList(data)
				this.subs.sink = this.service.selectMessage$().subscribe((message) => {
					if (message == "Login Success") {
						let req = {
							userId: data.userdetails[0].user_id,
							location: this.locationData.city,
							country: this.locationData.country_name,
						}
						this.locationService.sendSessionData(req, "login").subscribe((response) => {
							//console.log('addtrack', response);
						})
						this.toast.add({ severity: "success", summary: "Success", detail: message })
					}
				})
				let url = localStorage.getItem("previousUrl") || ""
				if (url) {
					this.route.navigate([url])
				} else {
					this.route.navigate(["/pages/dashboard"])
				}
			})
		})
	}

	countryLists: any
	loadCountryList(data: any) {
		this.locationService.getCountry().subscribe((countryList) => {
			this.countryLists = countryList
			this.countryLists.forEach((element: any) => {
				let cont = Number(data.userdetails[0].selected_country)
				if (element.id == cont) {
					localStorage.setItem("countryId", cont.toString())
					this.dataService.changeCountryName(element.country)
					this.dataService.changeCountryFlag(element.flag)
					this.dataService.changeCountryId(element.id)
				}
			})
		})
	}

	get f() {
		return this.loginForm.controls
	}

	onSubmit(): void {
		this.submitted = true;
		if (this.loginForm.invalid) {
			return;
		}
		this.service.canDisableSignIn.next(true)
		this.service.login(this.loginForm.value)
		this.service.canDisableSignIn.subscribe((res) => {
			this.isDisabled = res
		})
	}

	// loginWithFacebook(){
	//   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
	// }
	//
	// loginWithLinkedIn(){
	//     this.ngxLinkedinService.signIn().subscribe(user => {
	//       console.info('signIn', user);
	//     });
	//   window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
	//       this.linkedInCredentials.clientId
	//   }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope={this.linkedInCredentials.scope}`;
	// }
}
