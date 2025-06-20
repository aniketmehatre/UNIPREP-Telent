import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../auth.service';
import {MessageService} from "primeng/api";
import {CommonModule} from '@angular/common';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, RouterModule]
})
export class ForgotPasswordComponent implements OnInit {

    public resetForm: any = FormGroup;

    constructor(private service: AuthService, private formBuilder: FormBuilder, private router: Router, private toastr: MessageService) {
    }

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
        this.service.getOTP(val).subscribe({
            next: (data) => {
                this.toastr.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: "OTP Generated and Sent to " + val.email
                });
                this.router.navigate(["/verification", this.resetForm.value.email]);
            },
            error: (error) => {
                this.toastr.add({severity: 'error', summary: 'Error', detail: error.error.message});

            }
        })
    }

}
