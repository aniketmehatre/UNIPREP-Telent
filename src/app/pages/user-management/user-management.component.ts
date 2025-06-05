import { Component, Input, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AuthService } from "../../Auth/auth.service"
import { LocationService } from "../../location.service"
import { ConfirmationService, MessageService } from "primeng/api"
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
import { StorageService } from "../../storage.service";
import { catchError, combineLatest, EMPTY, finalize, forkJoin, of, timeout } from "rxjs"
import { InputSwitchModule } from "primeng/inputswitch"
import { TableModule } from "primeng/table"
import { SubscriptionService } from "../subscription/subscription.service"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { AuthTokenService } from "src/app/core/services/auth-token.service"
import { CalendarModule } from "primeng/calendar"
import { PasswordModule } from "primeng/password"
@Component({
	selector: "uni-user-management",
	templateUrl: "./user-management.component.html",
	styleUrls: ["./user-management.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, PasswordModule, ConfirmDialogModule, CalendarModule, TableModule, InputSwitchModule, FormsModule, ReactiveFormsModule, SkeletonModule, FluidModule, InputTextModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule, FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DialogModule, CardModule, InputNumberModule],
	providers: [ConfirmationService]
})
export class UserManagementComponent implements OnInit {
	user!: User | null
	locationList: any;
	registrationForm!: FormGroup
	countryList: any
	currentDate = new Date()
	dateTime = new Date()
	maximumTime = new Date()
	selectedDate: any
	updatedPasswords: FormGroup
	PasswordSubmitted = false
	newsLetter: boolean = false
	PersonalInfo: any = []
	hideToolTip: boolean = true
	private subs = new SubSink()
	activeSection: string = 'profileCard';
	sendInvite: any = ""
	cvBuilderPercentage: number = 0;
	talentConnectPercentage: number = 0;
	totalPercentage: number = 0;
	progress: number = 0;
	userData: any;
	newsletter_consent: any = 0;
	promotional_email_consent: any = 0;
	product_update_email_consent: any = 0;
	fieldsToCheck = ["name", "email", "phone", "home_country_id", "selected_country", "location_id", "last_degree_passing_year", "intake_year_looking", "intake_month_looking", "programlevel_id"]
	settings: any[] = [];
	subscribedHistoryList: any[] = [];
	subscribedTransactionList: any[] = [];
	studentType: number = 0;
	submitName: any = "Edit"
	editLabelIsShow: boolean = true;
	imageWhiteLabelDomainName: any;
	userTypeId: boolean = true
	constructor(private authService: AuthService, private formBuilder: FormBuilder,
		private locationService: LocationService, private toast: MessageService,
		private dataService: DataService, private dashboardService: DashboardService,
		private userManagementService: UserManagementService, private router: Router,
		private _location: Location, private storage: StorageService, private subscription: SubscriptionService,
		private confirmationService: ConfirmationService, private authTokenService: AuthTokenService,) {

		this.registrationForm = this.formBuilder.group({
			name: [""],
			location_id: [""],
			phone: [""],
			home_country: [""],
			last_degree_passing_year: [""],
			email: [""],
			current_education: [""]
		})

		this.updatedPasswords = this.formBuilder.group({
			current_password: ["", [Validators.required]],
			new_password: ["", [Validators.required]],
			confirm_password: ["", [Validators.required]],
		})
	}

	get updatePassword() {
		return this.updatedPasswords.controls
	}

	goBack() {
		this._location.back()
	}

	ngOnInit(): void {
		this.userTypeId = this.authService._user?.student_type_id === 2
		this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
			this.imageWhiteLabelDomainName = data.source
		})
		this.editLabelIsShow = this.imageWhiteLabelDomainName === "uniprep" ||
			this.imageWhiteLabelDomainName === "Partner"
		this.dateTime.setDate(this.dateTime.getDate())
		this.getCountryList();
		this.handleUserData();
		this.integrationPartActiveOrInactive();
		this.getSubscriptions();
		this.authService.userData.subscribe((data) => {
			if (data) {
				this.user = data
				let mon = this.getMonthName(this.user?.intake_month_looking)
				this.newsLetter = this.user.newsletter_consent == 1 ? true : false
			}
		})
		this.GetPersonalProfileData()
		setTimeout(() => {
			this.hideToolTip = false
		}, 10000)
	}

	// new code
	getMonthName(monthNumber: any) {
		const date = new Date()
		date.setMonth(monthNumber - 1)
		return date.toLocaleString("en-US", { month: "long" })
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

	getCountryList() {
		this.locationService.getHomeCountry(2).subscribe(
			(res: any) => {
				this.countryList = res.filter((country: any) => country.id === 122)
			},
			(error: any) => { }
		)
	}

	changeLocation(event: any) {
		const selectedCountry = this.countryList.find((country: any) => country.id === event.value)
		if (selectedCountry) {
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
	scrollToSection(id: string): void {
		const section = document.getElementById(id);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	setSwitchSection(section: string): void {
		this.activeSection = section;
	}

	isSwitchSection(): boolean {
		return ['subscription'].includes(this.activeSection);
	}

	isActive(section: string): boolean {
		return this.activeSection === section;
	}
	GetPersonalProfileData() {
		this.registrationForm.disable();
		this.userManagementService.GetUserPersonalInfo().subscribe((data) => {
			this.PersonalInfo = data
			this.newsletter_consent = this.PersonalInfo?.newsletter_consent == 1 ? 1 : 0;
			this.promotional_email_consent = this.PersonalInfo?.promotional_email_consent == 1 ? 1 : 0;
			this.product_update_email_consent = this.PersonalInfo?.product_update_email_consent == 1 ? 1 : 0;
			this.settings = [
				{
					title: 'Weekly Newsletter',
					description: 'Get notified about articles, discounts and new products.',
					enabled: this.newsletter_consent,
					per_true: "You’ve successfully subscribed to the Weekly Newsletter. Look out for updates in your inbox!",
					per_false: "Are you sure you want to unsubscribe from the Weekly Newsletter?"
				},
				{
					title: 'Promotional Emails',
					description: 'Get personalised emails based on your orders and preferences.',
					enabled: this.promotional_email_consent,
					per_true: "You’ve subscribed to promotional emails. Stay tuned for the latest offers and news!",
					per_false: "Are you sure you want to stop receiving promotional emails?"
				},
				{
					title: 'Product Updates',
					description: 'Checking this will enable us to notify you on updates and addition of new features to our product.',
					enabled: this.product_update_email_consent,
					per_true: "You’ve subscribed to product updates. We’ll keep you informed about the latest features and improvements!",
					per_false: "Are you sure you want to stop receiving product updates?"

				}
			];
			this.registrationForm.patchValue({
				name: this.PersonalInfo?.name,
				location_id: this.PersonalInfo?.location_id,
				home_country: this.PersonalInfo?.home_country_id == null ? null : Number(this.PersonalInfo?.country),
				last_degree_passing_year: this.PersonalInfo?.last_degree_passing_year,
				 phone: `${this.PersonalInfo?.country_code || ''} ${this.PersonalInfo?.phone || ''}`,
				email: this.PersonalInfo?.email,
				current_education: this.PersonalInfo?.programlevel
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
	// update password
	UserUpdatePassword(updatedPasswords: any) {
		let data = this.updatedPasswords.value
		this.PasswordSubmitted = true
		if (this.updatedPasswords.invalid) {
			return
		}
		this.subs.sink = this.userManagementService.CompareUserPassword(data).subscribe((passwordconfirmation) => {
			if (passwordconfirmation.severity == "success") {
				this.updatedPasswords.patchValue({
					current_password: "",
					new_password: "",
					confirm_password: "",
				})
			}
			return this.toast.add({ severity: passwordconfirmation.severity, summary: "Success", detail: passwordconfirmation.message })
		})
		this.PasswordSubmitted = false
	}

	// invite email
	sendInviteMail() {
		var data = {
			email: this.sendInvite
		}
		this.dashboardService.sentEmailForInviteUniPrep(data).subscribe({
			next: (data: any) => {
				this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
				this.sendInvite = ""
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
				this.toast.add({ severity: 'success', summary: 'Success', detail: "The email field is required" });

			}
		});
	}

	handleUserData() {
		let filledCount = 0;
		const totalCount = this.fieldsToCheck.length;
		this.userData = this.authService._user;
		this.fieldsToCheck.forEach((field) => {
			if (this.userData[field] != null && this.userData[field] !== undefined && this.userData[field] !== "") {
				filledCount++;
			}
		});

		this.progress = Math.round((filledCount / totalCount) * 100);
		this.setProgress(Math.round((filledCount / totalCount) * 100));
	}
	setProgress(progress: number) {
		this.progress = Math.max(0, Math.min(progress, 100));
		this.profileCompletion();
	}
	profileCompletion() {
		this.dashboardService.profileCompletion().subscribe({
			next: (data: any) => {
				this.cvBuilderPercentage = data.cv_builder_completion
				this.talentConnectPercentage = data.talent_connect_completion
				this.totalPercentage = Math.floor((this.cvBuilderPercentage + this.talentConnectPercentage + this.progress) / 3);
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}

	logout() {
		// this.isLoading = true;
		// Create a cleanup function to handle all synchronous operations
		const cleanupLocalState = () => {
			window.sessionStorage.clear();
			localStorage.clear();
			this.authService.clearCache();
			this.locationService.clearCache();
			this.authTokenService.clearToken();
			// this.isLoading = false;
		};

		// Prepare all API calls that need to be made
		const logoutRequests = [
			this.authService.logout().pipe(
				catchError(error => {
					console.warn('Logout API error:', error);
					return EMPTY;
				})
			),
			this.locationService.sessionEndApiCall().pipe(
				catchError(error => {
					console.warn('Session end API error:', error);
					return EMPTY;
				})
			)
		];

		// Execute all logout operations in parallel
		forkJoin(logoutRequests).pipe(
			timeout(5000), // 5 second timeout for all requests
			finalize(() => {
				// Always clean up local state, even if requests fail
				cleanupLocalState();
				// Navigate to login page
				this.router.navigate(['/login'], { replaceUrl: true });
			}),
			catchError(error => {
				console.warn('Logout process error:', error);
				// Still clean up and redirect on error
				cleanupLocalState();
				this.router.navigate(['/login'], { replaceUrl: true });
				return EMPTY;
			})
		).subscribe({
			next: () => {
				this.toast.add({
					severity: 'success',
					summary: 'Success',
					detail: 'Logged out successfully'
				});
			},
			error: (error) => {
				console.error('Logout error:', error);
				this.toast.add({
					severity: 'info',
					summary: 'Info',
					detail: 'Logged out with some pending requests'
				});
			}
		});
	}
	// get name short form
	getInitials(name: string): string {
		if (!name) return '';
		const parts = name.trim().split(' ');
		const initials = parts.map(p => p.charAt(0)).slice(0, 2).join('');
		return initials.toUpperCase();
	}
	confirmEmailToggle(event: any, setting: any) {
		const newValue = event.checked ? 1 : 0;
		const message = event.checked ? setting.per_true : setting.per_false;
		this.confirmationService.confirm({
			message: message,
			header: 'Confirm Change',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				setting.enabled = newValue;
				this.emailSettings(setting); // Proceed with API call
			},
			reject: () => {
				// Revert toggle (optional visual correction)
				setting.enabled = setting.enabled === 1 ? 0 : 1;
			}
		});
	}
	emailSettings(email: any) {
		const title = email.title
		if (title == "Weekly Newsletter") {
			var data = {
				newsletter_consent: email.enabled
			}
			this.userManagementService.newsLetterConsent(data).subscribe({
				next: (data: any) => {
					this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
				},
				error: (error) => {
					console.error('Error fetching job listings:', error);
				}
			});
		} else if (title == "Promotional Emails") {
			var data1 = {
				promotional_email_consent: email.enabled
			}
			this.userManagementService.promotionalEmailConsent(data1).subscribe({
				next: (data: any) => {
					this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
				},
				error: (error) => {
					console.error('Error fetching job listings:', error);
				}
			});
		} else {
			var data2 = {
				product_update_email_consent: email.enabled
			}
			this.userManagementService.productUpdateEmailConsent(data2).subscribe({
				next: (data: any) => {
					this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
				},
				error: (error) => {
					console.error('Error fetching job listings:', error);
				}
			});
		}

	}
	associatedMail: any = "";
	integrationPartActiveOrInactive() {
		this.userManagementService.integrationPartActiveOrInactive().subscribe({
			next: (data: any) => {
				this.associatedMail = data.mail;
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}
	onClickUpgradePlan() {
		this.router.navigate(["/pages/subscriptions/upgrade-subscription"])
	}
	getSubscriptions() {
		this.subscription.getSubscriptionHistory().subscribe({
			next: (data: any) => {
				this.subscribedTransactionList = data.accountbillings;
				this.subscribedHistoryList = data.subscriptionhistory
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}
	downloadInvoice(id: number): void {
		let data: any = {
			user_subscription_id: id,
		}
		let creditObj = this.subscribedTransactionList.find((item: any) => item.product == "Credit")

		if (creditObj?.id == id) {
			data.payment_type = creditObj.payment_type
		}
		this.subscription.downloadInvoice(data).subscribe((response) => {
			window.open(response, "_blank")
		})
	}
	// mobile view side menu
	isSidebarVisible: boolean = false;
	toggleSidebar(): void {
		this.isSidebarVisible = !this.isSidebarVisible;
	}
	closeMobileMenu() {
		this.isSidebarVisible = false;
	}
	extractYear(dateString: string): number {
		const date = new Date(dateString);
		return date.getFullYear();
	}
	onSubmit() {
		if (this.submitName == "Edit") {
			this.registrationForm.get('last_degree_passing_year')?.enable();
			this.registrationForm.get('location_id')?.enable();
			this.submitName = "Update"
			return;
		}
		let data = {
			location_id: this.registrationForm.value.location_id,
			last_degree_passing_year: this.extractYear(this.registrationForm.value.last_degree_passing_year),
		}
		this.userManagementService.updateUserDetails(data).subscribe({
			next: (data: any) => {
				this.toast.add({ severity: 'success', summary: 'Success', detail: data.message });
				this.registrationForm.get('last_degree_passing_year')?.disable();
				this.registrationForm.get('location_id')?.disable();
				this.submitName = "Edit"
				this.GetPersonalProfileData();
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}
	// block p-calender text ,
	onKeyPress(event: KeyboardEvent) {
		const key = event.key;
		const isNumber = /^[0-9]$/.test(key);

		if (!isNumber) {
			event.preventDefault(); // block letters/symbols
		}
	}
	// Trim the input to max 4 digits in p-calender
	onYearInput(event: any) {
		const inputEl = event.target;
		inputEl.value = inputEl.value.replace(/[^0-9]/g, '').slice(0, 4);
	}
	passwordFields = {
		current: { visible: false, type: 'password' },
		new: { visible: false, type: 'password' },
		confirm: { visible: false, type: 'password' }
	};

	togglePassword(field: 'current' | 'new' | 'confirm') {
		const passwordField = this.passwordFields[field];
		passwordField.visible = !passwordField.visible;
		passwordField.type = passwordField.visible ? 'text' : 'password';
	}
}
