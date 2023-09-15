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
import { CountdownConfig } from "ngx-countdown";
import { ModalService } from "src/app/components/modal/modal.service";
import { AuthService } from "../../../Auth/auth.service";
import { SubSink } from "subsink";
import { Router } from "@angular/router";
import { LocationService } from "../../../location.service";
import { DataService } from "src/app/data.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { matchValidator } from "../../../@Supports/matchvalidator";

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
  reportOptionNgModel: number = 1;
  selectedCountryId: any;
  selectedModuleId: any;
  selectedSubModuleId: any;
  moduleList: any[] = [];
  subModuleList: any[] = [];
  questionList: any;
  reportOptionList: any[] = [];
  darkModeSwitch!: HTMLInputElement;
  visible: boolean = false;
  showReportSuccess: boolean = false;
  isShowFreeTrailStart: boolean = false;
  isChangePasswordWindowVisible: boolean = false;
  day: number = 0;
  hrs: number = 0;
  min: number = 0;
  sec: number = 0;
  isVisibleModulesMenu: boolean = false;
  isChatWindowVisible: boolean = false;
  messages: any = [];
  show = false;
  password: string = "password";
  show1 = false;
  password1: string = "password";
  constructor(
    private modalService: ModalService,
    private router: Router,
    private locationService: LocationService,
    private viewContainerRef: ViewContainerRef,
    private formBuilder: FormBuilder,
    private service: AuthService,
    private toast: MessageService,
    private dataService: DataService
  ) {
    this.subs.sink = this.dataService.countryIdSource.subscribe((data) => {
      this.selectedCountryId = Number(data);
      this.getModuleList();
    });
    this.subs.sink = this.dataService.showTimeOutSource.subscribe((data) => {
      this.visible = data;
    });
    this.subs.sink = this.dataService.showTimerSource.subscribe((data) => {
      if (data == "EXPIRED") {
        this.visible = true;
        this.day = 0;
        this.hrs = 0;
        this.min = 0;
        this.sec = 0;
        return;
      }
      if (data) {
        data = data.split("-", 4);
        this.day = data[0];
        this.hrs = data[1];
        this.min = data[2];
        this.sec = data[3];
      }
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

  ngOnInit() {
    this.getModuleList();
    this.onChangeModuleList(1);
    this.onChangeSubModuleList(1);
    this.genMod = [
      {
        name: "General",
        id: 1,
      },
      {
        name: "Modules",
        id: 2,
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
      reportOption: ["", [Validators.required]],
      comment: ["", []],
    });
    this.getReportOption();
    this.dataService.chatTriggerSource.subscribe((message) => {
      if (message === "open chat window") {
        this.openModal();
      }
    });
    this.dataService.openReportWindowSource.subscribe((data) => {
      if (data.isVisible) {
        this.moduleList = [];
        this.subModuleList = [];
        this.questionList = [];
        this.getModuleList();
        this.onChangeModuleList(data.moduleId);
        this.onChangeSubModuleList(data.subModuleId);
        this.selectedGenMod = 2;
        this.isVisibleModulesMenu = true;
        this.moduleNgModel = data.moduleId;
        this.subModuleNgModel = data.subModuleId;
        this.questionIdNgModel = data.questionId;
        this.openReportModal(this.op, event);
      }
    });

    this.subs.sink = this.service.getMe().subscribe((data) => {
      if (data) {
        this.userName = data.userdetails[0].name.toString();
        this.firstChar = this.userName.charAt(0);
      }
    });

    this.darkModeSwitch = document.getElementById(
      "darkmodeswitch"
    ) as HTMLInputElement;

    // Read the theme and checked state from the cookie and apply them to the body class and the switch
    const theme = this.getCookie("theme");
    if (theme === "dark") {
      document.body.classList.add("darkmode");
      this.darkModeSwitch.checked = true;
    } else {
      document.body.classList.add("lightmode");
      this.darkModeSwitch.checked = false;
    }

    const checked = this.getCookie("checked");
    if (checked === "true") {
      this.darkModeSwitch.checked = true;
    } else if (checked === "false") {
      this.darkModeSwitch.checked = false;
    }

    // Add event listener to toggle the theme and save it in a cookie
    this.darkModeSwitch.addEventListener("change", () => {
      if (this.darkModeSwitch.checked) {
        document.body.classList.remove("lightmode");
        document.body.classList.add("darkmode");
        this.setCookie("theme", "dark");
        this.setCookie("checked", "true");
      } else {
        document.body.classList.remove("darkmode");
        document.body.classList.add("lightmode");
        this.setCookie("theme", "light");
        this.setCookie("checked", "false");
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  openModal() {
    this.isChatWindowVisible = true;
  }

  openReportModal(op: any, event: any) {
    op.toggle(event);
  }

  logout() {
    this.subs.sink = this.service.logout().subscribe((data) => {
      this.toast.add({
        severity: "success",
        summary: "Success",
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
    this.subs.sink = this.locationService
      .getReportOptionList()
      .subscribe((data) => {
        this.reportOptionList = data.reportOptions;
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

  private setCookie(name: string, value: string, days: number = 365) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string) {
    const cookieValue = document.cookie.match(
      `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
    );
    return cookieValue ? cookieValue.pop() : "";
  }

  onClickSubscribe() {
    this.router.navigate(["/pages/subscriptions"]);
  }

  onSubmit() {
    let data;
    if (this.reportSubmitForm.value.general == 1) {
      data = {
        reportOption: this.reportSubmitForm.value.reportOption,
        comment: this.reportSubmitForm.value.comment,
      };
    } else {
      data = {
        moduleId: this.reportSubmitForm.value.moduleId,
        submoduleId: this.reportSubmitForm.value.submoduleId,
        questionId: this.reportSubmitForm.value.questionId,
        reportOption: this.reportSubmitForm.value.reportOption,
        comment: this.reportSubmitForm.value.comment,
      };
    }

    this.locationService.reportFaqQuestion(data).subscribe((res) => {
      if (res.status == 404) {
      }
      this.showReportSuccess = true;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "FAQ Report submitted successfully",
      });
    });
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
}
