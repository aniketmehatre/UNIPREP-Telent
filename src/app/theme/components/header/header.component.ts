import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterModule,
} from '@angular/router';

// Third Party
import {
    SocialAuthService,
    SocialUser,
} from '@abacritt/angularx-social-login';
import {
    CountryISO,
    NgxIntlTelInputModule,
    SearchCountryField,
} from 'ngx-intl-tel-input';
import { MenuItem, MessageService } from 'primeng/api';
import { SubSink } from 'subsink';
import { catchError, finalize, forkJoin, Observable, take, timeout, EMPTY } from 'rxjs';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { Popover, PopoverModule } from 'primeng/popover';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';

// Environment & Models
import { environment } from '@env/environment';
import { ILearnChallengeData } from 'src/app/@Models/ilearn-challenge.model';
import { User } from 'src/app/@Models/user.model';

// Services
import { AuthService } from '../../../Auth/auth.service';
import { LocationService } from '../../../services/location.service';
import { DataService } from 'src/app/services/data.service';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
import { AssessmentService } from 'src/app/pages/assessment/assessment.service';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { StorageService } from '../../../services/storage.service';
import { PromptService } from 'src/app/services/prompt.service';
import { CountryLocationService } from 'src/app/services/country-location.service';
import { CommonService } from 'src/app/services/common.service';
import { UserSubscriptionService } from 'src/app/services/user-subscription.service';

