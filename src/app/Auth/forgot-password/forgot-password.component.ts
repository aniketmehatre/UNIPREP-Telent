import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public resetForm: any = FormGroup;
  constructor(private service: AuthService, private formBuilder: FormBuilder,private router:Router,private toastr: MessageService) {}
  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
  submitted = false;
  get f() {
    return this.resetForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    let val = {
      email: this.resetForm.value.email,
    };
    this.service.getOTP(val).subscribe(
      (res: any) => {
        this.toastr.add({severity:'success', summary: 'Success', detail: "OTP Generated and Sent to " + val.email});
        this.router.navigate(["/verification", this.resetForm.value.email]);
      },
      (error: any) => {
        this.toastr.add({severity:'error', summary: 'Error', detail: error});

      }
    );
  }

}
