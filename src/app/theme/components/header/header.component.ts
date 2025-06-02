import { SocialAuthService } from "@abacritt/angularx-social-login"
import { CommonModule } from "@angular/common"
import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
	ViewEncapsulation
} from "@angular/core"
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router"
import { MenuItem, MessageService } from "primeng/api"
import { AuthService } from "../../../Auth/auth.service"
import { SubSink } from "subsink"
import { LocationService } from "../../../location.service"
import { DataService } from "src/app/data.service"
import { ThemeService } from "../../../theme.service"
import { DashboardService } from "src/app/pages/dashboard/dashboard.service"
import { catchError, count, EMPTY, finalize, forkJoin, Observable, timeout } from "rxjs"
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from "ngx-intl-tel-input"
import { environment } from "@env/environment"
import { DialogModule } from "primeng/dialog"
import { PopoverModule } from "primeng/popover"
import { TabsModule } from "primeng/tabs"
import { ILearnChallengeData } from "src/app/@Models/ilearn-challenge.model"
import { AssessmentService } from "src/app/pages/assessment/assessment.service"
import { AvatarModule } from "primeng/avatar"
import { InputTextModule } from "primeng/inputtext"
import { take, throwIfEmpty } from "rxjs/operators"
import { SelectModule } from "primeng/select"
import { TabViewModule } from "primeng/tabview"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { TextareaModule } from 'primeng/textarea'
import { AuthTokenService } from 'src/app/core/services/auth-token.service'
import { AvatarGroupModule } from 'primeng/avatargroup';
import { StorageService } from "../../../storage.service";
import { DropdownModule } from "primeng/dropdown";
import { PromptService } from "src/app/pages/prompt.service"
import { User } from "src/app/@Models/user.model"

@Component({
	selector: "uni-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CommonModule,
		DialogModule,
		TabViewModule,
		RouterModule,
		TabsModule,
		PopoverModule,
		FormsModule,
		ReactiveFormsModule,
		AvatarModule,
		NgxIntlTelInputModule,
		InputTextModule,
		PopoverModule,
		SelectModule,
		InputGroupModule,
		InputGroupAddonModule,
		TextareaModule,
		AvatarGroupModule,
		DropdownModule,
	]
})
export class HeaderComponent implements OnInit, OnDestroy {
	@ViewChild("op") op!: ElementRef<HTMLInputElement>
	public reportSubmitForm!: FormGroup
	public mobileForm!: FormGroup
	public currentEducationForm!: FormGroup
	public phoneVerification!: FormGroup
	@Input() breadcrumb: MenuItem[] = [{ label: "Categories" }, { label: "Sports" }]
	@Input() expandicon = ""

