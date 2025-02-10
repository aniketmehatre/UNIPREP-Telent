import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { AuthService } from "../../../Auth/auth.service";
import { SubSink } from "subsink";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "../../../location.service";
import { DataService } from "src/app/data.service";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from "@angular/forms";
import { matchValidator } from "../../../@Supports/matchvalidator";
import { ThemeService } from "../../../theme.service";
import { DashboardService } from "src/app/pages/dashboard/dashboard.service";
import { count, Observable } from "rxjs";
import { CountryISO, SearchCountryField, NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { environment } from "@env/environment";
import CryptoJS from "crypto-js";
import { AssessmentService } from "src/app/pages/assessment/assessment.service";
import { ILearnChallengeData } from "src/app/@Models/ilearn-challenge.model";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { TabsModule } from 'primeng/tabs';
import { PopoverModule  } from "primeng/popover";

import { InputTextModule } from "primeng/inputtext";
import { AvatarModule } from "primeng/avatar";
import { switchMap } from "rxjs/operators";
import { take } from "rxjs/operators";

import { SelectModule } from "primeng/select";

@Component({
  selector: "uni-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule, 
    DialogModule, 
    TabsModule,
    PopoverModule , 
    FormsModule, 
    ReactiveFormsModule, 
     
    AvatarModule,
    NgxIntlTelInputModule,
    InputTextModule,
    SelectModule

  ],
  providers: [
    MessageService,
    AuthService,
    LocationService,
    ThemeService,
    DashboardService,
    AssessmentService
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("op") op!: ElementRef<HTMLInputElement>;
  public reportSubmitForm!: FormGroup;
  public mobileForm!: FormGroup;
  public currentEducationForm!: FormGroup;
  public phoneVerification!: FormGroup;
  public setPasswordForm!: FormGroup;
  @Input() breadcrumb: MenuItem[] = [{ label: "Categories" }, { label: "Sports" }];
  @Input() expandicon = "";

  @Output() togleSidebar = new EventEmitter();
  private subs = new SubSink();
  userName: string = '';
  firstChar: string = '';
  genMod: any;
  moduleNgModel: number = 1;
  selectedGenMod: number = 1;
  subModuleNgModel: number = 1;
  questionIdNgModel: number = 1;
  reportOptionNgModel: number = 0;
  selectedCountryId: any;
  selectedModuleId: any;
  moduleList: any[] = [];
  subModuleList: any[] = [];
  questionList: any;
  moduleQuestionReport: any;
  reportOptionList: any[] = [];
  darkModeSwitch!: HTMLInputElement;
  visible: boolean = false;
  isShowFreeTrialStart: boolean = false;
  isChangePasswordWindowVisible: boolean = false;
  day$: Observable<any> | any;
  hrs$: Observable<any> | any;
  min$: Observable<any> | any;
  sec$: Observable<any> | any;
  month$: Observable<any> | any;
  isVisibleModulesMenu: boolean = false;
  isChatWindowVisible: boolean = false;
  isQuestionVisible: boolean = true;
  messages: any = [];
  show = false;
  password: string = "password";
  show1 = false;
  password1: string = "password";
  headerFlag: any = "";
  headerHomeFlag: any = "";
  homeCountryId: any;
  homeCountryName: string = "";
  selectedHomeCountry: any = null;
  timeLeftSecs: any;
  timerInterval: any;
  userLoginTimeLeftCount!: boolean;
  timeLeftMins: any;
  isLondon!: boolean;
  countryLists!: any;
  timeHours: any;
  timeDays: any;
  freeTrial!: boolean;
  visibleExhasted: boolean = false;
  reportType: number = 1;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom];
  timeLeftInfo: any;
  freeTrialErrorMsg: string = "";
  demoTrial: boolean = false;
  demoDays: any;
  reportlearnlanguagetype: number = 0;
  countryList: any; //this is the original home country list for time being am doing like this.
  indiaHomeCountry: any = [{ country: "India", id: 122 }];
  locationList: any;
  whiteLabelIsNotShow: boolean = true;
  visibleExhastedUser!: boolean;
  programLevelList: any = [];
  currentEducation!: boolean;
  whatsappVerification: boolean = false;
  ApiUrl: string = environment.domain;
  educationImage: string = "";
  otp: string[] = ["", "", "", ""];
  otpArray = Array(4).fill(0);

  currentUserSubscriptionPlan: string = "";
  iLearnChallengeData: ILearnChallengeData;
  isUpgradePlanVisible: boolean = false;
  isILeanrParticipantsVisible: boolean = false;
  isILearnLiveVisible: boolean = false;
  isILearnCompletedVisible: boolean = false;
  assParticipations: number = 0;
  formvisbility = false;
  preferredCountry: any;
  imagewhitlabeldomainname: any;
  orgnamewhitlabel: any;
  isNotSuccess: boolean = true;
  submitted: boolean = false;

  // Add phone number configuration
  phoneNumberConfig = {
    preferredCountries: [CountryISO.India],
    enablePlaceholder: true,
    searchCountryFlag: true,
    searchCountryField: [SearchCountryField.Iso2, SearchCountryField.Name],
    selectedCountryISO: CountryISO.India
  };

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
    private assessmentService: AssessmentService
  ) {
    // Initialize forms in constructor
    this.reportSubmitForm = this.formBuilder.group({
      general: [1, [Validators.required]],
      moduleId: ["", [Validators.required]],
      submoduleId: ["", [Validators.required]],
      questionId: ["", [Validators.required]],
      reportOption: [""],
      comment: ["", []]
    });

    this.mobileForm = this.formBuilder.group({
      phone: [undefined, [Validators.required]],
      home_country: [122, Validators.required],
      study_level: ["", Validators.required],
    });

    this.currentEducationForm = this.formBuilder.group({
      current_education: ["", Validators.required],
    });

    this.phoneVerification = this.formBuilder.group({
      verification_phone: ["", Validators.required],
      choice: [false, Validators.required],
    });

    this.setPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });

    this.dataService.castValue.subscribe((data) => {
      if (data === true) {
        this.checkNewUSerLogin();
      } else {
        this.freeTrial = false;
      }
    });
    route.params.subscribe((val) => {
      this.reportType = 1;
      this.getReportOption();
      // put the code from `ngOnInit` here
      this.loadCountryList();
    });
    this.service.getTimeInfoForCard().subscribe((data) => {
      localStorage.setItem("time_card_info", data.card_message);
    });
    this.assessmentService.iLearnChallengeData$.subscribe((data) => {
      this.iLearnChallengeData = data;
    });
    this.assessmentService.sideMenuiLearnChallengeData$.subscribe((data) => {
      if (data) {
        this.navigateILearnChallenge();
      }
    });
  }

  loadCountryList() {
    this.subs.sink = this.locationService.getCountry().subscribe({
      next: (countryList) => {
        this.countryLists = countryList;
        
        // Get the selected country ID from localStorage
        const storedCountryId = localStorage.getItem('selectedCountryId');
        
        if (storedCountryId) {
          // If we have a stored selection, use that
          this.selectedCountryId = Number(storedCountryId);
          const selectedCountry = this.countryLists.find((element: any) => element.id === this.selectedCountryId);
          
          if (selectedCountry) {
            this.headerFlag = selectedCountry.flag;
            this.dataService.changeCountryName(selectedCountry.country);
            this.dataService.changeCountryFlag(selectedCountry.flag);
            this.dataService.changeCountryId(selectedCountry.id.toString());
          }
        } else {
          // If no stored selection, try to use the home country
          const homeCountryId = localStorage.getItem('homeCountryId');
          if (homeCountryId) {
            this.selectedCountryId = Number(homeCountryId);
            const homeCountry = this.countryLists.find((element: any) => element.id === this.selectedCountryId);
            
            if (homeCountry) {
              this.headerFlag = homeCountry.flag;
              this.dataService.changeCountryName(homeCountry.country);
              this.dataService.changeCountryFlag(homeCountry.flag);
              this.dataService.changeCountryId(homeCountry.id.toString());
              localStorage.setItem('selectedCountryId', homeCountry.id.toString());
            }
          } else {
            // If no home country either, then default to India (122)
            const defaultCountry = this.countryLists.find((element: any) => element.id === 122);
            if (defaultCountry) {
              this.headerFlag = defaultCountry.flag;
              this.dataService.changeCountryName(defaultCountry.country);
              this.dataService.changeCountryFlag(defaultCountry.flag);
              this.dataService.changeCountryId('122');
              localStorage.setItem('selectedCountryId', '122');
            }
          }
        }
      },
      error: (error) => {
        console.error('Error loading country list:', error);
      }
    });
  }
  get isDialogVisible(): boolean {
    return this.currentEducation && !this.formvisbility;
  }
  isMenuOpen = true;
  toggleMenu() {
    const sidenav: Element | null = document.getElementById("sidenav");
    if (sidenav) {
      this.isMenuOpen = !this.isMenuOpen;
      localStorage.setItem("isMenuOpen", JSON.stringify(this.isMenuOpen));
      this.updateMenuClass();
    }
  }

  showPassword() {
    if (this.password === "password") {
      this.password = "text";
      this.show = true;
    } else {
      this.password = "password";
      this.show = false;
    }
  }

  showPassword1() {
    if (this.password1 === "password") {
      this.password1 = "text";
      this.show1 = true;
    } else {
      this.password1 = "password";
      this.show1 = false;
    }
  }

  onInputOTP(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.otp[index] = value;
    // Move to next box if a digit is entered
    if (value && value.length === 1 && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput.focus();
    }
  }

  onKeydownOPT(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Move to the previous box if backspace is pressed and input is empty
    if (event.key === "Backspace" && !input.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput.focus();
    }
  }

  isSendingOTP: boolean = false;
  isResendOTP: boolean = false;

  sendOTP() {
    this.phoneVerification.disable();
    let formData = this.phoneVerification.value;
    let sendPhoneNumber = {
      country_code: formData.verification_phone.dialCode,
      phone: formData.verification_phone.number,
      whatsapp_number_or_not: formData.choice,
      dial_code: formData.verification_phone.countryCode,
    };
    this.service.sendWhatsappOtp(sendPhoneNumber).subscribe({
      next: (response) => {
        this.isSendingOTP = true;
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
      },
      error: (error) => {
        this.phoneVerification.enable();
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error?.message,
        });
      },
    });
  }

  submitPhoneVerification() {
    let formData = this.phoneVerification.value;
    let sendOTP = {
      country_code: formData.verification_phone.dialCode,
      phone: formData.verification_phone.number,
      dial_code: formData.verification_phone.countryCode,
      otp: this.otp.join(""),
      whatsapp_number_or_not: formData.choice == "yes" ? "no" : "yes",
    };
    this.service.validateWhatsappOtp(sendOTP).subscribe({
      next: (response) => {
        this.whatsappVerification = false;
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: "Phone number verified successfully",
        });
      },
      error: (error) => {
        this.isResendOTP = true;
        this.otp = ["", "", "", ""];
        let otpList = document.querySelectorAll(".otp-box");
        otpList.forEach((item: any) => (item.value = ""));
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error?.message,
        });
      },
    });
  }

  exploreNow() {
    this.dataService.showTimerInHeader(null);
  }
  openchat() {
    this.router.navigate(["/pages/advisor"]);
  }
  updateMenuClass() {
    const sidenav: Element | null = document.getElementById("sidenav");
    if (sidenav) {
      if (this.isMenuOpen) {
        sidenav.classList.remove("menuclosed");
      } else {
        sidenav.classList.add("menuclosed");
      }
    }
  }
  ngOnInit() {
    this.initializeForms();
    this.setupEventSubscriptions();
    this.setupReportWindowSubscription();
    
    // Initialize country data
    this.homeCountryId = localStorage.getItem('homeCountryId') ? Number(localStorage.getItem('homeCountryId')) : 122; // Default to India if not set
    this.getHomeCountryList();
    this.loadCountryList();
    this.getProgramlevelList();
    this.checkNewUser();

    // Add subscription to get user data
    this.subs.sink = this.service.getMe().subscribe({
      next: (data) => {
        if (data && data.userdetails && data.userdetails[0]) {
          this.userName = data.userdetails[0].name;
          this.firstChar = data.userdetails[0].name;
          // Set home country from user data if available
          if (data.userdetails[0].home_country) {
            this.homeCountryId = data.userdetails[0].home_country;
            this.getHomeCountryList();
          }
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });

    // Safely handle menu state
    try {
      const storedIsMenuOpen = localStorage.getItem("isMenuOpen");
      this.isMenuOpen = storedIsMenuOpen ? JSON.parse(storedIsMenuOpen) : true;
    } catch (error) {
      console.error('Error parsing menu state:', error);
      this.isMenuOpen = true;
    }
    this.updateMenuClass();

    // Subscribe to organization name
    this.locationService.getOrgName().subscribe({
      next: (orgname) => {
        this.orgnamewhitlabel = orgname;
      },
      error: (error) => {
        console.error('Error getting org name:', error);
      }
    });

    // Handle domain-specific settings
    this.imagewhitlabeldomainname = window.location.hostname;
    this.whiteLabelIsNotShow = this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || 
                              this.imagewhitlabeldomainname === "uniprep.ai" || 
                              this.imagewhitlabeldomainname === "localhost";

    // Get preferred country
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        this.preferredCountry = data?.country_code?.toLocaleLowerCase();
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
        this.preferredCountry = 'in'; // Default to India if fetch fails
      });

    // Handle country ID subscription
    this.subs.sink = this.dataService.countryId.subscribe({
      next: (data: any) => {
        if (data) {
          this.selectedCountryId = Number(data);
          localStorage.setItem('selectedCountryId', data.toString());
          this.getModuleList();
        }
      },
      error: (error) => console.error('Error in country ID subscription:', error)
    });

    // Subscribe to home country flag changes
    this.subs.sink = this.dataService.homeCountryFlagSource.subscribe({
      next: (data) => {
        if (data) {
          this.headerHomeFlag = data;
        }
      },
      error: (error) => console.error('Error in home country flag subscription:', error)
    });

    // Subscribe to country flag changes
    this.subs.sink = this.dataService.countryFlagSource.subscribe({
      next: (data: any) => {
        if (data) {
          this.headerFlag = data;
        }
      },
      error: (error) => console.error('Error in country flag subscription:', error)
    });

    // Subscribe to dashboard data
    this.subs.sink = this.dashboardService.data$.subscribe({
      next: (data) => {
        if (data) {
          this.min$ = data.minutes;
          this.sec$ = data.seconds;
          this.hrs$ = data.hours;
          this.day$ = data.days;
          this.month$ = data.months;
        }
      },
      error: (error) => console.error('Error in dashboard data subscription:', error)
    });

    // Handle phone verification
    this.handlePhoneVerification();

    // Check subscription status
    if (this.service._checkExistsSubscription === 0) {
      this.checkNewUser();
    } else {
      this.subScribedUserCount();
      this.userLoginTimeLeftCount = true;
      this.subs.sink = this.dataService.showTimeOutSource.subscribe({
        next: (data) => this.visible = data,
        error: (error) => console.error('Error in timeout subscription:', error)
      });
    }

    // Initialize report form and other settings
    this.initializeReportForm();

    // Subscribe to dashboard country changes
    this.subs.sink = this.dashboardService.selectedCountry$.subscribe({
      next: (countryData: any) => {
        if (countryData) {
          this.selectCountryInHeader(countryData, null);
        }
      },
      error: (error) => console.error('Error in dashboard country subscription:', error)
    });
  }

  private initializeForms() {
    this.mobileForm = this.formBuilder.group({
      phone: [undefined, [Validators.required]],
      home_country: [122, Validators.required],
      study_level: ["", Validators.required],
    });

    this.currentEducationForm = this.formBuilder.group({
      current_education: ["", Validators.required],
    });

    this.setPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  private async handlePhoneVerification() {
    try {
      const encryptedPhone = localStorage.getItem("phone");
      if (!encryptedPhone) {
        console.log('No encrypted phone data found');
        return;
      }

      // First try to decode base64 to check for malformed data
      let decodedArray;
      try {
        decodedArray = new Uint8Array(
          atob(encryptedPhone).split('').map(char => char.charCodeAt(0))
        );
      } catch (decodeError) {
        console.error('Error decoding base64 data:', decodeError);
        return;
      }

      const key = await this.getKey(environment.secretKeySalt);

      // Extract IV and encrypted data
      const iv = decodedArray.slice(0, 12);
      const data = decodedArray.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      // Check for valid UTF-8 data
      let decryptedStr;
      try {
        decryptedStr = new TextDecoder('utf-8', { fatal: true }).decode(decrypted);
      } catch (utf8Error) {
        console.error('Invalid UTF-8 data:', utf8Error);
        return;
      }

      // Validate JSON structure
      let phone;
      try {
        phone = JSON.parse(decryptedStr);
        if (!phone || typeof phone !== 'string') {
          console.error('Invalid phone data format');
          return;
        }
      } catch (jsonError) {
        console.error('Invalid JSON data:', jsonError);
        return;
      }

      // Set form visibility based on phone value
      this.formvisbility = !phone;
      
      if (phone) {
        this.phoneVerification.patchValue({
          verification_phone: phone
        });
      }
    } catch (error) {
      console.error('Error in handlePhoneVerification:', error);
      this.formvisbility = true;
    }
  }

  private async getKey(salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(salt),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private initializeReportForm() {
    this.genMod = [{ name: "General", id: 1 }];
    
    this.reportSubmitForm = this.formBuilder.group({
      general: [1, [Validators.required]],
      moduleId: ["", [Validators.required]],
      submoduleId: ["", [Validators.required]],
      questionId: ["", [Validators.required]],
      reportOption: [""],
      comment: ["", []],
    });
  }

  private setupEventSubscriptions() {
    this.dataService.chatTriggerSource.subscribe({
      next: (message) => {
        if (message === "open chat window") {
          this.openModal();
        }
      },
      error: (error) => console.error('Error in chat trigger subscription:', error)
    });

    this.locationService.getCountry().subscribe({
      next: (countryList) => {
        this.countryLists = countryList;
        const countryId = localStorage.getItem("countryId");
        if (countryId) {
          const country = countryList.find((element: any) => element.id.toString() === countryId);
          if (country) {
            this.headerFlag = country.flag;
          }
        }
      },
      error: (error) => console.error('Error getting country list:', error)
    });

    this.dataService.countryFlagSource.subscribe({
      next: (data) => {
        if (data) {
          this.headerFlag = data;
        }
      },
      error: (error) => console.error('Error in country flag subscription:', error)
    });

    this.setupReportWindowSubscription();
  }

  private setupReportWindowSubscription() {
    this.dataService.openReportWindowSource.subscribe({
      next: (data) => {
        if (data?.isVisible) {
          this.handleReportWindowData(data);
        } else {
          this.isQuestionVisible = false;
        }
      },
      error: (error) => console.error('Error in report window subscription:', error)
    });
  }

  private handleReportWindowData(data: any) {
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
    this.reportlearnlanguagetype = data.reporttype === 8 ? 8 : 0;

    if (data.report_mode && data.report_mode === "other_module") {
      this.handleOtherModuleReport(data);
    } else {
      this.getReportOption();
    }

    this.isVisibleModulesMenu = true;
    this.moduleNgModel = data.moduleId;
    this.subModuleNgModel = data.subModuleId;
    this.questionIdNgModel = data.questionId;
  }

  private handleOtherModuleReport(data: any) {
    this.subs.sink = this.locationService.getModuleReportOptionLists(data).subscribe({
      next: (response) => {
        this.reportOptionList = [{ id: null, reportoption_name: "Select" }, ...response.reportOptions];
        this.reportType = data.reporttype;
      },
      error: (error) => console.error('Error getting module report options:', error)
    });
  }

  getProgramlevelList() {
    this.locationService.getProgramLevel().subscribe((res) => {
      this.programLevelList = res;
    });
  }

  UpdateEducationLevel() {
    let eduLevel = this.currentEducationForm.value.current_education;
    this.service.updateEducationLevel(eduLevel).subscribe((res) => {
      this.currentEducation = false;
      this.toast.add({
        severity: "success",
        summary: "success",
        detail: res.message,
      });
    });
  }

  ngOnDestroy() {
    console.log("destroy");
    this.subs.unsubscribe();
  }

  openModal() {
    this.isChatWindowVisible = true;
  }

  openReportModalFromMoudle(op: any, event: any) {
    this.reportType = 1;
    this.isQuestionVisible = false;
    this.isVisibleModulesMenu = true;
    op.toggle(event);
  }

  openReportModal(op: any, event: any) {
    this.reportType = 1;
    this.reportSubmitForm.reset();
    // this.reportSubmitForm = this.formBuilder.group({
    //   general: [1, [Validators.required]],
    //   moduleId: ["", [Validators.required]],
    //   submoduleId: ["", [Validators.required]],
    //   questionId: ["", [Validators.required]],
    //   reportOption: [""],
    //   comment: ["", []],
    // });

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
    // this.dataService.openReportWindowSource.subscribe((data) => {
    //   if (data.from == 'module') {
    //     this.isQuestionVisible = false
    //   }else{
    //     this.isQuestionVisible = true;
    //     this.isVisibleModulesMenu = false;
    //   }
    // });
    // let data = {}
    // this.dataService.openReportWindow(data);
    op.toggle(event);
  }

  logout() {
    // Only attempt social sign out if user is logged in through social auth
    this.authService.authState.pipe(
      take(1)
    ).subscribe({
      next: (socialUser) => {
        if (socialUser) {
          this.authService.signOut().catch(err => console.warn('Social sign out error:', err));
        }
      },
      error: (err) => console.warn('Error checking social auth state:', err)
    });

    // Create a combined observable for both logout calls
    const logoutCalls$ = this.service.logout().pipe(
      switchMap(() => this.locationService.sessionEndApiCall())
    );

    this.subs.sink = logoutCalls$.subscribe({
      next: () => {
        this.toast.add({
          severity: "info",
          summary: "Info",
          detail: "Logged out successfully"
        });
        
        // Clear services cache
        this.service.clearCache();
        this.locationService.clearCache();
        
        // Clear storage after successful logout
        window.sessionStorage.clear();
        localStorage.clear();
        
        // Navigate to login page
        this.router.navigateByUrl("/login");
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error during logout. Please try again."
        });
        
        // Still clear storage and redirect on error
        window.sessionStorage.clear();
        localStorage.clear();
        this.router.navigateByUrl("/login");
      }
    });
  }

  getModuleList() {
    this.subs.sink = this.locationService.getUniPerpModuleList().subscribe((data) => {
      this.moduleList = data.modules;
      this.selectedModuleId = 1;
    });
  }

  getReportOption() {
    this.reportOptionList = [];
    this.subs.sink = this.locationService.getReportOptionList().subscribe((data) => {
      let reportTypeData = data.reportOptions.filter((value: any) => value.reporttype === this.reportType);
      this.reportOptionList = [{ id: null, reportoption_name: "Select" }, ...reportTypeData];
    });
  }
  isCountryPopupOpen: any;
  openFlagModal(totalCountryList: any, event: any): void {
    this.isLondon = true;
    this.isCountryPopupOpen = event;
    totalCountryList.toggle(event);
  }

  openHomeCountryFlagModal(totalHomeCountryList: any, event: any): void {
    this.isLondon = true;
    this.isCountryPopupOpen = event;
    totalHomeCountryList.toggle(event);
  }

  selectCountryInHeader(countryData: any, totalCountryList: any) {
    if (countryData) {
      // Update the header flag and country data for the selected country (not home country)
      this.headerFlag = countryData.flag;
      this.selectedCountryId = countryData.id;
      
      // Update data service with selected country info
      this.dataService.changeCountryId(countryData.id.toString());
      this.dataService.changeCountryName(countryData.country);
      this.dataService.changeCountryFlag(countryData.flag);
      
      // Save to localStorage as selected country
      localStorage.setItem('selectedCountryId', countryData.id.toString());
      
      // Close the country list popup if it exists
      if (totalCountryList) {
        totalCountryList.toggle(false);
      }
      
      // Notify dashboard service about country change if it came from header
      if (totalCountryList) {
        this.dashboardService.updateSelectedCountry(countryData);
      }
      
      // Refresh module list with new selected country
      this.getModuleList();
    }
  }

  // getCountryList(): void {
  //   this.locationService.getCountry().subscribe((countryList) => {
  //     this.countryLists = countryList;
  //   });
  // }

  onChangeChooseMain(event: any) {
    this.isVisibleModulesMenu = event == 2;
  }

  onChangeModuleList(moduleId: number = 1) {
    let data = {
      moduleid: moduleId,
    };
    this.selectedModuleId = moduleId;
    this.locationService.getSubModuleByModule(data).subscribe((res) => {
      if (res.status == 404) {
      }
      this.subModuleList = res.submodules;
    });
  }

  onChangeSubModuleList(subModuleId: any = 1) {
    let data = {
      moduleId: this.selectedModuleId,
      countryId: this.selectedCountryId,
      submoduleId: subModuleId,
    };
    this.locationService.getModuleQuestionList(data).subscribe((res) => {
      if (res.status == 404) {
      }
      this.questionList = res.questions;
      this.questionList.map((x: any, i: number) => {
        x["index"] = i + 1;
      });
    });
  }
  enterpriseSubscriptionLink: any;
  onClickSubscribe() {
    this.visible = false;
    if (this.enterpriseSubscriptionLink != "") {
      window.open(this.enterpriseSubscriptionLink, "_target");
      return;
    }
    this.router.navigate(["/pages/subscriptions"]);
  }

  subScribedUserCount(): void {
    this.service.getNewUserTimeLeft().subscribe((res) => {
      this.currentUserSubscriptionPlan = res?.subscription_details?.subscription_plan;
      this.enterpriseSubscriptionLink = res.enterprise_subscription_link;
      let data = res.time_left;
      if (data.plan === "not_started") {
        this.visible = false;
      } else {
        this.getTimer(data.minutes, data.seconds, data.hours, data.days, data.months);
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

      this.min$ = minutesLeft < 10 && minutesLeft > 0 ? "0" + minutesLeft.toString() : minutesLeft.toString();
      this.sec$ = secondsLeft < 10 && secondsLeft > 0 ? "0" + secondsLeft.toString() : secondsLeft.toString();

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

      if (minutesLeft <= 0 && this.hrs$ <= 0 && this.day$ <= 0 && secondsLeft <= 0 && this.month$ <= 0) {
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
      this.timeLeftMins = minutesLeft < 10 && minutesLeft > 0 ? "0" + minutesLeft : minutesLeft.toString();
      this.timeLeftSecs = secondsLeft < 10 && secondsLeft > 0 ? "0" + secondsLeft : secondsLeft.toString();
      if (this.timeLeftMins == "00") {
        this.timeLeftMins = 0;
      }
      if (this.timeLeftSecs == "00") {
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
      console.log(minutesLeft);
      if (minutesLeft <= 0 && this.timeHours <= 0 && secondsLeft <= 0) {
        this.visible = true;
        this.locationService.trialEnds().subscribe((res) => {
          console.log(res);
        });
        clearInterval(this.timerInterval);
      }
      this.min$ = minutesLeft;
      this.sec$ = secondsLeft;
      this.hrs$ = this.timeHours;
    }, 1000);
  }

  onSubmit(op: any) {
    let data;
    // if (
    //   this.reportSubmitForm.value.comment == null ||
    //   this.reportSubmitForm.value.comment == ""
    // ) {
    // this.toast.add({
    //   severity: "error",
    //   summary: "Error",
    //   detail: "Add comments to submit report",
    // });
    // return;
    // }

    if (this.reportSubmitForm.value.reportOption == null) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please Select Issue Type",
      });
      return;
    }
    data = {
      moduleId: this.moduleQuestionReport.moduleId ? this.moduleQuestionReport.moduleId : this.reportSubmitForm.value.moduleId,
      submoduleId: this.moduleQuestionReport.subModuleId ? this.moduleQuestionReport.subModuleId : this.reportSubmitForm.value.submoduleId,
      questionId: this.moduleQuestionReport.questionId ? this.moduleQuestionReport.questionId : this.reportSubmitForm.value.questionId,
      reportOption: this.reportSubmitForm.value.reportOption,
      comment: this.reportSubmitForm.value.comment,
      countryId: this.selectedCountryId,
      type_of_report: this.reportType == 4 || this.reportType == 5 || this.reportType == 6 || this.reportType == 7 ? this.reportType : this.reportlearnlanguagetype == 8 ? this.reportlearnlanguagetype : undefined,
    };
    if (data.moduleId == 8) {
      data.countryId = 0;
    }
    if (data.moduleId == 23 || data.moduleId == 24 || data.moduleId == 25 || data.moduleId == 27 || data.moduleId == 27) {
      data.countryId = this.moduleQuestionReport.countryId;
    }

    let maildata = {
      reportOption: this.reportSubmitForm.value.reportOption,
      comment: this.reportSubmitForm.value.comment,
    };
    this.reportSubmitForm.patchValue({ comment: null });

    this.locationService.reportFaqQuestion(data).subscribe((res) => {
      if (res.status == 404) {
      }
      this.dataService.showFeedBackPopup(true);
      // this.showReportSuccess = true;
      setTimeout(() => {
        this.dataService.showFeedBackPopup(false);
        op.hide();
        // this.showReportSuccess = false;
      }, 3000);
      this.locationService.reportFaqQuestionaftersubmit(maildata).subscribe((res) => {});
    });
    this.getReportOption();
  }

  changePassword() {
    this.submitted = true;
  }

  get f() {
    return this.setPasswordForm.controls;
  }

  continueTrial(): void {
    let data: any = {};
    if (this.mobileForm.valid) {
      data.phone = this.mobileForm.value.phone.number;
      data.home_country = this.mobileForm.value.home_country;
      data.country_code = this.mobileForm.value.phone.dialCode;
      data.study_level = this.mobileForm.value.study_level;
    }
    if (this.demoTrial == true) {
      data.demo_user = 1;
    }
    this.dashboardService.getContineTrial(data).subscribe(
      (res) => {
        if (this.demoTrial == true) {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: "Demo Trail Started",
          });
        }

        this.service.contineStatus(false);
        this.dataService.sendValue(false);
        this.freeTrial = false;
        this.demoTrial = false;
        this.service._userContineTrial = false;
        setTimeout(() => {
          this.checkNewUser();
          window.location.reload();
        }, 2000);
        return res;
      },
      (error) => {
        if (this.demoTrial == true) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Demo Trail Not Started",
          });
        }
        this.freeTrialErrorMsg = error?.message;
      }
    );
  }
  onClickSubscribedUser(): void {
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.visibleExhastedUser = false;
      let data: any = {};
      if (this.mobileForm.valid) {
        data.phone = this.mobileForm.value.phone.number;
        data.home_country = this.mobileForm.value.home_country;
        data.country_code = this.mobileForm.value.phone.dialCode;
      }
      if (this.demoTrial == true) {
        data.demo_user = 1;
      }
      this.dashboardService.getContineTrial(data).subscribe(
        (res) => {
          if (this.demoTrial == true) {
            this.toast.add({
              severity: "success",
              summary: "Success",
              detail: "Demo Trail Started",
            });
          }
          this.freeTrial = false;
          this.demoTrial = false;
          this.visibleExhasted = false;
          this.service._userContineTrial = false;
          this.service.contineStatus(false);
          this.dataService.sendValue(false);
          setTimeout(() => {
            this.checkNewUser();
            this.dashboardService.isinitialstart = true;
            if (this.enterpriseSubscriptionLink != "") {
              window.open(this.enterpriseSubscriptionLink, "_target");
              return;
            }
            this.router.navigate(["/pages/subscriptions"]);
          }, 1000);
        },
        (error) => {
          if (this.demoTrial == true) {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: "Demo Trail Not Started",
            });
          }
          this.freeTrialErrorMsg = error?.message;
        }
      );
    } else {
      this.visibleExhastedUser = true;
      this.demoTrial = false;
    }
  }

  checkNewUSerLogin(): void {
    let userLoginCount = this.service._userLoginCount;
    if (userLoginCount === 4) {
      this.freeTrial = true;
    }
  }

  passwordChangeOnClick() {
    if (this.setPasswordForm.value.password !== this.setPasswordForm.value.confirmPassword) {
      this.toast.add({
        severity: "info",
        summary: "Alert",
        detail: "Password does not match",
      });
      return;
    }

    this.locationService.updatePassword(this.setPasswordForm.value.confirmPassword).subscribe((res) => {
      if (res.status == 404) {
      }
      this.isChangePasswordWindowVisible = false;
      window.sessionStorage.clear();
      localStorage.clear();
      this.router.navigateByUrl("/login");
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "Password Updated Successfully.",
      });
    });
  }

  changeLocation(event: any) {
    this.GetLocationList();
  }

  GetLocationList() {
    this.locationList = [{ id: 0, district: "Others" }];
    this.mobileForm?.get("location_id")?.setValue(0);
    if (this.mobileForm.get("home_country")?.value == 122) {
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
      this.locationList = [{ id: 0, district: "Others" }];
      this.mobileForm?.get("location_id")?.setValue(0);
    }
  }

  getHomeCountryList() {
    this.subs.sink = this.locationService.getHomeCountry(2).subscribe({
      next: (res: any) => {
        this.countryList = res;
        // Find selected home country or default to India
        const selectedHomeCountry = res.find((data: any) => data.id === this.homeCountryId) || 
                                  res.find((data: any) => data.id === 122);
        
        if (selectedHomeCountry) {
          this.headerHomeFlag = selectedHomeCountry.flag;
          this.selectedHomeCountry = selectedHomeCountry;
          this.homeCountryName = selectedHomeCountry.country;
          this.dataService.changeHomeCountryFlag(selectedHomeCountry.flag);
          
          // Save to localStorage as home country
          localStorage.setItem('homeCountryId', selectedHomeCountry.id.toString());
        } else {
          console.warn('No valid home country found in response');
          // Set default values for home country
          this.headerHomeFlag = '../../../uniprep-assets/icons/india.png';
          this.homeCountryName = 'India';
          this.selectedHomeCountry = { id: 122, country: 'India', flag: this.headerHomeFlag };
          this.dataService.changeHomeCountryFlag(this.headerHomeFlag);
          localStorage.setItem('homeCountryId', '122');
        }
      },
      error: (error) => {
        console.error('Error fetching home country data:', error);
        // Set default values for home country on error
        this.headerHomeFlag = '../../../uniprep-assets/icons/india.png';
        this.homeCountryName = 'India';
        this.selectedHomeCountry = { id: 122, country: 'India', flag: this.headerHomeFlag };
        this.dataService.changeHomeCountryFlag(this.headerHomeFlag);
        localStorage.setItem('homeCountryId', '122');
      }
    });
  }

  onHomeCountryChange(event: any) {
    if (event && event.value) {
      const selectedCountry = this.countryList.find((country: any) => country.id === event.value.id);
      if (selectedCountry) {
        this.homeCountryId = selectedCountry.id;
        this.headerHomeFlag = selectedCountry.flag;
        this.homeCountryName = selectedCountry.country;
        this.selectedHomeCountry = selectedCountry;
        this.dataService.changeHomeCountryFlag(selectedCountry.flag);
        
        // Save to localStorage
        localStorage.setItem('homeCountryId', selectedCountry.id.toString());
      }
    }
  }
  closeQuiz(): void {
    this.visibleExhastedUser = false;
    this.demoTrial = true;
  }

  protected readonly count = count;

  navigateILearnChallenge() {
    // const targetUrl = this.currentUserSubscriptionPlan === 'Career' || this.currentUserSubscriptionPlan === 'Entrepreneur'
    //   ? item.url: this.authService?.user?.subscription ? '/pages/subscriptions/upgrade-subscription' : '/pages/subscriptions';
    // this.router.navigateByUrl(targetUrl);
    if (this.currentUserSubscriptionPlan === "Career" || this.currentUserSubscriptionPlan === "Entrepreneur") {
      switch (this.service?._user?.ilearn_popup_status) {
        case 0:
        case 1:
          if (this.router.url !== "/pages/assessment/ilearn-challenge") {
            this.assessmentService.getAssessmentParticipatingCount().subscribe({
              next: (res) => {
                this.assParticipations = res.cluster_count;
                this.isILeanrParticipantsVisible = true;
              },
            });
          }
          break;
        case 2:
          if (this.router.url !== "/pages/assessment/ilearn-challenge") {
            this.isILearnLiveVisible = true;
          }
          break;
        case 3:
          this.isILearnCompletedVisible = true;
          break;
        default:
          console.log(this.service?._user?.ilearn_popup_status);
      }
      return;
    }
    this.isUpgradePlanVisible = true;
  }

  onSubscribe() {
    this.isUpgradePlanVisible = false;
    const targetUrl = this.service?.user?.subscription ? "/pages/subscriptions/upgrade-subscription" : "/pages/subscriptions";
    this.router.navigateByUrl(targetUrl);
  }

  onClickiLearnChallenge() {
    this.isILearnLiveVisible = false;
    this.isILearnCompletedVisible = false;
    this.router.navigateByUrl("/pages/assessment/ilearn-challenge");
  }
}