@Component({
    selector: 'uni-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        RouterModule,
        TabsModule,
        PopoverModule,
        FormsModule,
        ReactiveFormsModule,
        AvatarModule,
        NgxIntlTelInputModule,
        InputTextModule,
        SelectModule,
        InputGroupModule,
        InputGroupAddonModule,
        TextareaModule,
        AvatarGroupModule,
        MultiSelectModule,
        ButtonModule,
        InputOtpModule
    ],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('op') op!: Popover;
    @ViewChild('np') np!: Popover;

    // Inputs & Outputs
    @Input() breadcrumb: MenuItem[] = [{ label: 'Categories' }, { label: 'Sports' }];
    @Input() expandicon = '';
    @Output() toggleSidebar = new EventEmitter<void>();

    // Forms
    public reportSubmitForm!: FormGroup;
    public mobileForm!: FormGroup;
    public currentEducationForm!: FormGroup;
    public phoneVerification!: FormGroup;

    // Constants / Enums
    readonly SearchCountryField = SearchCountryField;
    readonly CountryISO = CountryISO;
    readonly ApiUrl: string = environment.domain;
    readonly preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom];

    // State Variables: User & Auth
    userName = '';
    firstChar = 'U';
    userTypeId = true;
    currentUserSubscriptionPlan = '';
    isMenuOpen = true;
    isLoading = false;
    showIcon = false;

    // State Variables: Flags & Countries
    headerFlag: string = '';
    headerHomeFlag: string = '';
    homeCountryId: number | null = null;
    homeCountryName = '';
    selectedCountryId: number | null = null;
    selectedHomeCountry: any = null;
    countryLists: any[] = [];
    homeCountryList: any[] = [];
    locationList: any[] = [];
    preferredCountry: string = 'in'; // Default to India

    // State Variables: Modules & Reporting
    genMod: any[] = [{ name: 'General', id: 1 }];
    moduleNgModel = 1;
    selectedGenMod = 1;
    subModuleNgModel = 1;
    questionIdNgModel = 1;
    reportOptionNgModel = 0;
    selectedModuleId: any;
    moduleList: any[] = [];
    subModuleList: any[] = [];
    questionList: any[] = [];
    moduleQuestionReport: any;
    reportOptionList: any[] = [];
    reportType = 1;
    reportLearnLanguageType = 0;

    // State Variables: Visibility Toggles
    visible = false;
    isShowFreeTrialStart = false;
    isVisibleModulesMenu = false;
    isChatWindowVisible = false;
    isQuestionVisible = true;
    showSearch = true;
    isShowHeaderSearchForModule = false;
    whiteLabelIsShow = true;
    visibleExhasted = false;
    visibleExhastedUser = false;
    isUpgradePlanVisible = false;
    isILearnParticipantsVisible = false;
    isILearnLiveVisible = false;
    isILearnCompletedVisible = false;
    currentEducation = false;
    whatsappVerification = false;
    formVisibility = false;
    isCountryPopupOpen: any;
    isLondon = false; // logic seems to rely on this being toggled
    demoTrial = false;

    // State Variables: Timers
    day$: Observable<any> | any
    hrs$: Observable<any> | any
    min$: Observable<any> | any
    sec$: Observable<any> | any
    month$: Observable<any> | undefined;
    timerInterval: any;
    timeLeftSecs: any;
    timeLeftMins: any;
    timeHours: any;
    userLoginTimeLeftCount = false;
    freeTrial = false;
    demoDays: string | undefined;
    timeLeftInfo: any;
    freeTrialErrorMsg = '';

    // State Variables: Data & Other
    iLearnChallengeData: ILearnChallengeData | undefined;
    assParticipations = 0;
    aiCreditCount = 0;
    programLevelList: any[] = [];
    interestMenuList: any[] = [];
    nationalityList: { id: number; nationality_name: string }[] = [];
    notifications: any[] = [];
    unreadCount = 0;
    educationImage = '';
    imageWhiteLabelDomainName: any;
    orgNameWhiteLabel: any;
    currentRoute = '';

    // State Variables: Search & OTP
    activeHeaderSearch: any;
    otp: string[] = ['', '', '', ''];
    otpArray = Array(4).fill(0);
    isSendingOTP = false;
    isResendOTP = false;
    isSubmittingOTP = false;
    haveWhatsapp = 'WhatsApp';
    phone = '';
    isPhoneDisabled = true;
    enterpriseSubscriptionLink: any;

    private subs = new SubSink();

    constructor(
        private router: Router,
        private locationService: LocationService,
        private formBuilder: FormBuilder,
        public authService: AuthService,
        private toast: MessageService,
        private route: ActivatedRoute,
        private socialService: SocialAuthService,
        private dataService: DataService,
        private dashboardService: DashboardService,
        private assessmentService: AssessmentService,
        private authTokenService: AuthTokenService,
        private storage: StorageService,
        private promptService: PromptService,
        private cdr: ChangeDetectorRef,
        private countryLocationService: CountryLocationService,
        private commonService: CommonService,
        private userSubscriptionService: UserSubscriptionService
    ) {
        this.initializeForms();
    }

    ngOnInit(): void {
        this.setupSubscriptions();
        this.checkQueryParams();
        this.initializeStartupData();
        this.checkNewUserLogin();
        this.setupTimersAndTrial();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    // ==========================================================================
    // INITIALIZATION & SUBSCRIPTIONS
    // ==========================================================================

    private initializeForms() {
        this.reportSubmitForm = this.formBuilder.group({
            general: [1, [Validators.required]],
            moduleId: ['', [Validators.required]],
            submoduleId: ['', [Validators.required]],
            questionId: ['', [Validators.required]],
            reportOption: [''],
            comment: ['', []],
        });

        this.mobileForm = this.formBuilder.group({
            phone: [undefined, [Validators.required]],
            home_country: [122, Validators.required],
            nationality_id: [null, Validators.required],
            study_level: ['', Validators.required],
            current_city: [''],
            location_id: [0], // Added default to avoid errors in GetLocationList
        });

        this.currentEducationForm = this.formBuilder.group({
            current_education: ['', Validators.required],
        });

        // Initial placeholder form, will be rebuilt with values
        this.phoneVerification = this.formBuilder.group({
            verification_phone: ['', Validators.required],
            choice: [false, Validators.required],
            otp: [this.otp],
        });
    }

    private setupSubscriptions() {
        // Notification List
        this.getNotificationList();

        // Data Service: Report Window
        this.subs.sink = this.dataService.openReportWindowSource.subscribe({
            next: (data) => {
                if (data?.isVisible) {
                    this.handleReportWindowData(data);
                } else {
                    this.isQuestionVisible = false;
                }
            },
            error: (err) => console.error('Error in report window subscription:', err),
        });

        // Data Service: Cast Value (Free Trial)
        this.subs.sink = this.dataService.castValue.subscribe((data) => {
            if (data === true) {
                this.checkNewUserLogin();
            } else {
                this.freeTrial = false;
            }
        });

        // Route Params (Country List)
        this.subs.sink = this.route.params.subscribe(() => {
            this.reportType = 1;
            this.getReportOption();
            this.loadCountryList();
        });

        // Route Navigation Events
        this.subs.sink = this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.conditionModuleOrQuestionComponent();
            }
        });

        // Auth Service: Time Info
        this.subs.sink = this.authService.getTimeInfoForCard().subscribe((data) => {
            this.storage.set('time_card_info', data.card_message);
        });

        // Assessment: Challenge Data
        this.subs.sink = this.assessmentService.iLearnChallengeData$.subscribe((data) => {
            this.iLearnChallengeData = data;
        });

        // Assessment: Side Menu Challenge
        this.subs.sink = this.assessmentService.sideMenuiLearnChallengeData$.subscribe((data) => {
            if (data) this.navigateILearnChallenge();
        });

        // Auth: AI Credits
        this.subs.sink = this.authService.aiCreditCount$.subscribe((value) => {
            if (value) this.getAICreditCount();
        });

        this.subs.sink = this.assessmentService.updateRequested$.subscribe(() => {
            this.getAICreditCount();
        });

        // Dashboard: Dashboard Data (Time)
        this.subs.sink = this.dashboardService.data$.subscribe({
            next: (data) => {
                this.min$ = data?.minutes;
                this.sec$ = data?.seconds;
                this.hrs$ = data?.hours;
                this.day$ = data?.days;
                this.month$ = data?.months;
            },
            error: (error) => console.error('Error in dashboard data:', error),
        });

        // Data Service: Country Flags
        this.subs.sink = this.dataService.homeCountryFlagSource.subscribe((data) => {
            this.headerHomeFlag = data;
            this.cdr.detectChanges();
        });

        this.subs.sink = this.dataService.countryFlagSource.subscribe((data) => {
            this.headerFlag = data;
        });

        // Data Service: Country ID Change
        this.subs.sink = this.dataService.countryId.subscribe((data: any) => {
            if (!data) {
                this.selectedCountryId = Number(data);
                this.getModuleList();
                const cntId = this.storage.get('countryId');
                if (cntId) this.dataService.changeCountryId(cntId.toString());
            }
        });

        // Dashboard: Selected Country
        this.subs.sink = this.dashboardService.selectedCountry$.subscribe((countryData: any) => {
            if (countryData) this.selectCountryInHeader(countryData, null);
        });

        // Chat Trigger
        this.subs.sink = this.dataService.chatTriggerSource.subscribe((message) => {
            if (message === 'open chat window') this.openModal();
        });

        // Time Out
        this.subs.sink = this.dataService.showTimeOutSource.subscribe({
            next: (data) => (this.visible = data),
            error: (error) => console.error('Error in timeout sub:', error),
        });
    }

    private checkQueryParams() {
        this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
            const token = params.get('token');
            if (token) {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { token: null },
                    queryParamsHandling: 'merge',
                    replaceUrl: true,
                });
            }
        });
    }

    private initializeStartupData() {
        const hostname = window.location.hostname;

        // Domain Source
        this.locationService.getSourceByDomain(hostname).subscribe((data: any) => {
            this.imageWhiteLabelDomainName = data.source;
            this.orgNameWhiteLabel = data.name;
            this.handleWhiteLabelDisplay(data.source);
        });

        this.userTypeId = this.authService._user?.student_type_id == 2;
        this.getHomeCountry();
        this.handlePhoneVerification(); // Sync part, async data filling happens inside
        this.loadUserData();
        this.conditionModuleOrQuestionComponent();
        this.getProgramLevelList();
        this.getInterestedMenus();
        this.getNationalityList();
        this.detectPreferredCountry();
    }

    private handleWhiteLabelDisplay(source: string) {
        if (source === 'Uniprep' || source === 'Partner') {
            this.whiteLabelIsShow = true;
        } else {
            // Default to false unless specific conditions met via API later
            this.whiteLabelIsShow = false;
        }
    }

    private async detectPreferredCountry() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            this.preferredCountry = data.country_code?.toLowerCase() || 'in';
        } catch (error) {
            console.warn('Error fetching location data:', error);
            this.preferredCountry = 'in';
        }
    }

    // ==========================================================================
    // USER & AUTH METHODS
    // ==========================================================================

    loadUserData() {
        if (this.authService._user) {
            const user = this.authService._user;
            this.showIcon = user.login_status !== 4;
            this.userName = user.name || '';
            this.firstChar = this.userName ? this.userName.charAt(0).toUpperCase() : '';

            // Persist basics
            this.storage.set('user_details', JSON.stringify({
                name: this.userName,
                firstChar: this.firstChar,
                homeCountryId: user.home_country_id,
                programLevelId: user.programlevel_id,
            }));

            // Program Level
            if (!user.programlevel_id) {
                this.currentEducation = true;
                this.educationImage = `https://${this.ApiUrl}/uniprepapi/storage/app/public/uploads/education.svg`;
            }

            // Demo/Trial
            if (typeof user.login_status === 'string' && user.login_status.includes('Demo')) {
                this.demoTrial = true;
                this.demoDays = user.login_status.replace('Demo-', '');
            }

            // Home Country
            if (user.home_country_id) {
                this.homeCountryId = Number(user.home_country_id);
                this.storage.set('homeCountryId', this.homeCountryId.toString());
                // Reload country list will happen via route params or we call it here if needed immediately
            }
            this.getHomeCountryList();
        } else {
            // Fallback to storage
            const stored = this.storage.get('user_details');
            if (stored) {
                const details = JSON.parse(stored);
                this.userName = details.name;
                this.firstChar = details.firstChar;
            }
        }
    }

    checkNewUserLogin() {
        if (this.authService._user?.login_status === 4) {
            this.gettingLocationForNewUsers();
            if (this.authService._user.is_phn_or_whs_verified === 0) {
                this.whatsappVerification = true;
            } else {
                this.freeTrial = true;
                this.formVisibility = true;
            }
        }
    }

    async gettingLocationForNewUsers() {
        const userLocation = await this.countryLocationService.getUserCountry();
        const findCountry = this.homeCountryList.find(
            (country: any) => userLocation.country === country.country
        );
        if (findCountry) {
            this.mobileForm.patchValue({
                home_country: findCountry.id,
                current_city: userLocation.city,
            });
        }
    }

    logout() {
        this.isLoading = true;

        const cleanupLocalState = () => {
            window.sessionStorage.clear();
            localStorage.clear();
            this.storage.remove('homeCountryId');
            this.authService.clearCache();
            this.locationService.clearCache();
            this.authTokenService.clearToken();
            this.isLoading = false;
        };

        const logoutRequests = [
            this.authService.logout().pipe(catchError(() => EMPTY)),
            this.locationService.sessionEndApiCall().pipe(catchError(() => EMPTY)),
        ];

        // Social Logout check
        this.socialService.authState.pipe(
            take(1),
            catchError(() => EMPTY)
        ).subscribe((socialUser) => {
            if (socialUser) this.socialService.signOut().catch(console.warn);
        });

        forkJoin(logoutRequests)
            .pipe(
                timeout(5000),
                finalize(() => {
                    cleanupLocalState();
                    this.router.navigate(['/login'], { replaceUrl: true });
                })
            )
            .subscribe({
                next: () => this.toast.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully' }),
                error: (err) => {
                    console.error('Logout error', err);
                    this.toast.add({ severity: 'info', summary: 'Info', detail: 'Logged out with some pending requests' });
                },
            });
    }

    // ==========================================================================
    // COUNTRY & LOCATION LOGIC
    // ==========================================================================

    loadCountryList() {
        this.subs.sink = this.locationService.getCountry().subscribe({
            next: (countryList) => {
                this.countryLists = countryList;
                this.determineSelectedCountry();
            },
            error: (error) => console.error('Error loading country list:', error),
        });
    }

    private determineSelectedCountry() {
        // 1. Try Storage
        const storedCountryId = this.storage.get('selectedCountryId');
        if (storedCountryId) {
            this.setCountryById(Number(storedCountryId));
            return;
        }

        // 2. Try Home Country
        const homeCountryId = this.storage.get('homeCountryId');
        if (homeCountryId) {
            this.setCountryById(Number(homeCountryId));
            return;
        }

        // 3. Default to India (122)
        this.setCountryById(122);
    }

    private setCountryById(id: number) {
        this.selectedCountryId = id;
        const country = this.countryLists.find((element: any) => element.id === id);

        if (country) {
            this.headerFlag = country.flag;
            this.dataService.changeCountryName(country.country);
            this.dataService.changeCountryFlag(country.flag);
            this.dataService.changeCountryId(country.id.toString());
            this.storage.set('selectedCountryId', country.id.toString());
        }
    }

    getHomeCountryList() {
        this.subs.sink = this.locationService.getHomeCountry(2).subscribe({
            next: (res: any) => {
                this.countryList = res; // Note: original code used `countryList` and `countryLists` (confusing).

                const storedHomeId = this.storage.get('homeCountryId');
                const selected = storedHomeId
                    ? res.find((d: any) => d.id === Number(storedHomeId))
                    : res.find((d: any) => d.id === this.homeCountryId) || res.find((d: any) => d.id === 122);

                this.updateHomeCountryState(selected);
            },
            error: (error) => {
                console.error('Error fetching home country:', error);
                // Fallback India
                this.updateHomeCountryState({
                    id: 122,
                    country: 'India',
                    flag: `https://${this.ApiUrl}/uniprepapi/storage/app/public/uploads/flags/in.svg`
                });
            },
        });
    }

    // Property to hold the dropdown list for home country
    countryList: any[] = [];

    private updateHomeCountryState(country: any) {
        if (!country) return;
        this.headerHomeFlag = country.flag || `../../uniprep-assets/icons/india.png`;
        this.homeCountryName = country.country;
        this.selectedHomeCountry = country;
        this.dataService.changeHomeCountryFlag(this.headerHomeFlag);
        this.storage.set('homeCountryId', country.id.toString());
        this.cdr.detectChanges();
    }

    onHomeCountryChange(event: any) {
        if (event?.value) {
            const country = this.countryList.find((c: any) => c.id === event.value.id);
            if (country) {
                this.homeCountryId = country.id;
                this.updateHomeCountryState(country);
                if (this.mobileForm) {
                    this.mobileForm.patchValue({ home_country: country.id });
                }
            }
        }
    }

    selectCountryInHeader(countryData: any, totalCountryList: any) {
        if (countryData) {
            this.headerFlag = countryData.flag;
            this.selectedCountryId = countryData.id;

            this.dataService.changeCountryId(countryData.id.toString());
            this.dataService.changeCountryName(countryData.country);
            this.dataService.changeCountryFlag(countryData.flag);
            this.storage.set('selectedCountryId', countryData.id.toString());

            if (totalCountryList) {
                totalCountryList.toggle(false);
                this.dashboardService.updateSelectedCountry(countryData);
            }

            this.getModuleList();
        }
    }

    // ==========================================================================
    // OTP & PHONE VERIFICATION
    // ==========================================================================

    private handlePhoneVerification() {
        try {
            const phoneValue = this.storage.get('phone');

            this.formVisibility = !phoneValue || phoneValue === '' || phoneValue === 'null';

            // Update form if initialized, or simple patch
            if (this.phoneVerification) {
                this.phoneVerification.patchValue({
                    verification_phone: phoneValue || '',
                });
            }
            this.phone = phoneValue || '';
        } catch (error) {
            console.error('Error in handlePhoneVerification:', error);
            this.formVisibility = true;
        }
    }

    onInputOTP(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        this.otp[index] = value;
        // Auto-focus next
        if (value && value.length === 1 && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
            nextInput?.focus();
        }
    }

    onKeydownOPT(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;
        // Auto-focus prev
        if (event.key === 'Backspace' && !input.value && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
            prevInput?.focus();
        }
    }

    sendOTP() {
        const phoneControl = this.phoneVerification.get('verification_phone');
        if (!phoneControl?.value || phoneControl.errors?.['validatePhoneNumber']) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Enter valid Number' });
            return;
        }
        const formData = this.phoneVerification.value;

        const payload = {
            country_code: formData.verification_phone.dialCode,
            phone: formData.verification_phone.number,
            whatsapp_number_or_not: formData.choice,
            dial_code: formData.verification_phone.countryCode,
        };

        this.authService.sendWhatsappOtp(payload).subscribe({
            next: (response) => {
                this.phoneVerification.get('verification_phone')?.disable();
                this.isSendingOTP = true;
                this.toast.add({ severity: 'success', summary: 'Success', detail: response.message });
            },
            error: (error) => {
                this.phoneVerification.enable();
                this.toast.add({ severity: 'error', summary: 'Error', detail: error?.error?.message });
            },
        });
    }

    submitPhoneVerification() {
        if (this.isSubmittingOTP) return;
        this.isSubmittingOTP = true;

        const formData = this.phoneVerification.getRawValue(); // getRawValue because controls might be disabled
        const payload = {
            country_code: formData.verification_phone.dialCode,
            phone: formData.verification_phone.number,
            dial_code: formData.verification_phone.countryCode,
            otp: formData.otp,
            whatsapp_number_or_not: formData.choice,
        };

        this.phoneVerification.get('verification_phone')?.disable();

        this.authService.validateWhatsappOtp(payload).subscribe({
            next: (response) => {
                if (response.message === 'Otp Invalid') {
                    this.toast.add({ severity: 'error', summary: 'Error', detail: response.message });
                    this.isSubmittingOTP = false;
                } else {
                    this.whatsappVerification = false;
                    this.freeTrial = true;
                    this.isPhoneDisabled = true;
                    this.formVisibility = true;
                    this.phone = formData.verification_phone.number;
                    this.phoneNumber = this.phone; // Map to older variable if needed in template
                    this.toast.add({ severity: 'success', summary: 'Success', detail: 'OTP validated successfully' });
                }
            },
            error: (error) => {
                this.isResendOTP = true;
                this.otp = ['', '', '', ''];
                this.otpArray.fill(''); // Clear internal array too
                this.toast.add({ severity: 'error', summary: 'Error', detail: error?.error.message });
                this.isSubmittingOTP = false;
            },
        });
    }

    phoneNumber: any; // Kept for template compatibility if used

    onEditNumber() {
        this.phoneVerification.enable();
        this.isSendingOTP = false;
    }

    onCheckHaveWhatsappOrPhone(event: any) {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.haveWhatsapp = isChecked ? 'Phone' : 'WhatsApp';
    }

    // ==========================================================================
    // REPORTS & MODULES
    // ==========================================================================

    getModuleList() {
        this.subs.sink = this.locationService.getUniPerpModuleList().subscribe((data) => {
            this.moduleList = data.modules;
            this.selectedModuleId = 1;
        });
    }

    onChangeModuleList(moduleId: number = 1) {
        this.selectedModuleId = moduleId;
        this.locationService.getSubModuleByModule({ moduleid: moduleId }).subscribe((res) => {
            this.subModuleList = res.submodules;
        });
    }

    onChangeSubModuleList(subModuleId: any = 1) {
        const data = {
            moduleId: this.selectedModuleId,
            countryId: this.selectedCountryId,
            submoduleId: subModuleId,
        };
        this.locationService.getModuleQuestionList(data).subscribe((res) => {
            this.questionList = res.questions.map((x: any, i: number) => ({ ...x, index: i + 1 }));
        });
    }

    getReportOption() {
        this.reportOptionList = [];
        this.subs.sink = this.locationService.getReportOptionList().subscribe((data) => {
            const reportTypeData = data.reportOptions.filter((value: any) => value.reporttype === this.reportType);
            this.reportOptionList = [{ id: null, reportoption_name: 'Select' }, ...reportTypeData];
        });
    }

    onSubmit(op: Popover) {
        if (!this.reportSubmitForm.value.reportOption) {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please Select Issue Type' });
            return;
        }

        const formVal = this.reportSubmitForm.value;
        const data = {
            moduleId: this.moduleQuestionReport?.moduleId || formVal.moduleId,
            submoduleId: this.moduleQuestionReport?.subModuleId || formVal.submoduleId,
            questionId: this.moduleQuestionReport?.questionId || formVal.questionId,
            reportOption: formVal.reportOption,
            comment: formVal.comment,
            countryId: this.selectedCountryId,
            type_of_report: [4, 5, 6, 7].includes(this.reportType)
                ? this.reportType
                : (this.reportLearnLanguageType === 8 ? 8 : undefined),
        };

        // Specific Module Logic overriding country
        if (data.moduleId === 8) data.countryId = 0;
        if ([23, 24, 25, 27].includes(data.moduleId)) {
            data.countryId = this.moduleQuestionReport.countryId;
        }

        // Fire and forget email logging
        const mailData = { reportOption: formVal.reportOption, comment: formVal.comment };
        this.locationService.reportFaqQuestionaftersubmit(mailData).subscribe();

        this.locationService.reportFaqQuestion(data).subscribe(() => {
            this.dataService.showFeedBackPopup(true);
            this.reportSubmitForm.patchValue({ comment: null });
            setTimeout(() => {
                this.dataService.showFeedBackPopup(false);
                op.hide();
            }, 3000);
        });

        this.getReportOption();
    }

    openReportModal(op: Popover, event: Event) {
        this.reportType = 1;
        this.reportSubmitForm.reset();
        this.moduleList = [];
        this.subModuleList = [];
        this.questionList = [];
        this.getModuleList();
        this.getReportOption();

        this.selectedGenMod = 1;
        this.onChangeModuleList(1);
        this.onChangeSubModuleList(1);

        this.moduleQuestionReport = [];
        this.isQuestionVisible = true;
        this.isVisibleModulesMenu = false;
        op.toggle(event);
    }

    openReportModalFromMoudle(op: any, event: any) {
        this.reportType = 1;
        this.isQuestionVisible = false;
        this.isVisibleModulesMenu = true;
        op.toggle(event);
    }

    handleReportWindowData(data: any) {
        this.moduleQuestionReport = data;
        this.moduleList = [];
        this.subModuleList = [];
        this.questionList = [];

        this.getModuleList();
        this.onChangeModuleList(data.moduleId);
        this.onChangeSubModuleList(data.subModuleId);

        this.selectedGenMod = 2;
        this.openReportModalFromMoudle(this.op, event);

        this.reportType = 3;
        this.reportLearnLanguageType = data.reporttype === 8 ? 8 : 0;

        // Refresh user data context
        this.loadUserData();

        if (data.report_mode === 'other_module') {
            this.locationService.getModuleReportOptionLists(data).subscribe((response) => {
                this.reportOptionList = [{ id: null, reportoption_name: 'Select' }, ...response.reportOptions];
                this.reportType = data.reporttype;
            });
        } else {
            this.getReportOption();
        }

        this.isVisibleModulesMenu = true;
        this.moduleNgModel = data.moduleId;
        this.subModuleNgModel = data.subModuleId;
        this.questionIdNgModel = data.questionId;
    }

    onChangeChooseMain(event: any) {
        this.isVisibleModulesMenu = event === 2;
    }

    // ==========================================================================
    // SUBSCRIPTION & TRIALS
    // ==========================================================================

    setupTimersAndTrial() {
        if (this.authService._user.subscription_exists === 0) {
            this.checkNewUser();
        } else {
            this.subScribedUserCount();
            this.userLoginTimeLeftCount = true;
        }

        // Check white label status
        this.authService.getNewUserTimeLeft().subscribe((res) => {
            const isFreeTrialInProgress = res.subscription_details.subscription_plan === 'free_trail'
                && res.time_left.plan === 'on_progress';

            if (this.imageWhiteLabelDomainName === 'Uniprep' || this.imageWhiteLabelDomainName === 'Partner') {
                this.whiteLabelIsShow = true;
            } else {
                this.whiteLabelIsShow = false;
            }
        });
    }

    subScribedUserCount(): void {
        this.authService.getNewUserTimeLeft().subscribe((res) => {
            this.currentUserSubscriptionPlan = res?.subscription_details?.subscription_plan;
            this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
            const data = res.time_left;

            if (data.plan === 'not_started') {
                this.visible = false;
            } else {
                this.getTimer(data.minutes, data.seconds, data.hours, data.days, data.months);
            }
        });
    }

    checkNewUser(): void {
        this.authService.getNewUserTimeLeft().subscribe((res) => {
            this.currentUserSubscriptionPlan = res?.subscription_details?.subscription_plan;
            this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
            this.dashboardService.updatedata(res.time_left);

            const data = res.time_left;
            if (data.plan === 'on_progress') {
                this.userLoginTimeLeftCount = false;
                this.timer(data.minutes, data.seconds, data.hours);
            } else if (data.plan === 'subscription_inprogress') {
                this.userLoginTimeLeftCount = false;
                this.getTimer(data.minutes, data.seconds, data.hours, data.days, data.months);
            }
        });
    }

    onClickSubscribe() {
        this.visible = false;
        if (this.enterpriseSubscriptionLink) {
            window.open(this.enterpriseSubscriptionLink, '_target');
            return;
        }
        this.router.navigate(['/pages/subscriptions']);
    }

    continueTrial(): void {
        let data: any = {};
        if (this.mobileForm.get('nationality_id')?.valid && this.mobileForm.get('study_level')?.valid) {
            data = this.mobileForm.value;
        }
        if (this.demoTrial) {
            data.demo_user = 1;
        }

        this.dashboardService.getContineTrial(data).subscribe({
            next: (res) => {
                this.authService._user.currency = res?.currency;
                if (this.demoTrial) {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Demo Trail Started' });
                }

                // Reset state
                this.authService.contineStatus(false);
                this.dataService.sendValue(false);
                this.freeTrial = false;
                this.demoTrial = false;
                this.authService._userContineTrial = false;
                this.authService._user.nationality_id = this.mobileForm.value.nationality_id;

                setTimeout(() => {
                    this.checkNewUser();
                    this.router.navigate(['/pages/talent-connect/my-profile']);
                }, 2000);
            },
            error: (error) => {
                if (this.demoTrial) {
                    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Demo Trail Not Started' });
                }
                this.freeTrialErrorMsg = error?.message;
            }
        });
    }

    onClickSubscribedUser(): void {
        const isStandardUser = this.imageWhiteLabelDomainName?.toLowerCase() === 'uniprep' || this.imageWhiteLabelDomainName === 'Partner';

        if (isStandardUser) {
            this.visibleExhastedUser = false;
            let data: any = {};

            if (this.mobileForm.get('nationality_id')?.valid && this.mobileForm.get('study_level')?.valid) {
                data = this.mobileForm.value;
            }
            if (this.demoTrial) data.demo_user = 1;

            this.dashboardService.getContineTrial(data).subscribe({
                next: () => {
                    if (this.demoTrial) {
                        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Demo Trail Started' });
                    }
                    this.freeTrial = false;
                    this.demoTrial = false;
                    this.visibleExhasted = false;
                    this.authService._userContineTrial = false;
                    this.authService.contineStatus(false);
                    this.dataService.sendValue(false);

                    setTimeout(() => {
                        this.checkNewUser();
                        this.dashboardService.isinitialstart = true;
                        if (this.enterpriseSubscriptionLink) {
                            window.open(this.enterpriseSubscriptionLink, '_target');
                            return;
                        }
                        this.router.navigate(['/pages/subscriptions']);
                    }, 1000);
                },
                error: (error) => {
                    this.freeTrialErrorMsg = error?.message;
                }
            });
        } else {
            this.visibleExhastedUser = true;
            this.demoTrial = false;
        }
    }

    // ==========================================================================
    // TIMERS
    // ==========================================================================

    getTimer(minute: any, sec: any, hours: any, days: any, months: any): void {
        let totalSeconds: number = hours * 3600 + minute * 60 + sec;

        this.timerInterval = setInterval(() => {
            totalSeconds--;
            const hoursLeft = Math.floor(totalSeconds / 3600);
            const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
            const secondsLeft = totalSeconds % 60;

            this.min$ = minutesLeft < 10 && minutesLeft > 0 ? '0' + minutesLeft : minutesLeft.toString();
            this.sec$ = secondsLeft < 10 && secondsLeft > 0 ? '0' + secondsLeft : secondsLeft.toString();
            this.hrs$ = hoursLeft;
            this.month$ = months;
            this.day$ = days;

            if (minute <= 0 && hours <= 0 && sec <= 0) {
                this.hrs$ = 0; this.min$ = 0; this.sec$ = 0;
            }

            if (minutesLeft <= 0 && hoursLeft <= 0 && days <= 0 && secondsLeft <= 0 && months <= 0) {
                this.visibleExhasted = true;
                clearInterval(this.timerInterval);
            }
        }, 1000);
    }

    timer(minute: any, sec: any, hours: any): void {
        let totalSeconds: number = hours * 3600 + minute * 60 + sec;

        this.timerInterval = setInterval(() => {
            totalSeconds--;

            const hoursLeft = Math.floor(totalSeconds / 3600);
            const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
            const secondsLeft = totalSeconds % 60;

            this.timeHours = hoursLeft;
            this.timeLeftMins = minutesLeft < 10 && minutesLeft > 0 ? '0' + minutesLeft : minutesLeft.toString();
            this.timeLeftSecs = secondsLeft < 10 && secondsLeft > 0 ? '0' + secondsLeft : secondsLeft.toString();

            if (this.timeLeftMins == '00') this.timeLeftMins = 0;
            if (this.timeLeftSecs == '00') this.timeLeftSecs = 0;

            if (minutesLeft <= 0 && this.timeHours <= 0 && secondsLeft <= 0) {
                this.locationService.trialEnds().subscribe();
                clearInterval(this.timerInterval);

                // Expire session
                this.authService.getMe().subscribe({
                    next: () => this.userSubscriptionService.freeTrailExpiredStatus$.next(true),
                    error: () => this.userSubscriptionService.freeTrailExpiredStatus$.next(true),
                });
            }

            this.min$ = minutesLeft;
            this.sec$ = secondsLeft;
            this.hrs$ = this.timeHours;
        }, 1000);
    }

    exploreNow() {
        this.dataService.showTimerInHeader(null);
    }

    // ==========================================================================
    // UI HELPERS
    // ==========================================================================

    toggleMenu() {
        const sidenav = document.getElementById('sidenav');
        if (sidenav) {
            this.isMenuOpen = !this.isMenuOpen;
            this.storage.set('isMenuOpen', JSON.stringify(this.isMenuOpen));
            this.updateMenuClass(sidenav);
        }
    }

    updateMenuClass(sidenav: Element) {
        if (this.isMenuOpen) {
            sidenav.classList.remove('menuclosed');
        } else {
            sidenav.classList.add('menuclosed');
        }
    }

    openModal() {
        this.isChatWindowVisible = true;
    }

    openchat() {
        this.router.navigate(['/pages/advisor']);
    }

    openFlagModal(totalCountryList: Popover, event: Event): void {
        this.isLondon = true;
        this.isCountryPopupOpen = event;
        totalCountryList.toggle(event);
    }

    openHomeCountryFlagModal(totalHomeCountryList: Popover, event: Event): void {
        this.isLondon = true;
        this.isCountryPopupOpen = event;
        totalHomeCountryList.toggle(event);
    }

    showSearchComponent(type: any) {
        this.activeHeaderSearch = type;
        this.isShowHeaderSearchForModule = this.activeHeaderSearch.stage !== 'questionsearch';
    }

    conditionModuleOrQuestionComponent() {
        this.currentRoute = this.router.url;
        // Hide search on specific pages
        const hideSearchRoutes = [
            'subscriptions', 'support-help', 'usermanagement', 'chat',
            'guideline', 'termsandcondition', 'privacypolicy',
            'refundpolicy', 'cancellationpolicy', 'export-credit',
            'cv-builder', 'coverletter-builder'
        ];

        this.showSearch = !hideSearchRoutes.some(route => this.currentRoute.includes(route));
    }

    // ==========================================================================
    // API HELPERS (Simple Getters)
    // ==========================================================================

    getProgramLevelList() {
        this.locationService.getProgramLevel().subscribe((res) => {
            this.programLevelList = res;
        });
    }

    getHomeCountry() {
        this.locationService.getHomeCountryNew().subscribe({
            next: (res: any) => this.homeCountryList = res,
            error: (error: any) => this.toast.add({ severity: 'warning', summary: 'Warning', detail: error.error.message })
        });
    }

    getInterestedMenus() {
        this.commonService.getInterestedMenus().subscribe({
            next: (res) => {
                this.interestMenuList = res.data;
                if (res.data.length > 0) {
                    this.interestMenuList.forEach((item: any) => {
                        if (item.id != 1) item.disabled = true;
                    });
                }
            },
            error: () => {},
        });
    }

    getNationalityList() {
        this.locationService.getNationality().subscribe({
            next: (res) => (this.nationalityList = res),
            error: () => {},
        });
    }

    getNotificationList() {
        this.dashboardService.getUserNotification().subscribe((data: any) => {
            this.notifications = data.notifications;
            this.unreadCount = data.unreadcount;
        });
    }

    getAICreditCount() {
        this.promptService.getAicredits().subscribe({
            next: (resp) => {
                this.aiCreditCount = resp;
                this.authService._creditCount = resp;
            },
        });
    }

    buyCredits() {
        this.router.navigate(['/pages/export-credit']);
    }

    changeLocation(event: any) {
        this.getLocationList();
    }

    getLocationList() {
        this.locationList = [{ id: 0, district: 'Others' }];
        this.mobileForm?.get('location_id')?.setValue(0);

        if (this.mobileForm.get('home_country')?.value == 122) {
            this.locationService.getLocation().subscribe({
                next: (res: any) => (this.locationList = res),
                error: (error: any) => {
                    this.toast.add({ severity: 'warning', summary: 'Warning', detail: error.error.message });
                },
            });
        }
    }

    updateEducationLevel() {
        const eduLevel = this.currentEducationForm.value.current_education;
        this.authService.updateEducationLevel(eduLevel).subscribe((res) => {
            this.currentEducation = false;
            this.toast.add({ severity: 'success', summary: 'success', detail: res.message });
        });
    }

    closeQuiz(): void {
        this.visibleExhastedUser = false;
        this.demoTrial = true;
    }

    // ==========================================================================
    // ILEARN & NOTIFICATIONS ACTIONS
    // ==========================================================================

    navigateILearnChallenge() {
        if (['Career', 'Entrepreneur'].includes(this.currentUserSubscriptionPlan)) {
            const popupStatus = this.authService?._user?.ilearn_popup_status;

            if (this.router.url === '/pages/assessment/ilearn-challenge') return;

            switch (popupStatus) {
                case 0:
                case 1:
                    this.assessmentService.getAssessmentParticipatingCount().subscribe({
                        next: (res) => {
                            this.assParticipations = res.cluster_count;
                            this.isILearnParticipantsVisible = true;
                        },
                    });
                    break;
                case 2:
                    this.isILearnLiveVisible = true;
                    break;
                case 3:
                    this.isILearnCompletedVisible = true;
                    break;
            }
            return;
        }
        this.isUpgradePlanVisible = true;
    }

    onSubscribe() {
        this.isUpgradePlanVisible = false;
        this.router.navigateByUrl('/pages/subscriptions');
    }

    onClickiLearnChallenge() {
        this.isILearnLiveVisible = false;
        this.isILearnCompletedVisible = false;
        this.router.navigateByUrl('/pages/assessment/ilearn-challenge');
    }

    markAsRead(notification: any) {
        if (notification.is_read) return;
        this.dashboardService.userNotificationread(notification.id).subscribe(() => {
            notification.is_read = 1;
            this.getNotificationList();
        });
    }

    markAllRead(event: Event) {
        event.preventDefault();
        this.dashboardService.userNotificationread(undefined, 'read_all').subscribe(() => {
            this.notifications.forEach((n) => {
                // Skip unresolved doc requests
                if (n.title === 'Document Request' && n.is_accepted === 0 && n.is_rejected === 0) return;
                n.is_read = 1;
            });
            this.getNotificationList();
        });
    }

    updateDocsStatus(id: number, type: string, event: MouseEvent) {
        event.stopPropagation();
        this.dashboardService.docsWalletStatus(id, type).subscribe({
            next: () => {
                const notification = this.notifications.find((n) => n.id === id);
                if (notification) {
                    notification.is_accepted = type === 'Accepted' ? 1 : 0;
                    notification.is_rejected = type === 'Rejected' ? 1 : 0;
                    if (!notification.is_read) {
                        this.dashboardService.userNotificationread(notification.id).subscribe(() => {
                            notification.is_read = 1;
                        });
                    }
                }
            },
            error: (err) => console.error('Error updating document status', err),
        });
    }
}