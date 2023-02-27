import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import {MessageService} from "primeng/api";
import {SubSink} from "subsink";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  loginForm: any = FormGroup;
  submitted = false;
  constructor(
      private service: AuthService, private formBuilder: FormBuilder,private route:Router,
      private toastr: MessageService
  ) {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["tamil@uniabroad.io", [Validators.required, Validators.email]],
      password: ["12345678", [Validators.required]],
    });
    this.subs.sink = this.service.selectloggedIn$().subscribe(loggedIn => {
      if (!loggedIn) {
        return
      }
      this.subs.sink = this.service.selectMessage$().subscribe(message => {
        this.toastr.add({severity: 'success', summary: 'Success', detail: message});
      });
      this.route.navigate(['/pages/dashboard']);
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.service.login(this.loginForm.value);
  }
}
