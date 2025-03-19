import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { matchValidator } from "src/app/@Supports/matchvalidator";
import { AuthService } from "../auth.service";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { InputGroupModule } from "primeng/inputgroup";

@Component({
    selector: "app-setpassword",
    templateUrl: "./setpassword.component.html",
    styleUrls: ["./setpassword.component.scss"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, InputGroupAddonModule, InputTextModule, InputGroupModule, RouterModule]
})
export class SetpasswordComponent implements OnInit {
  public setpasswordForm: any = FormGroup;
  isNotSuccess = true;

  show = false;
  password: string = "password";
  show1 = false;
  password1: string = "password";

  constructor(
    private service: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: MessageService
  ) {}
  ngOnInit() {
    this.setpasswordForm = this.formBuilder.group({
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

  submitted = false;
  get f() {
    return this.setpasswordForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.setpasswordForm.invalid) {
      return;
    }
    let val = {
      email: this.route.snapshot.paramMap.get("email"),
      password_confirmation: this.setpasswordForm.value.password,
      password: this.setpasswordForm.value.password,
    };
    this.service.setPassword(val).subscribe(
      (res: any) => {
        this.toastr.add({
          severity: "success",
          summary: "Success",
          detail: "Password Reset for your " + val.email,
        });
        this.isNotSuccess = false;
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2000);
      },
      (error: any) => {
        this.toastr.add({
          severity: "warning",
          summary: "Sorry :(",
          detail:
            "Something went wrong in Password Reset " + error.error.message,
        });
        this.router.navigate(["/forgot-password"]);
      }
    );
  }
}
