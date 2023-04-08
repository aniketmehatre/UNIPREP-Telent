import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {matchValidator} from "src/app/@Supports/matchvalidator";
import {LocationService} from "src/app/location.service";
import {AuthService} from "../auth.service";
import {MessageService} from "primeng/api";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {

  @ViewChild('otp1') otp1!: ElementRef;
  @ViewChild('otp2') otp2!: ElementRef;
  @ViewChild('otp3') otp3!: ElementRef;
  @ViewChild('otp4') otp4!: ElementRef;


  @ViewChild('otp5') otp5!: ElementRef;
  @ViewChild('otp6') otp6!: ElementRef;
  @ViewChild('otp7') otp7!: ElementRef;
  @ViewChild('otp8') otp8!: ElementRef;
  public registrationForm: any = FormGroup;
  intakeMonthLooking: any;
  genderList: any;
  intakeYearLooking: any;
  displayTerms = "none";
  selectedLocation: number | undefined;
  TermsContent: any;
  locationList: any;
  programLevelList: any;

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
  showHidePassword(){
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  showHideConfirmPassword(){
    if (this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.showConfirm = true;
    } else {
      this.confirmPassword = 'password';
      this.showConfirm = false;
    }
  }

  constructor(private service: AuthService, private router: Router, private formBuilder: FormBuilder,
    private locationService: LocationService, private toastr: MessageService) { }

  ngOnInit() {
    this.password = 'password';
    this.registrationForm = this.formBuilder.group({
      fullName: ["", [Validators.required]],
      location: ["", [Validators.required]],
      contactNumber: ["", [Validators.required]],
      emailAddress: ["", [Validators.required, Validators.email]],
      interestedCountry: ["", [Validators.required]],
      lastDegreePassingYear: ["", [Validators.required]],
      intakeYear: ["", [Validators.required]],
      intakeMonth: ["", [Validators.required]],
      programLevel: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(8), matchValidator('confirmPassword', true)]],
      confirmPassword: ["", [Validators.required, matchValidator('password')]],
      terms: [false, [Validators.required]],
    }
    );

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
    this.getProgramLevelList();
    this.intakeMonthLooking = [
      { label: "1", value: "January" },
    { label: "2", value: "February" },
    { label: "3", value: "March" },
    { label: "4", value: "April" },
    { label: "5", value: "May" },
    { label: "6", value: "June" },
    { label: "7", value: "July" },
    { label: "8", value: "August" },
    { label: "9", value: "September" },
    { label: "10", value: "October" },
    { label: "11", value: "November" },
    { label: "12", value: "December" },];
    this.genderList = [
      { label: "M", value: "Male" },
      { label: "F", value: "Female" },];
    this.intakeYearLooking = [
      { label: "2023", value: "2023" },
      { label: "2024", value: "2024" },
      { label: "2025", value: "2025" },
      { label: "2026", value: "2026" },
      { label: "2027", value: "2027" },
    ];
  }
  GetLocationList() {
    this.locationService.getLocation().subscribe(
      (res: any) => {
        this.locationList = res;
      },
      (error: any) => {
        this.toastr.add({ severity: 'warning', summary: 'Warning', detail: error.error.message });
      }
    );
  }

  getProgramLevelList() {
    this.locationService.getProgramLevel().subscribe(
      (res: any) => {
        this.programLevelList = res;
      },
      (error: any) => {
        this.toastr.add({ severity: 'warning', summary: 'Warning', detail: error.error.message });
      }
    );
  }

  submitted = false;
  get f() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registrationForm.value.terms == false) {
      this.toastr.add({ severity: 'error', summary: 'Alert!!!', detail: "Please agree Terms and Condition before Signup" });
      return;
    }
    if (this.registrationForm.invalid) {
      this.toastr.add({ severity: 'error', summary: 'Alert!!!', detail: "Fill all the information" });
      return;
    }
    var data = {
      name: this.registrationForm.value.fullName,
      location_id: this.registrationForm.value.location?.id,
      phone: this.registrationForm.value.contactNumber,
      email: this.registrationForm.value.emailAddress,
      interested_country_id: this.registrationForm.value.interestedCountry.id,
      last_degree_passing_year: this.registrationForm.value.lastDegreePassingYear,
      intake_year_looking: this.registrationForm.value.intakeYear.label,
      intake_month_looking: this.registrationForm.value.intakeMonth.label,
      programlevel_id: this.registrationForm.value.programLevel.id,
      gender: this.registrationForm.value.gender.label,
      password: this.registrationForm.value.password,
      password_confirmation: this.registrationForm.value.password,
      platform_id: 1,
      usertype_id: 1,
    };

    this.service.Registraion(data).subscribe(
        (_) => {
          this.toastr.add({severity: 'success', summary: 'Success', detail: "User Registered"});
          setTimeout(() => {
            this.router.navigate(["/login"])
          }, 2000)
        },
      (error) => {
        const message = error.error.message;
        this.toastr.add({ severity: 'error', summary: 'Failed', detail: error.error.message });
        console.log(error);
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
      phone: this.registrationForm.value.contactNumber,
    };
    if (this.registrationForm.value.fullName != null && this.registrationForm.value.contactNumber) {
      this.service.getSmsOTP(val).subscribe(
          (res: any) => {
            this.isMobileOTPSend = true;
            this.toastr.add({
              severity: "success",
              summary: "Success",
              detail: "OTP Generated and Sent to " + val.phone,
            });
          },
          (error: any) => {
            this.isMobileOTPSend = false;
            console.log(error);
          }
      );
    } else {
      this.toastr.add({severity: 'info', summary: 'Info', detail: 'Enter Above Filed'});
    }
    // console.log(this.registrationForm.value)
    // if (this.registrationForm.value.fullName != null && this.registrationForm.value.contactNumber) {
    //   this.isMobileOTPSend = true;
    // } else {
    //   this.toastr.add({severity: 'info', summary: 'Info', detail: 'Enter Above Filed'});
    // }
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
        phone: this.registrationForm.value.contactNumber,
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
            console.log(error);
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
      (res) => {
        console.log(res)
        this.isEmailOTPSend = true;
        this.registrationForm.controls['emailAddress'].readonly = true;    
      },
      (error) => {
        this.isEmailOTPSend = false;
        const message = error.error.message;
        this.toastr.add({ severity: 'error', summary: 'Failed', detail: error.error.message });
        console.log(error);
      }
    );
  }

  onValidateEmailOTP() {
    this.isRemainingFieldVisible = true;
    this.isEmailOTPValidated = true;

    return;
    if (this.emailOTPForm.invalid) {
      this.toastr.add({severity: 'error', summary: 'Alert!!!', detail: "Enter Valid OTP"});
      return;
    }

    const otp = this.emailOTPForm.value.otp5 + this.emailOTPForm.value.otp6 +
        this.emailOTPForm.value.otp7 + this.emailOTPForm.value.otp8;
    var data = {
      otp: otp,
      email: this.registrationForm.value.emailAddress,
    };
    this.isRemainingFieldVisible = true;
    this.service.validateEmailOTP(data).subscribe(
        (res) => {
          console.log(res)
          this.isRemainingFieldVisible = true;
        },
        (error) => {
          this.isEmailOTPValidated = true;
          this.isRemainingFieldVisible = false;
          const message = error.error.message;
          this.toastr.add({severity: 'error', summary: 'Failed', detail: "Invalid OTP"});
        }
    );
    // this.isMobileOTPValidated = true;
    // this.isEmailOTPSend = true;
  }
  yearChange(event: any){
   // console.log(event.value.value)
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const d = new Date();
    // const rest = month.slice(d.getMonth())
    this.intakeMonthLooking = [
      {label: "1", value: "January"},
      {label: "2", value: "February"},
      {label: "3", value: "March"},
      {label: "4", value: "April"},
      {label: "5", value: "May"},
      {label: "6", value: "June"},
      {label: "7", value: "July"},
      {label: "8", value: "August"},
      {label: "9", value: "September"},
      {label: "10", value: "October"},
      {label: "11", value: "November"},
      {label: "12", value: "December"},];
  }

  focusNextInput(event: any, num: number) {
    const code = (event.code || '').toLowerCase();

    if (code.includes('backspace')) {
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
    } else if (code.includes('digit')) {
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

  focusNextEmailInput(event: any, num: number) {
    const code = (event.code || '').toLowerCase();

    if (code.includes('backspace')) {
      switch (num) {
        case 2:
          this.otp5.nativeElement.focus();
          break;
        case 3:
          this.otp6.nativeElement.focus();
          break;
        case 4:
          this.otp7.nativeElement.focus();
          break;
      }
    } else if (code.includes('digit')) {
      switch (num) {
        case 1:
          this.otp6.nativeElement.focus();
          break;
        case 2:
          this.otp7.nativeElement.focus();
          break;
        case 3:
          this.otp8.nativeElement.focus();
          break;
      }
    }
  }

}