	@Output() togleSidebar = new EventEmitter()
	private subs = new SubSink()
	userName: string = ""
	firstChar: string = "U"
	genMod: any
	moduleNgModel: number = 1
	selectedGenMod: number = 1
	subModuleNgModel: number = 1
	questionIdNgModel: number = 1
	reportOptionNgModel: number = 0
	selectedCountryId: any
	selectedModuleId: any
	moduleList: any[] = []
	subModuleList: any[] = []
	questionList: any
	moduleQuestionReport: any
	reportOptionList: any[] = []
	darkModeSwitch!: HTMLInputElement
	visible: boolean = false
	isShowFreeTrialStart: boolean = false
	day$: Observable<any> | any
	hrs$: Observable<any> | any
	min$: Observable<any> | any
	sec$: Observable<any> | any
	month$: Observable<any> | any
	isVisibleModulesMenu: boolean = false
	isChatWindowVisible: boolean = false
	isQuestionVisible: boolean = true
	messages: any = []
	headerFlag: any = ""
	headerHomeFlag: any = ""
	homeCountryId: any
	homeCountryName: string = ""
	selectedHomeCountry: any = null
	timeLeftSecs: any
	timerInterval: any
	userLoginTimeLeftCount!: boolean
	timeLeftMins: any
	isLondon!: boolean
	countryLists!: any
	timeHours: any
	timeDays: any
	freeTrial: boolean
	visibleExhasted: boolean = false
	reportType: number = 1
	SearchCountryField = SearchCountryField
	CountryISO = CountryISO
	preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom]
	timeLeftInfo: any
	freeTrialErrorMsg: string = ""
	demoTrial: boolean = false
	demoDays: any
	reportlearnlanguagetype: number = 0
	countryList: any //this is the original home country list for time being am doing like this.
	indiaHomeCountry: any = [{ country: "India", id: 122 }]
	locationList: any
	whiteLabelIsNotShow: boolean = true
	visibleExhastedUser!: boolean
	programLevelList: any = []
	currentEducation!: boolean
	whatsappVerification: boolean = false
	ApiUrl: string = environment.domain
	educationImage: string = ""
	otp: string[] = ["", "", "", ""]
	otpArray = Array(4).fill(0)
	dialogVisible: boolean = false

	currentUserSubscriptionPlan: string = ""
	iLearnChallengeData: ILearnChallengeData
	isUpgradePlanVisible: boolean = false
	isILeanrParticipantsVisible: boolean = false
	isILearnLiveVisible: boolean = false
	isILearnCompletedVisible: boolean = false
	assParticipations: number = 0
	formvisbility = false
	preferredCountry: any
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	isNotSuccess: boolean = true
	aiCreditCount: number = 0;

	haveWhatsapp: string = 'WhatsApp'
	// Add phone number configuration
	phoneNumberConfig = {
		preferredCountries: [CountryISO.India],
		enablePlaceholder: true,
		searchCountryFlag: true,
		searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
		selectedCountryISO: CountryISO.India,
	}

	showSearch: boolean = true
	isShowHeaderSearchForModule: boolean = false
	phone: string = ''

	isLoading: boolean = false
	isMenuOpen = true

	phoneNumber: any
	isPhoneDisabled: boolean = true
	activeheadersearch: any
	protected readonly count = count
	enterpriseSubscriptionLink: any
	isCountryPopupOpen: any
	ehitlabelIsShow: boolean = true;
	isSendingOTP: boolean = false
	isResendOTP: boolean = false
	allSearchedResult: any[] = []
	currentRoute: string = ""
	userTypeId : boolean = true
	constructor(
		private router: Router,
		private locationService: LocationService,
		private formBuilder: FormBuilder,
		public service: AuthService,
		private toast: MessageService,
		private themeService: ThemeService,
		route: ActivatedRoute,
		private authService: SocialAuthService,
		private dataService: DataService,
		private dashboardService: DashboardService,
		private assessmentService: AssessmentService,
		private authTokenService: AuthTokenService,
		private storage: StorageService,
		private promptService: PromptService
	) {
		this.dataService.openReportWindowSource.subscribe({
			next: (data) => {
				console.log('othermodule')

				console.log('data', data);
			},
			error: (error) => console.error("Error in report window subscription:", error),
		})
		// Initialize forms in constructor
		this.reportSubmitForm = this.formBuilder.group({
			general: [1, [Validators.required]],
			moduleId: ["", [Validators.required]],
			submoduleId: ["", [Validators.required]],
			questionId: ["", [Validators.required]],
			reportOption: [""],
			comment: ["", []],
		})

		this.mobileForm = this.formBuilder.group({
			phone: [undefined, [Validators.required]],
			home_country: [122, Validators.required],
			study_level: ["", Validators.required],
		})

		this.currentEducationForm = this.formBuilder.group({
			current_education: ["", Validators.required],
		})

		this.phoneVerification = this.formBuilder.group({
			verification_phone: ["", Validators.required],
			choice: [false, Validators.required],
			otp: this.otp
		})

		this.dataService.castValue.subscribe((data) => {
			if (data === true) {
				this.checkNewUSerLogin()
			} else {
				this.freeTrial = false
			}
		})
		route.params.subscribe((val) => {
			this.reportType = 1
			this.getReportOption()
			// put the code from `ngOnInit` here
			this.loadCountryList()
		})
		this.service.getTimeInfoForCard().subscribe((data) => {
			this.storage.set("time_card_info", data.card_message)
		})
		this.assessmentService.iLearnChallengeData$.subscribe((data) => {
			this.iLearnChallengeData = data
		})
		this.assessmentService.sideMenuiLearnChallengeData$.subscribe((data) => {
			if (data) {
				this.navigateILearnChallenge()
			}
		})
		router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				this.conditionModuleOrQuestionComponent()
			}
		})

		this.service.aiCreditCount$.subscribe(value => {
			if (value) {
				this.getAICreditCount();
			}
		})
	}

	buyCredits() {
		if (this.service.isInvalidSubscription('ai_credit_count')) {
			this.service.hasUserSubscription$.next(true);
		} else {
			this.router.navigate(["/pages/export-credit"]);
		}
	}

	loadCountryList() {
		this.subs.sink = this.locationService.getCountry().subscribe({
			next: (countryList) => {
				this.countryLists = countryList

				// Get the selected country ID from localStorage
				const storedCountryId = this.storage.get("selectedCountryId")

				if (storedCountryId) {
					// If we have a stored selection, use that
					this.selectedCountryId = Number(storedCountryId)
					const selectedCountry = this.countryLists.find((element: any) => element.id === this.selectedCountryId)

					if (selectedCountry) {
						this.headerFlag = selectedCountry.flag
						this.dataService.changeCountryName(selectedCountry.country)
						this.dataService.changeCountryFlag(selectedCountry.flag)
						this.dataService.changeCountryId(selectedCountry.id.toString())
					}
				} else {
					// If no stored selection, try to use the home country
					const homeCountryId = this.storage.get("homeCountryId")
					if (homeCountryId) {
						this.selectedCountryId = Number(homeCountryId)
						const homeCountry = this.countryLists.find((element: any) => element.id === this.selectedCountryId)

						if (homeCountry) {
							this.headerFlag = homeCountry.flag
							this.dataService.changeCountryName(homeCountry.country)
							this.dataService.changeCountryFlag(homeCountry.flag)
							this.dataService.changeCountryId(homeCountry.id.toString())
							this.storage.set("selectedCountryId", homeCountry.id.toString())
						}
					} else {
						// If no home country either, then default to India (122)
						const defaultCountry = this.countryLists.find((element: any) => element.id === 122)
						if (defaultCountry) {
							this.headerFlag = defaultCountry.flag
							this.dataService.changeCountryName(defaultCountry.country)
							this.dataService.changeCountryFlag(defaultCountry.flag)
							this.dataService.changeCountryId("122")
							this.storage.set("selectedCountryId", "122")
						}
					}
				}
			},
			error: (error) => {
				console.error("Error loading country list:", error)
			},
		})
	}

	toggleMenu() {
		const sidenav: Element | null = document.getElementById("sidenav")
		if (sidenav) {
			this.isMenuOpen = !this.isMenuOpen
			this.storage.set("isMenuOpen", JSON.stringify(this.isMenuOpen))
			this.updateMenuClass()
		}
	}

	onInputOTP(event: Event, index: number): void {
		const input = event.target as HTMLInputElement
		const value = input.value
		this.otp[index] = value
		// Move to next box if a digit is entered
		if (value && value.length === 1 && index < 3) {
			const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
			nextInput.focus()
		}
	}

	onKeydownOPT(event: KeyboardEvent, index: number): void {
		const input = event.target as HTMLInputElement

		// Move to the previous box if backspace is pressed and input is empty
		if (event.key === "Backspace" && !input.value && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
			prevInput.focus()
		}
	}

	sendOTP() {
		if (this.phoneVerification.value.verification_phone == null ||
			this.phoneVerification.get('verification_phone')?.errors?.['validatePhoneNumber']) {
			this.toast.add({
				severity: "error",
				summary: "Error",
				detail: "Enter valid Phone Number",
			})
			return;
		}
		this.phoneVerification.disable()
		let formData = this.phoneVerification.value

		let sendPhoneNumber = {
			country_code: formData.verification_phone.dialCode,
			phone: formData.verification_phone.number,
			whatsapp_number_or_not: formData.choice,
			dial_code: formData.verification_phone.countryCode,
		}
		this.service.sendWhatsappOtp(sendPhoneNumber).subscribe({
			next: (response) => {
				this.isSendingOTP = true
				this.toast.add({
					severity: "success",
					summary: "Success",
					detail: response.message,
				})
			},
			error: (error) => {
				this.phoneVerification.enable()
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: error?.error?.message,
				})
			},
		})
	}

	onEditNumber() {
		this.phoneVerification.enable();
		this.isSendingOTP = false;
	}

	submitPhoneVerification() {
		let formData = this.phoneVerification.value
		let sendOTP = {
			country_code: formData.verification_phone.dialCode,
			phone: formData.verification_phone.number,
			dial_code: formData.verification_phone.countryCode,
			otp: this.otp.join(""),
			whatsapp_number_or_not: formData.choice,
		}
		this.phoneVerification.get('verification_phone')?.disable();

		this.service.validateWhatsappOtp(sendOTP).subscribe({
			next: (response) => {
				if (response.message == 'Otp Invalid') {
					this.toast.add({
						severity: "error",
						summary: "Error",
						detail: response.message,
					})
				} else {
					this.whatsappVerification = false
					this.freeTrial = true
					this.isPhoneDisabled = true
					this.formvisbility = true
					this.phoneNumber = formData.verification_phone.number
					this.toast.add({
						severity: "success",
						summary: "Success",
						detail: 'OTP validated successfully',
					})
				}
			},
			error: (error) => {
				this.isResendOTP = true
				this.otp = ["", "", "", ""]
				let otpList = document.querySelectorAll(".otp-box")
				otpList.forEach((item: any) => (item.value = ""))
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: error?.error.message,
				})
			},
		})
	}

	exploreNow() {
		this.dataService.showTimerInHeader(null)
	}
	openchat() {
		this.router.navigate(["/pages/advisor"])
	}
	updateMenuClass() {
		const sidenav: Element | null = document.getElementById("sidenav")
		if (sidenav) {
			if (this.isMenuOpen) {
				sidenav.classList.remove("menuclosed")
			} else {
				sidenav.classList.add("menuclosed")
			}
		}
	}


	async ngOnInit() {
		this.userTypeId = this.storage.get('user_type_id') == 7
		// Initialize forms
		this.initializeForms();
		this.service.getNewUserTimeLeft().subscribe((res) => {
			this.imagewhitlabeldomainname = window.location.hostname;
			if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
				this.ehitlabelIsShow = true;
			} else {
				if (res.subscription_details.subscription_plan === "free_trail" && res.time_left.plan === "on_progress") {
					this.ehitlabelIsShow = false;
				} else {
					this.ehitlabelIsShow = false;
				}
			}
		});
		// Handle phone verification
		await this.handlePhoneVerification();
		this.checkNewUSerLogin();
		try {
			this.phone = this.storage.get("phone");
			// if (encPhone) {
			// 	try {
			// 		const decryptedPhone = await this.service.decryptData(encPhone);
			// 		if (decryptedPhone && typeof decryptedPhone === 'string') {
			// 			try {
			// 				if (decryptedPhone.startsWith('{') || decryptedPhone.startsWith('[') || decryptedPhone.startsWith('"')) {
			// 					this.phone = JSON.parse(decryptedPhone);
			// 				} else {
			// 					this.phone = decryptedPhone;
			// 				}
			// 			} catch (parseError) {
			// 				console.warn('Failed to parse decrypted phone:', parseError);
			// 				this.phone = decryptedPhone;
			// 			}
			// 		} else {
			// 			console.warn('Decrypted phone is null or not a string');
			// 			this.phone = '';
			// 		}
			// 	} catch (error) {
			// 		console.warn('Failed to decrypt phone:', error);
			// 		this.phone = '';
			// 	}
			// }
		} catch (error) {
			console.error('Error in ngOnInit:', error);
			this.phone = '';
		}

		// Add user details subscription
		const userDetails = this.service._user as User;
		this.userName = userDetails.name || '';
		this.firstChar = this.userName ? this.userName.charAt(0).toUpperCase() : '';

		// Set home country icon if available
		if (userDetails.home_country_id) {
			this.homeCountryId = userDetails.home_country_id;
			this.storage.set('homeCountryId', this.homeCountryId.toString());
			this.loadCountryList(); // This will now use the home country ID
		}
		// Load country list if not already loading from user details
		if (!this.homeCountryId) {
			this.loadCountryList();
		}

		// Initialize other component data
		this.initializeUserProfile();
		this.loadUserData();
		this.conditionModuleOrQuestionComponent();
		this.getProgramlevelList();
		// Load organization name
		this.locationService.getOrgName().subscribe({
			next: (orgname) => {
				this.orgnamewhitlabel = orgname;
			},
			error: (error) => {
				console.error('Error loading org name:', error);
			}
		});

		// Handle preferred country
		try {
			const response = await fetch('https://ipapi.co/json/');
			const data = await response.json();
			this.preferredCountry = data.country_code?.toLowerCase();
		} catch (error) {
			console.warn('Error fetching location data:', error);
			this.preferredCountry = 'in'; // Default to India
		}

		// Subscribe to country data changes
		this.dataService.countryId.subscribe({
			next: (data: any) => {
				if (!data) {
					this.selectedCountryId = Number(data);
					this.getModuleList();
					const cntId = this.storage.get("countryId");
					if (cntId) {
						this.dataService.changeCountryId(cntId.toString());
					}
				}
			},
			error: (error) => {
				console.error('Error in country data subscription:', error);
			}
		});

		// Set up other subscriptions
		this.dataService.homeCountryFlagSource.subscribe({
			next: (data) => {
				this.headerHomeFlag = data;
			},
			error: (error) => {
				console.error('Error in home country flag subscription:', error);
			}
		});

		this.dataService.countryFlagSource.subscribe({
			next: (data: any) => {
				this.headerFlag = data;
			},
			error: (error) => {
				console.error('Error in country flag subscription:', error);
			}
		});

		this.dashboardService.data$.subscribe({
			next: (data) => {
				this.min$ = data?.minutes;
				this.sec$ = data?.seconds;
				this.hrs$ = data?.hours;
				this.day$ = data?.days;
				this.month$ = data?.months;
			},
			error: (error) => {
				console.error('Error in dashboard data subscription:', error);
			}
		});

		if (this.service._user.subscription_exists === 0) {
			this.checkNewUser();
		} else {
			this.subScribedUserCount();
			this.userLoginTimeLeftCount = true;
			this.dataService.showTimeOutSource.subscribe({
				next: (data) => this.visible = data,
				error: (error) => console.error('Error in timeout subscription:', error)
			});
		}

		// Initialize report form
		this.initializeReportForm();
		this.setupEventSubscriptions();
		// Subscribe to dashboard country changes
		this.dashboardService.selectedCountry$.subscribe({
			next: (countryData: any) => {
				if (countryData) {
					this.selectCountryInHeader(countryData, null);
				}
			},
			error: (error) => console.error('Error in dashboard country subscription:', error)
		});

	}
	getAICreditCount() {
		this.promptService.getAicredits().subscribe({
			next: resp => {
				this.aiCreditCount = resp;
				this.service._creditCount = resp;
			}
		})
	}

	private initializeForms() {
		this.mobileForm = this.formBuilder.group({
			phone: [undefined, [Validators.required]],
			home_country: [122, Validators.required],
			study_level: ["", Validators.required],
		})

		this.currentEducationForm = this.formBuilder.group({
			current_education: ["", Validators.required],
		})

	}

	private async handlePhoneVerification() {
		try {
			// Get phone from localStorage
			let phoneValue = this.storage.get("phone");
			// if (!encryptedPhone) {
			// 	this.formvisbility = true;
			// 	return;
			// }

			// Get decrypted phone using auth service
			// let phoneValue = await this.service.decryptData(encryptedPhone);

			// Handle the decrypted phone data
			if (phoneValue) {
				// let phoneValue;
				// try {
				// 	// Try to parse if it's JSON
				// 	phoneValue = decryptedPhone.startsWith('{') || decryptedPhone.startsWith('[') || decryptedPhone.startsWith('"')
				// 		? JSON.parse(decryptedPhone)
				// 		: decryptedPhone;
				// } catch (parseError) {
				// 	console.warn('Failed to parse phone data:', parseError);
				// 	phoneValue = decryptedPhone;
				// }

				// Set form visibility based on phone value
				this.formvisbility = !phoneValue || phoneValue === "" || phoneValue === "null";

				// Initialize phone verification form
				this.phoneVerification = this.formBuilder.group({
					verification_phone: [phoneValue || '', Validators.required],
					choice: [false, Validators.required]
				});
			} else {
				this.formvisbility = true;
				this.phoneVerification = this.formBuilder.group({
					verification_phone: ['', Validators.required],
					choice: [false, Validators.required]
				});
			}
		} catch (error) {
			console.error('Error in handlePhoneVerification:', error);
			// Set safe defaults on error
			this.formvisbility = true;
			this.phoneVerification = this.formBuilder.group({
				verification_phone: ['', Validators.required],
				choice: [false, Validators.required]
			});
		}
	}

	private initializeReportForm() {
		this.genMod = [{ name: "General", id: 1 }]

		this.reportSubmitForm = this.formBuilder.group({
			general: [1, [Validators.required]],
			moduleId: ["", [Validators.required]],
			submoduleId: ["", [Validators.required]],
			questionId: ["", [Validators.required]],
			reportOption: [""],
			comment: ["", []],
		})
	}

	private setupEventSubscriptions() {
		this.dataService.chatTriggerSource.subscribe({
			next: (message) => {
				if (message === "open chat window") {
					this.openModal()
				}
			},
			error: (error) => console.error("Error in chat trigger subscription:", error),
		})

		this.locationService.getCountry().subscribe({
			next: (countryList) => {
				this.countryLists = countryList
				const countryId = this.storage.get("countryId")
				if (countryId) {
					const country = countryList.find((element: any) => element.id.toString() === countryId)
					if (country) {
						this.headerFlag = country.flag
					}
				}
			},
			error: (error) => console.error("Error getting country list:", error),
		})

		this.dataService.countryFlagSource.subscribe({
			next: (data) => {
				if (data) {
					this.headerFlag = data
				}
			},
			error: (error) => console.error("Error in country flag subscription:", error),
		})

		this.setupReportWindowSubscription()
	}

	private setupReportWindowSubscription() {
		this.dataService.openReportWindowSource.subscribe({
			next: (data) => {
				if (data?.isVisible) {
					this.handleReportWindowData(data)
				} else {
					this.isQuestionVisible = false
				}
			},
			error: (error) => console.error("Error in report window subscription:", error),
		})
	}

	private handleReportWindowData(data: any) {
		this.moduleQuestionReport = data
		this.moduleList = []
		this.subModuleList = []
		this.questionList = []
		this.getModuleList()
		this.onChangeModuleList(data.moduleId)
		this.onChangeSubModuleList(data.subModuleId)
		this.selectedGenMod = 2
		this.openReportModalFromMoudle(this.op, event)

		this.reportType = 3
		this.reportlearnlanguagetype = data.reporttype === 8 ? 8 : 0
		if (this.service._user) {
			this.userName = this.service._user.name.toString()
			this.firstChar = this.userName.charAt(0)
			this.homeCountryId = Number(this.service._user.home_country_id)
			this.selectedHomeCountry = Number(this.service._user.home_country_id)
			this.getHomeCountryList()
			const loginStatus = this.service._user.login_status;
			if (typeof loginStatus === "string" && loginStatus.includes("Demo") == true) {
				this.demoTrial = true;
				this.demoDays = loginStatus.replace("Demo-", "");
			}
			let programLevelId = this.service._user.programlevel_id;
			if (programLevelId == null || programLevelId == "null" || programLevelId == "") {
				this.currentEducation = true;
				this.educationImage = `https://${this.ApiUrl}/uniprepapi/storage/app/public/uploads/education.svg`;
			}
		}

		if (data.report_mode && data.report_mode === "other_module") {
			this.handleOtherModuleReport(data)
		} else {
			this.getReportOption()
		}

		this.isVisibleModulesMenu = true
		this.moduleNgModel = data.moduleId
		this.subModuleNgModel = data.subModuleId
		this.questionIdNgModel = data.questionId
	}

	private handleOtherModuleReport(data: any) {
		this.subs.sink = this.locationService.getModuleReportOptionLists(data).subscribe({
			next: (response) => {
				this.reportOptionList = [{ id: null, reportoption_name: "Select" }, ...response.reportOptions]
				this.reportType = data.reporttype
			},
			error: (error) => console.error("Error getting module report options:", error),
		})
	}
	showSearchComponent(type: string) {
		this.activeheadersearch = type
		if (this.activeheadersearch.stage == "questionsearch") {
			this.isShowHeaderSearchForModule = false
		} else {
			this.isShowHeaderSearchForModule = true
		}
	}

	getProgramlevelList() {
		this.locationService.getProgramLevel().subscribe((res) => {
			this.programLevelList = res
		})
	}

	UpdateEducationLevel() {
		let eduLevel = this.currentEducationForm.value.current_education
		this.service.updateEducationLevel(eduLevel).subscribe((res) => {
			this.currentEducation = false
			this.toast.add({
				severity: "success",
				summary: "success",
				detail: res.message,
			})
		})
	}

	ngOnDestroy() {
		console.log("destroy")
		this.subs.unsubscribe()
	}

	openModal() {
		this.isChatWindowVisible = true
	}

	openReportModalFromMoudle(op: any, event: any) {
		this.reportType = 1
		this.isQuestionVisible = false
		this.isVisibleModulesMenu = true
		op.toggle(event)
	}

	openReportModal(op: any, event: any) {
		this.reportType = 1
		this.reportSubmitForm.reset()

		this.moduleList = []
		this.subModuleList = []
		this.questionList = []
		this.getModuleList()
		this.getReportOption()
		this.selectedGenMod = 1
		this.onChangeModuleList(1)
		this.onChangeSubModuleList(1)
		this.moduleQuestionReport = []
		this.isQuestionVisible = true
		this.isVisibleModulesMenu = false
		// this.dataService.openReportWindowSource.subscribe((data) => {
		// 	console.log('data', data)
		// 	if (data.from == 'module') {
		// 		this.isQuestionVisible = false
		// 	} else {
		// 		this.isQuestionVisible = true;
		// 		this.isVisibleModulesMenu = false;
		// 	}
		// });
		// let data = {}
		// this.dataService.openReportWindow(data);
		op.toggle(event)
	}

	logout() {
		// Clear UI state immediately to improve perceived performance
		this.isLoading = true;

		// Create a cleanup function to handle all synchronous operations
		const cleanupLocalState = () => {
			window.sessionStorage.clear();
			localStorage.clear();
			this.service.clearCache();
			this.locationService.clearCache();
			this.authTokenService.clearToken();
			this.isLoading = false;
		};

		// Prepare all API calls that need to be made
		const logoutRequests = [
			this.service.logout().pipe(
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

		// Handle social logout if needed
		this.authService.authState.pipe(
			take(1),
			catchError(error => {
				console.warn('Error checking social auth state:', error);
				return EMPTY;
			})
		).subscribe(socialUser => {
			if (socialUser) {
				this.authService.signOut().catch(error =>
					console.warn('Social logout error:', error)
				);
			}
		});

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

	getModuleList() {
		this.subs.sink = this.locationService.getUniPerpModuleList().subscribe((data) => {
			this.moduleList = data.modules
			this.selectedModuleId = 1
		})
	}

	getReportOption() {
		this.reportOptionList = []
		this.subs.sink = this.locationService.getReportOptionList().subscribe((data) => {
			let reportTypeData = data.reportOptions.filter((value: any) => value.reporttype === this.reportType)
			this.reportOptionList = [{ id: null, reportoption_name: "Select" }, ...reportTypeData]
		})
	}
	openFlagModal(totalCountryList: any, event: any): void {
		this.isLondon = true
		this.isCountryPopupOpen = event
		totalCountryList.toggle(event)
	}

	openHomeCountryFlagModal(totalHomeCountryList: any, event: any): void {
		this.isLondon = true
		this.isCountryPopupOpen = event
		totalHomeCountryList.toggle(event)
	}

	selectCountryInHeader(countryData: any, totalCountryList: any) {
		if (countryData) {
			// Update the header flag and country data for the selected country (not home country)
			this.headerFlag = countryData.flag
			this.selectedCountryId = countryData.id

			// Update data service with selected country info
			this.dataService.changeCountryId(countryData.id.toString())
			this.dataService.changeCountryName(countryData.country)
			this.dataService.changeCountryFlag(countryData.flag)

			// Save to localStorage as selected country
			this.storage.set("selectedCountryId", countryData.id.toString())

			// Close the country list popup if it exists
			if (totalCountryList) {
				totalCountryList.toggle(false)
			}

			// Notify dashboard service about country change if it came from header
			if (totalCountryList) {
				this.dashboardService.updateSelectedCountry(countryData)
			}

			// Refresh module list with new selected country
			this.getModuleList()
		}
	}

	onChangeChooseMain(event: any) {
		this.isVisibleModulesMenu = event == 2
	}

	onChangeModuleList(moduleId: number = 1) {
		let data = {
			moduleid: moduleId,
		}
		this.selectedModuleId = moduleId
		this.locationService.getSubModuleByModule(data).subscribe((res) => {
			if (res.status == 404) {
			}
			this.subModuleList = res.submodules
		})
	}

	onChangeSubModuleList(subModuleId: any = 1) {
		let data = {
			moduleId: this.selectedModuleId,
			countryId: this.selectedCountryId,
			submoduleId: subModuleId,
		}
		this.locationService.getModuleQuestionList(data).subscribe((res) => {
			if (res.status == 404) {
			}
			this.questionList = res.questions
			this.questionList.map((x: any, i: number) => {
				x["index"] = i + 1
			})
		})
	}
	onClickSubscribe() {
		this.visible = false
		if (this.enterpriseSubscriptionLink != "") {
			window.open(this.enterpriseSubscriptionLink, "_target")
			return
		}
		this.router.navigate(["/pages/subscriptions"])
	}

	subScribedUserCount(): void {
		this.service.getNewUserTimeLeft().subscribe((res) => {
			this.currentUserSubscriptionPlan = res?.subscription_details?.subscription_plan;
			this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
			let data = res.time_left;
			if (data.plan === "not_started") {
				this.visible = false;
			} else {
				this.getTimer(
					data.minutes,
					data.seconds,
					data.hours,
					data.days,
					data.months
				);
			}
		});
	}

	getTimer(minute: any, sec: any, hours: any, days: any, months: any): void {
		let totalSeconds: number = hours * 3600 + minute * 60 + sec;
		let textSec: string | number = "0";

		this.timerInterval = setInterval(() => {
			totalSeconds--;

			const hoursLeft: number = Math.floor(totalSeconds / 3600);
			const minutesLeft: number = Math.floor((totalSeconds % 3600) / 60);
			const secondsLeft: number = totalSeconds % 60;

			this.min$ =
				minutesLeft < 10 && minutesLeft > 0 ? "0" + minutesLeft.toString() : minutesLeft.toString();
			this.sec$ =
				secondsLeft < 10 && secondsLeft > 0 ? "0" + secondsLeft.toString() : secondsLeft.toString();

			this.hrs$ = hoursLeft;
			// this.min$ = textMin;
			// this.sec$ = textSec;
			this.month$ = months;
			this.day$ = days;
			if (minute <= 0 && hours <= 0 && sec <= 0) {
				this.hrs$ = 0;
				this.min$ = 0;
				this.sec$ = 0;
			}
			//else {
			//   this.hrs$ = hoursLeft;
			//   this.min$ = textMin;
			//   this.sec$ = textSec;
			// }

			if (
				minutesLeft <= 0 &&
				this.hrs$ <= 0 &&
				this.day$ <= 0 &&
				secondsLeft <= 0 &&
				this.month$ <= 0
			) {
				this.visibleExhasted = true;
				clearInterval(this.timerInterval);
			}
		}, 1000);
	}

	checkNewUser(): void {
		this.service.getNewUserTimeLeft().subscribe((res) => {
			this.currentUserSubscriptionPlan = res?.subscription_details?.subscription_plan;
			this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
			this.dashboardService.updatedata(res.time_left);
			let data = res.time_left;
			if (data.plan === "on_progress") {
				this.userLoginTimeLeftCount = false;
				this.timer(data.minutes, data.seconds, data.hours);
			}
			if (data.plan === "subscription_inprogress") {
				this.userLoginTimeLeftCount = false;
				this.getTimer(
					data.minutes,
					data.seconds,
					data.hours,
					data.days,
					data.months
				);
			}
		});
	}

	timer(minute: any, sec: any, hours: any): void {
		let totalSeconds: number = hours * 3600 + minute * 60 + sec;
		let textSec: string | number = "0";

		this.timerInterval = setInterval(() => {
			totalSeconds--;

			const hoursLeft: number = Math.floor(totalSeconds / 3600);
			const minutesLeft: number = Math.floor((totalSeconds % 3600) / 60);
			const secondsLeft: number = totalSeconds % 60;

			this.timeHours = hoursLeft;
			this.timeLeftMins =
				minutesLeft < 10 && minutesLeft > 0 ? "0" + minutesLeft : minutesLeft.toString();
			this.timeLeftSecs =
				secondsLeft < 10 && secondsLeft > 0 ? "0" + secondsLeft : secondsLeft.toString();
			if (this.timeLeftMins == '00') {
				this.timeLeftMins = 0;
			}
			if (this.timeLeftSecs == '00') {
				this.timeLeftSecs = 0;
			}
			if (minute <= 0 && hours <= 0 && sec <= 0) {
				this.timeHours = 0;
				this.timeLeftMins = 0;
				this.timeLeftSecs = 0;
			}
			// else {
			//   this.timeHours = hoursLeft;
			//   this.timeLeftMins = textMin;
			//   this.timeLeftSecs = textSec;
			// }
			if (
				minutesLeft <= 0 &&
				this.timeHours <= 0 &&
				secondsLeft <= 0
			) {
				this.visible = true;
				this.locationService.trialEnds().subscribe((res) => {
					console.log(res)
				})
				clearInterval(this.timerInterval);
			}
			this.min$ = minutesLeft
			this.sec$ = secondsLeft
			this.hrs$ = this.timeHours;
		}, 1000);
	}

	onSubmit(op: any) {
		let data: any;
		if (this.reportSubmitForm.value.reportOption == null) {
			this.toast.add({
				severity: "error",
				summary: "Error",
				detail: "Please Select Issue Type",
			})
			return
		}
		data = {
			moduleId: this.moduleQuestionReport.moduleId ? this.moduleQuestionReport.moduleId : this.reportSubmitForm.value.moduleId,
			submoduleId: this.moduleQuestionReport.subModuleId ? this.moduleQuestionReport.subModuleId : this.reportSubmitForm.value.submoduleId,
			questionId: this.moduleQuestionReport.questionId ? this.moduleQuestionReport.questionId : this.reportSubmitForm.value.questionId,
			reportOption: this.reportSubmitForm.value.reportOption,
			comment: this.reportSubmitForm.value.comment,
			countryId: this.selectedCountryId,
			type_of_report: this.reportType == 4 || this.reportType == 5 || this.reportType == 6 || this.reportType == 7 ? this.reportType : this.reportlearnlanguagetype == 8 ? this.reportlearnlanguagetype : undefined,
		}
		if (data.moduleId == 8) {
			data.countryId = 0
		}
		if (data.moduleId == 23 || data.moduleId == 24 || data.moduleId == 25 || data.moduleId == 27 || data.moduleId == 27) {
			data.countryId = this.moduleQuestionReport.countryId
		}

		let maildata = {
			reportOption: this.reportSubmitForm.value.reportOption,
			comment: this.reportSubmitForm.value.comment,
		}
		this.reportSubmitForm.patchValue({ comment: null })

		this.locationService.reportFaqQuestion(data).subscribe((res) => {
			if (res.status == 404) {
			}
			this.dataService.showFeedBackPopup(true)
			// this.showReportSuccess = true;
			setTimeout(() => {
				this.dataService.showFeedBackPopup(false)
				op.hide()
				// this.showReportSuccess = false;
			}, 3000)
			this.locationService.reportFaqQuestionaftersubmit(maildata).subscribe((res) => { })
		})
		this.getReportOption()
	}

	continueTrial(): void {
		let data: any = {}
		if (this.mobileForm.valid) {
			data.phone = this.mobileForm.value.phone.number
			data.home_country = this.mobileForm.value.home_country
			data.country_code = this.mobileForm.value.phone.dialCode
			data.study_level = this.mobileForm.value.study_level
		}
		if (this.demoTrial == true) {
			data.demo_user = 1
		}
		this.dashboardService.getContineTrial(data).subscribe(
			(res) => {
				if (this.demoTrial == true) {
					this.toast.add({
						severity: "success",
						summary: "Success",
						detail: "Demo Trail Started",
					})
				}

				this.service.contineStatus(false)
				this.dataService.sendValue(false)
				this.freeTrial = false
				this.demoTrial = false
				this.service._userContineTrial = false
				setTimeout(() => {
					this.checkNewUser()
					window.location.reload()
				}, 2000)
				return res
			},
			(error) => {
				if (this.demoTrial == true) {
					this.toast.add({
						severity: "error",
						summary: "Error",
						detail: "Demo Trail Not Started",
					})
				}
				this.freeTrialErrorMsg = error?.message
			}
		)
	}
	onClickSubscribedUser(): void {
		this.imagewhitlabeldomainname = window.location.hostname
		console.log(this.imagewhitlabeldomainname);

		if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
			this.visibleExhastedUser = false
			let data: any = {}
			if (this.mobileForm.valid) {
				data.phone = this.mobileForm.value.phone.number
				data.home_country = this.mobileForm.value.home_country
				data.country_code = this.mobileForm.value.phone.dialCode
			}
			if (this.demoTrial == true) {
				data.demo_user = 1
			}
			this.dashboardService.getContineTrial(data).subscribe(
				(res) => {
					if (this.demoTrial == true) {
						this.toast.add({
							severity: "success",
							summary: "Success",
							detail: "Demo Trail Started",
						})
					}
					this.freeTrial = false
					this.demoTrial = false
					this.visibleExhasted = false
					this.service._userContineTrial = false
					this.service.contineStatus(false)
					this.dataService.sendValue(false)
					setTimeout(() => {
						this.checkNewUser()
						this.dashboardService.isinitialstart = true
						if (this.enterpriseSubscriptionLink != "") {
							window.open(this.enterpriseSubscriptionLink, "_target")
							return
						}
						this.router.navigate(["/pages/subscriptions"])
					}, 1000)
				},
				(error) => {
					if (this.demoTrial == true) {
						this.toast.add({
							severity: "error",
							summary: "Error",
							detail: "Demo Trail Not Started",
						})
					}
					this.freeTrialErrorMsg = error?.message
				}
			)
		} else {
			this.visibleExhastedUser = true
			this.demoTrial = false
		}
	}

	checkNewUSerLogin() {
		if (this.service._user?.login_status === 4) {
			if (this.service._user.is_phn_or_whs_verified === 0) {
				this.whatsappVerification = true;
			}
			else {
				this.freeTrial = true;
				this.formvisbility = true;
			}
		}
	}

	changeLocation(event: any) {
		this.GetLocationList()
	}

	GetLocationList() {
		this.locationList = [{ id: 0, district: "Others" }]
		this.mobileForm?.get("location_id")?.setValue(0)
		if (this.mobileForm.get("home_country")?.value == 122) {
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
			this.mobileForm?.get("location_id")?.setValue(0)
		}
	}

	getHomeCountryList() {
		this.subs.sink = this.locationService.getHomeCountry(2).subscribe({
			next: (res: any) => {
				this.countryList = res;

				// First try to get country from localStorage
				const storedHomeCountryId = this.storage.get('homeCountryId');

				// Find selected home country with fallbacks
				const selectedHomeCountry = storedHomeCountryId ?
					res.find((data: any) => data.id === Number(storedHomeCountryId)) :
					res.find((data: any) => data.id === this.homeCountryId) ||
					res.find((data: any) => data.id === 122);

				if (selectedHomeCountry) {
					this.headerHomeFlag = selectedHomeCountry.flag;
					this.selectedHomeCountry = selectedHomeCountry;
					this.homeCountryName = selectedHomeCountry.country;
					this.dataService.changeHomeCountryFlag(selectedHomeCountry.flag);
					this.storage.set('homeCountryId', selectedHomeCountry.id.toString());
				} else {
					// Set default values for India
					const defaultCountry = {
						id: 122,
						country: 'India',
						flag: `https://${this.ApiUrl}/uniprepapi/storage/app/public/uploads/flags/in.svg`
					};
					this.headerHomeFlag = defaultCountry.flag;
					this.homeCountryName = defaultCountry.country;
					this.selectedHomeCountry = defaultCountry;
					this.dataService.changeHomeCountryFlag(defaultCountry.flag);
					this.storage.set('homeCountryId', defaultCountry.id.toString());
				}
			},
			error: (error) => {
				console.error('Error fetching home country data:', error);
				// Set default values for India on error
				const defaultCountry = {
					id: 122,
					country: 'India',
					flag: `https://${this.ApiUrl}/uniprepapi/storage/app/public/uploads/flags/in.svg`
				};
				this.headerHomeFlag = defaultCountry.flag;
				this.homeCountryName = defaultCountry.country;
				this.selectedHomeCountry = defaultCountry;
				this.dataService.changeHomeCountryFlag(defaultCountry.flag);
				this.storage.set('homeCountryId', defaultCountry.id.toString());
			}
		});
	}

	onHomeCountryChange(event: any) {
		if (event?.value) {
			const selectedCountry = this.countryList.find((country: any) => country.id === event.value.id);
			if (selectedCountry) {
				this.homeCountryId = selectedCountry.id;
				this.headerHomeFlag = selectedCountry.flag;
				this.homeCountryName = selectedCountry.country;
				this.selectedHomeCountry = selectedCountry;
				this.dataService.changeHomeCountryFlag(selectedCountry.flag);
				this.storage.set('homeCountryId', selectedCountry.id.toString());

				// Update the form if it exists
				if (this.mobileForm) {
					this.mobileForm.patchValue({
						home_country: selectedCountry.id
					});
				}
			}
		}
	}
	closeQuiz(): void {
		this.visibleExhastedUser = false
		this.demoTrial = true
	}


	navigateILearnChallenge() {
		if (this.currentUserSubscriptionPlan === "Career" || this.currentUserSubscriptionPlan === "Entrepreneur") {
			switch (this.service?._user?.ilearn_popup_status) {
				case 0:
				case 1:
					if (this.router.url !== "/pages/assessment/ilearn-challenge") {
						this.assessmentService.getAssessmentParticipatingCount().subscribe({
							next: (res) => {
								this.assParticipations = res.cluster_count
								this.isILeanrParticipantsVisible = true
							},
						})
					}
					break
				case 2:
					if (this.router.url !== "/pages/assessment/ilearn-challenge") {
						this.isILearnLiveVisible = true
					}
					break
				case 3:
					this.isILearnCompletedVisible = true
					break
				default:
					console.log(this.service?._user?.ilearn_popup_status)
			}
			return
		}
		this.isUpgradePlanVisible = true
	}

	onSubscribe() {
		this.isUpgradePlanVisible = false
		const targetUrl = this.service?.user?.subscription ? "/pages/subscriptions/upgrade-subscription" : "/pages/subscriptions"
		this.router.navigateByUrl(targetUrl)
	}

	onClickiLearnChallenge() {
		this.isILearnLiveVisible = false
		this.isILearnCompletedVisible = false
		this.router.navigateByUrl("/pages/assessment/ilearn-challenge")
	}

	conditionModuleOrQuestionComponent() {
		// this menu no need to header global search
		this.currentRoute = this.router.url
		if (this.currentRoute.includes("subscriptions") || this.currentRoute.includes("support-help") || this.currentRoute.includes("usermanagement") || this.currentRoute.includes("chat") || this.currentRoute.includes("guideline") || this.currentRoute.includes("termsandcondition") || this.currentRoute.includes("privacypolicy") || this.currentRoute.includes("refundpolicy") || this.currentRoute.includes("cancellationpolicy") || this.currentRoute.includes("export-credit") || this.currentRoute.includes("cv-builder") || this.currentRoute.includes("coverletter-builder")) {
			this.showSearch = false
		} else {
			this.showSearch = true
		}
		// this headerserch  condition for modules and question (two component used)
		this.currentRoute = this.router.url
		// if (this.currentRoute.includes("learning-hub") || this.currentRoute.includes("k12") || this.currentRoute.includes("startup") || this.currentRoute.includes("unilearn") || this.currentRoute.includes("resource") || this.currentRoute.includes("events") || this.currentRoute.includes("success-stories") || this.currentRoute.includes("tutorials")) {
		// 	this.isShowHeaderSearchForModule = true
		// } else {
		// 	this.isShowHeaderSearchForModule = false
		// }
	}

	private initializeUserProfile() {
		// Implementation of initializeUserProfile method
	}

	private loadUserData() {
		if (this.service._user) {
			const userDetails = this.service._user;

			// Set user name and first character
			this.userName = userDetails.name?.toString() || '';
			this.firstChar = this.userName ? this.userName.charAt(0).toUpperCase() : '';

			// Store user details in localStorage for persistence
			this.storage.set('user_details', JSON.stringify({
				name: this.userName,
				firstChar: this.firstChar,
				homeCountryId: userDetails.home_country_id,
				programLevelId: userDetails.programlevel_id
			}));

			// Handle program level
			if (!userDetails.programlevel_id) {
				this.currentEducation = true;
				this.educationImage = `https://${this.ApiUrl}/uniprepapi/storage/app/public/uploads/education.svg`;
			}

			// Handle demo trial status
			const loginStatus = userDetails.login_status;
			if (typeof loginStatus === 'string' && loginStatus.includes('Demo')) {
				this.demoTrial = true;
				this.demoDays = loginStatus.replace('Demo-', '');
			}

			// Update home country
			this.homeCountryId = Number(userDetails.home_country_id);
			this.selectedHomeCountry = Number(userDetails.home_country_id);
			this.getHomeCountryList();
		}
		else {
			const storedUserDetails = this.storage.get('user_details');
			if (storedUserDetails) {
				const details = JSON.parse(storedUserDetails);
				this.userName = details.name;
				this.firstChar = details.firstChar;
			}
		}
	}

	onCheckHaveWhatsappOrPhone(event: any) {
		const isChecked = (event.target as HTMLInputElement).checked;
		this.haveWhatsapp = isChecked ? 'Phone' : 'Whatsapp';
	}
}
