import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { AuthService } from "../auth.service"
import { MessageService } from "primeng/api"
import { CommonModule } from "@angular/common"
import { InputOtpModule } from "primeng/inputotp"

@Component({
	selector: "app-verification",
	templateUrl: "./verification.component.html",
	styleUrls: ["./verification.component.scss"],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [CommonModule, ReactiveFormsModule, RouterModule, InputOtpModule],
})
export class VerificationComponent implements OnInit {
	public otpForm: FormGroup;
	submitted = false;

	constructor(
		private service: AuthService, 
		private formBuilder: FormBuilder, 
		private router: Router, 
		private route: ActivatedRoute, 
		private toastr: MessageService
	) {}

	ngOnInit() {
		this.otpForm = this.formBuilder.group({
			otp: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
		});

		if (this.route.snapshot.paramMap.get("email") == null) {
			this.router.navigate(["/forgot-password"])
		}
	}

	get f() {
		return this.otpForm.controls;
	}

	onSubmit() {
		this.submitted = true;
		
		if (this.otpForm.invalid) {
			this.toastr.add({ severity: "error", summary: "Error", detail: "Please enter a valid 4-digit OTP." });
			return;
		}

		const otpValue = this.otpForm.get('otp')?.value;
		const data = {
			otp: otpValue,
			email: this.route.snapshot.paramMap.get("email"),
		}

		this.service.validateEmailOTP(data).subscribe(
			(res: any) => {
				this.router.navigate(["/setpassword", otpValue, this.route.snapshot.paramMap.get("email")])
			},
			(error: any) => {
				this.toastr.add({ severity: "error", summary: "Error", detail: "Invalid OTP. Please try again." });
			}
		)
	}

	resend() {
		let val = {
			email: this.route.snapshot.paramMap.get("email"),
		}
		this.service.getOTP(val).subscribe(
			(res: any) => {
				this.toastr.add({ severity: "success", summary: "Success", detail: "OTP Generated and Sent to " + val.email })
			},
			(error: any) => {
				this.toastr.add({ severity: "warning", summary: "Sorry :(", detail: error })
			}
		)
	}
}
