import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { ModalService } from "src/app/components/modal/modal.service";
import { AuthService } from "../../../Auth/auth.service";
import { SubSink } from "subsink";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "../../../location.service";
import { DataService } from "src/app/data.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { matchValidator } from "../../../@Supports/matchvalidator";
import { ThemeService } from "../../../theme.service";
import { DashboardService } from "src/app/pages/dashboard/dashboard.service";
import { Observable, count } from "rxjs";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { SocialAuthService } from "@abacritt/angularx-social-login";
// import { SocialAuthService } from "@abacritt/angularx-social-login";

@Component({
  selector: "uni-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("op") op!: ElementRef<HTMLInputElement>;
  public reportSubmitForm: any = FormGroup;
  @Input() breadcrumb: MenuItem[] = [
    { label: "Categories" },
    { label: "Sports" },
  ];
  @Input() expandicon = "";
  @Output() togleSidebar = new EventEmitter();
  private subs = new SubSink();
  userName: any;
  firstChar: any;
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
  preferredCountries: CountryISO[] = [CountryISO.India];
  timeLeftInfo: any;
  freeTrialErrorMsg: string = '';
  demoTrial: boolean = false;
  reportlearnlanguagetype:number=0;
  countryList: any;
  locationList: any;

  constructor(
    private router: Router,
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private service: AuthService,
    private toast: MessageService,
    private themeService: ThemeService,
    route: ActivatedRoute, private authService: SocialAuthService,
    private dataService: DataService,
    private dashboardService: DashboardService // private authService: SocialAuthService
  ) {
    this.subs.sink = this.dataService.countryId.subscribe((data) => {
      this.selectedCountryId = Number(data);
      this.getModuleList();
    });
    this.dataService.castValue.subscribe((data) => {
      console.log("newuser", data)
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
      localStorage.setItem('time_card_info', data.card_message);

    });
    this.timeLeftInfo = localStorage.getItem('time_card_info');
  }

  loadCountryList() {
    this.dashboardService.countryList().subscribe((countryList) => {
      this.countryLists = countryList;
      this.countryLists.forEach((element: any) => {
        if (element.id == Number(localStorage.getItem("countryId"))) {
          this.dataService.changeCountryName(element.country);
          this.dataService.changeCountryFlag(element.flag);
          this.dataService.changeCountryId(element.id);
        }
      });
    });
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

  exploreNow() {
    this.dataService.showTimerInHeader(null);
  }
  openchat() {
    this.router.navigate(["/pages/chat"]);
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
  formvisbility = false;
  mobileForm: any = FormGroup;
  preferredCountry: any
  ngOnInit() {
    fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
      this.preferredCountry = data.country_code.toLocaleLowerCase()
    });
    this.dataService.countryId.subscribe((data: any) => {
      if (!data) {
        let cntId = localStorage.getItem('countryId');
        this.dataService.changeCountryId(cntId!.toString());
      }
    })
    this.dataService.countryNameSource.subscribe((data: any) => {
    })
    this.dataService.countryFlagSource.subscribe((data: any) => {
    })
    this.dashboardService.data$.subscribe((data) => {
      this.min$ = data?.minutes;
      this.sec$ = data?.seconds;
      this.hrs$ = data?.hours;
      this.day$ = data?.days;
      this.month$ = data?.months;
    });
    this.mobileForm = this.formBuilder.group({
      phone: ["", Validators.required],
      home_country: ["", Validators.required]
    });
    if (
      localStorage.getItem("phone") == "" ||
      localStorage.getItem("phone") == null ||
      localStorage.getItem("phone") == "null"
    ) {
      this.formvisbility = true;
    }
    // this.getModuleList();
    // this.getCountryList();
    // this.onChangeModuleList(1);
    // this.onChangeSubModuleList(1);
    if (this.service._checkExistsSubscription === 0) {
      this.checkNewUser();
    } else {
      this.subScribedUserCount();
      this.userLoginTimeLeftCount = true;
      this.subs.sink = this.dataService.showTimeOutSource.subscribe((data) => {
        this.visible = data;
      });
      this.dashboardService.countryList().subscribe((countryList) => {
        this.countryLists = countryList;
        this.countryLists.forEach((element: any) => {
          if (element.id == this.selectedCountryId) {
            this.selectedCountryId = element.id;
            localStorage.setItem("countryId", element.id);
            this.dataService.changeCountryId(element.id);
            this.dataService.changeCountryFlag(element.flag)
            this.dataService.changeCountryName(element.country);
          }
        });
      });
    }
    this.genMod = [
      {
        name: "General",
        id: 1,
      },
    ];
    this.setPasswordForm = this.formBuilder.group({
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          matchValidator("confirmPassword", true),
        ],
      ],
      confirmPassword: ["", [Validators.required, matchValidator("password")]],
    });
    const storedIsMenuOpen = localStorage.getItem("isMenuOpen");
    if (storedIsMenuOpen) {
      this.isMenuOpen = JSON.parse(storedIsMenuOpen);
    }
    this.updateMenuClass();
    this.reportSubmitForm = this.formBuilder.group({
      general: [1, [Validators.required]],
      moduleId: ["", [Validators.required]],
      submoduleId: ["", [Validators.required]],
      questionId: ["", [Validators.required]],
      reportOption: [""],
      comment: ["", []],
    });
    // this.getReportOption();
    this.dataService.chatTriggerSource.subscribe((message) => {
      if (message === "open chat window") {
        this.openModal();
      }
    });

    // this.dashboardService.countryList().subscribe(countryList => {
    //   this.countryLists = countryList;
    //   this.countryLists.forEach((element: any) => {
    //     if (element.id == this.selectedCountryId) {
    //       // this.headerFlag = element.flag;
    //       localStorage.setItem('countryId', element.id);
    //       this.dataService.changeCountryId(element.id)
    //       this.dataService.changeCountryName(element.country);
    //       //this.dataService.changeCountryFlag(element.flag)
    //     }
    //   });
    // });
    // this.dataService.showTimeOutSourceData.subscribe((res) => {
    //   this.checkNewUser();
    //  this.subScribedUserCount();
    // });
    this.dataService.countryFlagSource.subscribe((data) => {
      if (data != "") {
        this.headerFlag = data;
      }
    });
    this.dataService.openReportWindowSource.subscribe((data) => {
      // if(data.from == 'module'){
      //   this.isQuestionVisible = false
      // }      
      if (data.isVisible) {
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
        //pass type_of_report  parameter for learning hub 
        if(data.reporttype==8){
          this.reportlearnlanguagetype = 8;
        }else{
          this.reportlearnlanguagetype = 0;
        }
        if (data.report_mode && data.report_mode == "other_module") {
          this.subs.sink = this.locationService.getModuleReportOptionLists(data).subscribe((response) => {
            
            this.reportOptionList = [
              { id: null, reportoption_name: "Select" },
              ...response.reportOptions,
            ];
            this.reportType = data.reporttype;
          })
        } else {
          this.getReportOption();
        }
        this.isVisibleModulesMenu = true;
        this.moduleNgModel = data.moduleId;
        this.subModuleNgModel = data.subModuleId;
        this.questionIdNgModel = data.questionId;
      } else {
        this.isQuestionVisible = false;
      }
    });

    this.subs.sink = this.service.getMe().subscribe((data) => {
      if (data) {
        console.log("userdetails", data)
        //localStorage.setItem('countryId', data.userdetails[0].interested_country_id);
        this.userName = data.userdetails[0].name.toString();
        this.firstChar = this.userName.charAt(0);
        if (data.userdetails[0].login_status == "Demo") {
          this.demoTrial = true;
        }
      }
    });

    // this.darkModeSwitch = document.getElementById("darkmodeswitch") as HTMLInputElement;
    // this.darkModeSwitch.checked = this.themeService.isDarkMode();
    //
    // this.darkModeSwitch.addEventListener("change", () => {
    //   this.themeService.toggleTheme();
    // });
    this.getCountryList();
    this.getHomeCountryList();
  }

  ngOnDestroy() {
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
    this.authService.signOut();
    this.subs.sink = this.service.logout().subscribe((data) => {
      this.toast.add({
        severity: "info",
        summary: "Info",
        detail: "logged out successfully",
      });
      window.sessionStorage.clear();
      localStorage.clear();
      this.router.navigateByUrl("/login");
    });
  }

  getModuleList() {
    this.subs.sink = this.locationService
      .getUniPerpModuleList()
      .subscribe((data) => {
        this.moduleList = data.modules;
        this.selectedModuleId = 1;
      });
  }

  getReportOption() {
    this.reportOptionList = [];
    this.subs.sink = this.locationService
      .getReportOptionList()
      .subscribe((data) => {
        let reportTypeData = data.reportOptions.filter(
          (value: any) => value.reporttype === this.reportType
        );
        this.reportOptionList = [
          { id: null, reportoption_name: "Select" },
          ...reportTypeData,
        ];   
      });
  }
  isCountryPopupOpen: any;
  openFlagModal(totalCountryList: any, event: any): void {
    this.isLondon = true;
    this.isCountryPopupOpen = event;
    totalCountryList.toggle(event);
    // this.dataService.countryIdSource
  }

  selectCountryInHeader(countryData: any, totalCountryList: any) {
    this.dataService.changeCountryId(countryData.id);
    this.dataService.changeCountryName(countryData.country);
    this.dataService.changeCountryFlag(countryData.flag);
    localStorage.setItem("countryId", countryData.id);
    totalCountryList.toggle(false);
  }

  getCountryList(): void {
    this.dashboardService.countryList().subscribe((countryList) => {
      this.countryLists = countryList;
    });
  }

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

  onClickSubscribe() {
    this.visible = false;
    this.router.navigate(["/pages/subscriptions"]);
  }

  subScribedUserCount(): void {
    this.service.getNewUserTimeLeft().subscribe((res) => {
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
        clearInterval(this.timerInterval);
      }
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
      moduleId: this.moduleQuestionReport.moduleId
        ? this.moduleQuestionReport.moduleId
        : this.reportSubmitForm.value.moduleId,
      submoduleId: this.moduleQuestionReport.subModuleId
        ? this.moduleQuestionReport.subModuleId
        : this.reportSubmitForm.value.submoduleId,
      questionId: this.moduleQuestionReport.questionId
        ? this.moduleQuestionReport.questionId
        : this.reportSubmitForm.value.questionId,
      reportOption: this.reportSubmitForm.value.reportOption,
      comment: this.reportSubmitForm.value.comment,
      countryId: this.selectedCountryId,
      type_of_report: (this.reportType == 4 || this.reportType == 5 || this.reportType == 6 || this.reportType == 7) ? this.reportType : this.reportlearnlanguagetype==8 ? this.reportlearnlanguagetype: undefined
    };
    if (data.moduleId == 8) {
      data.countryId = 0;
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
      this.locationService
        .reportFaqQuestionaftersubmit(maildata)
        .subscribe((res) => { });
    });
    this.getReportOption();
  }

  public setPasswordForm: any = FormGroup;
  isNotSuccess: boolean = true;
  submitted: boolean = false;

  changePassword() {
    this.isChangePasswordWindowVisible = true;
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
    }

    if (this.demoTrial == true) {
      data.demo_user = 1;
    }
    this.dashboardService.getContineTrial(data).subscribe((res) => {
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
      error => {
        if (this.demoTrial == true) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Demo Trail Not Started",
          });
        }
        this.freeTrialErrorMsg = error?.message;
      });

  }
  onClickSubscribedUser(): void {
    let data: any = {};
    if (this.mobileForm.valid) {
      data.phone = this.mobileForm.value.phone.number;
      data.home_country = this.mobileForm.value.home_country;
      data.country_code = this.mobileForm.value.phone.dialCode;
    }
    if (this.demoTrial == true) {
      data.demo_user = 1;
    }
    this.dashboardService.getContineTrial(data).subscribe((res) => {
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
        this.router.navigate(["/pages/subscriptions"]);
      }, 1000);
    },
      error => {
        if (this.demoTrial == true) {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Demo Trail Not Started",
          });
        }
        this.freeTrialErrorMsg = error?.message;
      });
  }

  checkNewUSerLogin(): void {
    let userLoginCount = this.service._userLoginCount;
    if (userLoginCount === 4) {
      this.freeTrial = true;
    }
  }

  passwordChangeOnClick() {
    if (
      this.setPasswordForm.value.password !==
      this.setPasswordForm.value.confirmPassword
    ) {
      this.toast.add({
        severity: "info",
        summary: "Alert",
        detail: "Password does not match",
      });
      return;
    }

    this.locationService
      .updatePassword(this.setPasswordForm.value.confirmPassword)
      .subscribe((res) => {
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
    this.GetLocationList()
  }

  GetLocationList() {
    this.locationList = [{ id: 0, district: 'Others' }];
    this.mobileForm?.get('location_id')?.setValue(0);
    if (this.mobileForm.get('home_country')?.value == 122) {
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
    }
    else {
      this.locationList = [{ id: 0, district: 'Others' }];
      this.mobileForm?.get('location_id')?.setValue(0);
    }
  }

  getHomeCountryList() {
    this.locationService.getHomeCountry(2).subscribe(
        (res: any) => {
          this.countryList = res;
        },
        (error: any) => {
        }
    );
  }
}