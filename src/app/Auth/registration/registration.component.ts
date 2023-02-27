import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { matchValidator } from "src/app/@Supports/matchvalidator";
import { LocationService } from "src/app/location.service";
import { AuthService } from "../auth.service";
import {MessageService} from "primeng/api";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  public registrationForm: any = FormGroup;
  constructor(private service: AuthService,private router:Router, private formBuilder: FormBuilder,private locationService:LocationService,private toastr: MessageService) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      emailAddress: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8),matchValidator('confirmPassword',true)]],
      confirmPassword: ["", [Validators.required,matchValidator('password')]],
      location: ["",[Validators.required]],
      contactNumber: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      terms: [false, [Validators.required]],
    }
    );
    this.GetLocationList();
  }
 GetLocationList(){
  this.locationService.getLocation().subscribe(
    (res:any) => {
      this.locationList=res;
    },
    (error: any) => {
        this.toastr.add({severity:'warning', summary: 'Warning', detail: error.error.message});
    }
  );
 }
  submitted = false;
  get f() {
    return this.registrationForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if(this.registrationForm.value.terms==false)
    {
      this.toastr.add({severity:'error', summary: 'Alert!!!', detail: "Please agree Terms and Condition before Signup"});
      return;
    }
    if (this.registrationForm.invalid) {       
      return;
    }
    var data = {
      name: this.registrationForm.value.firstName+" "+this.registrationForm.value.lastName,
      password: this.registrationForm.value.password,
      password_confirmation: this.registrationForm.value.password,
      email: this.registrationForm.value.emailAddress,
      phone: this.registrationForm.value.contactNumber,
      location_id: this.registrationForm.value.location?.id,
      platform_id:1,
      usertype_id:1,
    };
    this.service.Registraion(data).subscribe(
      (res) => {
          this.toastr.add({severity:'success', summary: 'Success', detail: "User Registered"});
          setTimeout(()=>{ this.router.navigate(["/login"]) },5000)
      },
      (error) => {
        const message = error.error.message;
          this.toastr.add({severity:'error', summary: 'Failed', detail: error.error.message});
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
  displayTerms = "none";
  selectedLocation: number | undefined;
  TermsContent:any;
  locationList :any;
}
