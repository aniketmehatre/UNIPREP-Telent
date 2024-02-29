import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { matchValidator } from "src/app/@Supports/matchvalidator";
import { LocationService } from "src/app/location.service";
import { AuthService } from "../auth.service";
import { MessageService } from "primeng/api";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
// import { FacebookService } from "ngx-facebook";
import { environment } from "@env/environment";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { LocalStorageService } from "ngx-localstorage";
import { SubSink } from "subsink";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  @ViewChild("otp1") otp1!: ElementRef;
  @ViewChild("otp2") otp2!: ElementRef;
  @ViewChild("otp3") otp3!: ElementRef;
  @ViewChild("otp4") otp4!: ElementRef;

  @ViewChild("otp5") otp5!: ElementRef;
  @ViewChild("otp6") otp6!: ElementRef;
  @ViewChild("otp7") otp7!: ElementRef;
  @ViewChild("otp8") otp8!: ElementRef;
  public registrationForm: any = FormGroup;
  genderList: any;
  intakeYearLooking: any;
  displayTerms = "none";
  locationList: any;
  countryList: any;
  programLevelList: any;
  intrestedCountryList: any;
  countryCodes: any;

  public otpForm: any = FormGroup;
  public emailOTPForm: any = FormGroup;

  isMobileOTPSend: boolean = false;
  isMobileOTPValidated: boolean = false;
  isEmailOTPSend: boolean = false;
  isEmailOTPValidated: boolean = false;
  isRemainingFieldVisible: boolean = false;
  password: any;
  show = false;
  showConfirm = false;
  confirmPassword: any;

  // resent timer
  resendTime = 1;
  startTimer = 0;
  interval: any;
  showContactErrorIcon: boolean = false;
  showEmailErrorIcon: boolean = false;
  validNumberRequired: boolean = false;
  registerFormInvalid: boolean = true;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  isMobileOTPEdit: boolean = false;

  showHidePassword() {
    if (this.password === "password") {
      this.password = "text";
      this.show = true;
    } else {
      this.password = "password";
      this.show = false;
    }
  }

  showHideConfirmPassword() {
    if (this.confirmPassword === "password") {
      this.confirmPassword = "text";
      this.showConfirm = true;
    } else {
      this.confirmPassword = "password";
      this.showConfirm = false;
    }
  }

  homeCountryList: any = [
    {
      id: 15,
      country: "India",
      flag: "https://uniprep.ai/uniprepapi/storage/app/public/country-flags/1689510580Horse8b (2).svg",
    },
  ];

  constructor(
    private service: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private toastr: MessageService,
    // private fb: FacebookService,
    private authService: SocialAuthService,
    private storage: LocalStorageService
  ) {}

  dateTime = new Date();
  private subs = new SubSink();
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.service.googlesignUp(user).subscribe(
        (data) => {
          if (data.token) {
            this.storage.set(environment.tokenKey, data.token);
          } else {
            this.storage.set(environment.tokenKey, data?.authorisation?.token);
          }
          setTimeout(() => {
            this.service.getMe().subscribe((data) => {
              this.router.navigate(["/pages/dashboard"]);
            });
          }, 2000);
        },
        (error: any) => {
          this.toastr.add({
            severity: "error",
              summary: "Error",
            detail: error,
          });
        }
      );
    });
    //var socialUser = user;
    //this.loggedIn = (user != null);

    // this.isMobileOTPSend = false;
    // this.isMobileOTPValidated = false;
    // this.isEmailOTPSend = false;
    // this.isEmailOTPValidated = false;
    // this.isRemainingFieldVisible = false;

    this.dateTime.setDate(this.dateTime.getDate());

    this.password = "password";
    this.registrationForm = this.formBuilder.group({
      fullName: ["", [Validators.required]],
      // location: ["", [Validators.required]],
      contactNumber: ["", [Validators.required]],
      emailAddress: ["", [Validators.required, Validators.email]],
      // country_code: ['+91', [Validators.required]],
      // interestedCountry: [null, [Validators.required]],

      // lastDegreePassingYear: ["", [Validators.required]],
      // intakeYear: ["", [Validators.required]],
      // intakeMonth: ["", [Validators.required]],
      // programLevel: ["", [Validators.required]],
      // gender: [""],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          matchValidator("confirmPassword", true),
        ],
      ],
      confirmPassword: ["", [Validators.required, matchValidator("password")]],
      // terms: [false, [Validators.required]],

      country: [122, [Validators.required]],
    });

    this.otpForm = this.formBuilder.group({
      otp1: ["", [Validators.required]],
      otp2: ["", [Validators.required]],
      otp3: ["", [Validators.required]],
      otp4: ["", [Validators.required]],
    });
    this.emailOTPForm = this.formBuilder.group({
      otp5: ["", [Validators.required]],
      otp6: ["", [Validators.required]],
      otp7: ["", [Validators.required]],
      otp8: ["", [Validators.required]],
    });

    this.GetLocationList();
    this.gethomeCountryList();
    this.getProgramLevelList();
    this.getIntrestedCountryList();
    this.genderList = [
      { label: "M", value: "Male" },
      { label: "F", value: "Female" },
    ];
    this.intakeYearLooking = [
      { label: "2023", value: "2023" },
      { label: "2024", value: "2024" },
      { label: "2025", value: "2025" },
      { label: "2026", value: "2026" },
      { label: "2027", value: "2027" },
    ];
  }

  yearChage(event: any) {
    this.registrationForm?.get("intakeMonth")?.setValue(event);
  }

  GetLocationList() {
    if (this.registrationForm.get("country").value == 122) {
      this.locationService.getLocation().subscribe(
        (res: any) => {
          this.locationList = res;
        },
        (error: any) => {
          this.toastr.add({
            severity: "warning",
            summary: "Warning",
            detail: error.error.message,
          });
        }
      );
    } else {
      this.locationList = [{ id: 0, district: "Others" }];
      this.registrationForm.get("location").setValue(0);
    }
  }

  gethomeCountryList() {
    this.locationService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.countryList = res;
      },
      (error: any) => {
        this.toastr.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }
  getIntrestedCountryList() {
    this.locationService.getCountry().subscribe(
      (res: any) => {
        this.intrestedCountryList = res;
      },
      (error: any) => {
        this.toastr.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }

  getProgramLevelList() {
    this.locationService.getProgramLevel().subscribe(
      (res: any) => {
        this.programLevelList = res;
      },
      (error: any) => {
        this.toastr.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }

  submitted = false;

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // if (this.registrationForm.value.terms == false) {
    //     this.toastr.add({
    //         severity: 'error',
    //         summary: 'Alert!!!',
    //         detail: "Please agree Terms and Condition before Signup"
    //     });
    //     return;
    // }
    // if (this.registrationForm.invalid) {
    //   this.toastr.add({
    //     severity: "error",
    //     summary: "Alert!!!",
    //     detail: "Fill all the information",
    //   });
    //   return;
    // }
    var data = {
      name: this.registrationForm.value.fullName,
      // location_id: this.registrationForm.value.location,
      phone: this.registrationForm.value.contactNumber.number,
      email: this.registrationForm.value.emailAddress,
      // interested_country_id: this.registrationForm.value.interestedCountry,
      // last_degree_passing_year: this.registrationForm.value.lastDegreePassingYear.getFullYear(),
      // intake_year_looking: this.registrationForm.value.intakeYear.getFullYear(),
      // intake_month_looking: this.registrationForm.value.intakeMonth.getMonth() + 1,
      // programlevel_id: this.registrationForm.value.programLevel.id,
      // gender: this.registrationForm.value.gender.label,
      password: this.registrationForm.value.password,
      password_confirmation: this.registrationForm.value.password,
      platform_id: 1,
      usertype_id: 1,
      // country_id: this.registrationForm.value.country,
      country_code: this.registrationForm.value.contactNumber.dialCode,
    };

    this.service.Registraion(data).subscribe(
      (_) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "User Registered",
        });
        this.service.getMe().subscribe((data) => {
          if (data.token) {
            this.storage.set(environment.tokenKey, data.token);
          } else {
            this.storage.set(environment.tokenKey, data?.authorisation?.token);
          }
          this.router.navigate(["/pages/dashboard"]);
        });
      },
      (error) => {
        const message = error.error.message;
        this.toastr.add({
          severity: "error",
          summary: "Failed",
          detail: error.error.message,
        });
      }
    );
  }

  openTermsPopup() {
    this.displayTerms = "block";
  }

  closeTermsPopup() {
    this.displayTerms = "none";
  }

  sendMobileOTP() {
    // if (this.otpForm.invalid) {
    //   return;
    // }
    let val = {
      phone: this.registrationForm.value.contactNumber.number,
      country_code: this.registrationForm.value.contactNumber.dialCode,
    };
    if (
      this.registrationForm.value.fullName != null &&
      this.registrationForm.value.contactNumber.number
    ) {
      this.service.getSmsOTP(val).subscribe(
        (res: any) => {
          this.resendTime++;
          this.startTimer = 60;
          if (this.resendTime >= 3) {
            this.startTimer = 30;
          }
          this.processTimer();
          this.isMobileOTPSend = true;
          this.isMobileOTPEdit = true;
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: "OTP Generated and Sent to " + val.phone,
          });
        },
        (error: any) => {
          this.isMobileOTPSend = false;
        }
      );
    } else {
      this.toastr.add({
        severity: "info",
        summary: "Info",
        detail: "Enter Above Filed",
      });
    }
  }

  onValidateMobileOTP() {
    if (this.otpForm.invalid) {
      return;
    }
    let _otp =
      this.otpForm.value.otp1 +
      this.otpForm.value.otp2 +
      this.otpForm.value.otp3 +
      this.otpForm.value.otp4;
    if (!this.isMobileOTPValidated) {
      let val = {
        phone: this.registrationForm.value.contactNumber.number,
        country_code: this.registrationForm.value.contactNumber.dialCode,
        otp: _otp,
      };
      this.service.verifySmsOTP(val).subscribe(
        (res: any) => {
          this.isMobileOTPValidated = true;
          this.otpForm.reset();
          this.toastr.add({
            severity: "success",
            summary: "Success",
            detail: "OTP Verified Successfully",
          });
        },
        (error: any) => {
          this.isMobileOTPValidated = false;
        }
      );
    }
  }

  numericOnly(event: any): boolean {
    let pattern = /^([0-9])$/;
    return pattern.test(event.key);
  }

  sendEmailOTP() {
    let data = {
      name: this.registrationForm.value.fullName,
      email: this.registrationForm.value.emailAddress,
    };

    this.service.sendEmailOTP(data).subscribe(
      (res: any) => {
        this.isEmailOTPSend = true;
        this.registrationForm.controls["emailAddress"].readonly = true;
      },
      (error) => {
        this.isEmailOTPSend = false;
        // const message = error.error.message;
        this.toastr.add({
          severity: "error",
          summary: "Failed",
          detail: error.message,
        });
      }
    );
  }

  onValidateEmailOTP() {
    // this.isRemainingFieldVisible = true;
    // this.isEmailOTPValidated = true;
    //
    // return;
    if (this.emailOTPForm.invalid) {
      this.toastr.add({
        severity: "error",
        summary: "Alert!!!",
        detail: "Enter Valid OTP",
      });
      return;
    }

    const otp =
      this.emailOTPForm.value.otp5 +
      this.emailOTPForm.value.otp6 +
      this.emailOTPForm.value.otp7 +
      this.emailOTPForm.value.otp8;
    var data = {
      otp: otp,
      email: this.registrationForm.value.emailAddress,
    };
    // this.isRemainingFieldVisible = true;
    this.service.validateEmailOTP(data).subscribe(
      (res) => {
        this.isRemainingFieldVisible = true;
        this.isEmailOTPValidated = true;
      },
      (error) => {
        this.isEmailOTPValidated = false;
        this.isRemainingFieldVisible = false;
        const message = error.error.message;
        this.toastr.add({
          severity: "error",
          summary: "Failed",
          detail: "Invalid OTP",
        });
      }
    );
    // this.isMobileOTPValidated = true;
    // this.isEmailOTPSend = true;
  }

  focusNextInput(event: any, num: number) {
    const code = (event.code || "").toLowerCase();

    if (code.includes("backspace")) {
      switch (num) {
        case 2:
          this.otp1.nativeElement.focus();
          break;
        case 3:
          this.otp2.nativeElement.focus();
          break;
        case 4:
          this.otp3.nativeElement.focus();
          break;
      }
    } else if (code.includes("digit")) {
      switch (num) {
        case 1:
          this.otp2.nativeElement.focus();
          break;
        case 2:
          this.otp3.nativeElement.focus();
          break;
        case 3:
          this.otp4.nativeElement.focus();
          break;
      }
    }
  }

  focusNextEmailInput(event: KeyboardEvent, num: number) {
    const key = event.key.toLowerCase();
  
    if (key === "backspace") {
      switch (num) {
        case 6:
          this.otp5.nativeElement.focus();
          break;
        case 7:
          this.otp6.nativeElement.focus();
          break;
        case 8:
          this.otp7.nativeElement.focus();
          break;
      }
      // Prevent the default backspace behavior
      event.preventDefault();
    } else if (/^\d$/.test(key)) {
      switch (num) {
        case 5:
          this.otp6.nativeElement.focus();
          break;
        case 6:
          this.otp7.nativeElement.focus();
          break;
        case 7:
          this.otp8.nativeElement.focus();
          break;
      }
    }
  }
  

  processTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.interval = setInterval(() => {
      this.startTimer -= 1;

      if (this.startTimer <= 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  editMobileNumberAgain() {
    this.isMobileOTPSend = false;
  }

  editEmailAgain() {
    this.isEmailOTPSend = false;
  }

  onChangeContact(event: any) {
    this.showContactErrorIcon = false;
    if (event?.target?.value?.length != 0) {
      this.showContactErrorIcon = true;
      this.registerFormInvalid = true;
    } else {
      this.validNumberRequired = false;
      this.registerFormInvalid = false;
    }
  }

  onChangeEmail(event: any) {
    this.showEmailErrorIcon = false;
    if (this.registrationForm.controls["emailAddress"].valid) {
      this.showEmailErrorIcon = true;
    }
  }

  changeLocation(event: any) {
    this.GetLocationList();
  }
  changeCountryCode(event: any) {
    let changeHomeCountry = this.countryList.find(
      (data: any) => data.country_code == event.value
    );
    this.registrationForm.get("country").setValue(changeHomeCountry.id);
    this.GetLocationList();
  }

  loginWithFacebook() {
    // this.fb.login().then(response => {
    //     console.log('Facebook login response:', response);
    // }).catch(error => {
    //     console.error('Facebook login error:', error);
    // });
  }
}
