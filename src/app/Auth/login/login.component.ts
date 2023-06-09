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
import { DataService } from "src/app/data.service";

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
      private toast: MessageService, private dataService: DataService
  ) {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["vaisagh@uniabroad.co.in", [Validators.required, Validators.email]],
      password: ["applepie", [Validators.required]],
    });
    this.subs.sink = this.service.selectloggedIn$().subscribe(loggedIn => {
      if (!loggedIn) {
        return
      }

      this.dataService.showTimerInHeader(loggedIn);
      this.subs.sink = this.service.selectMessage$().subscribe(message => {
        this.toast.add({severity: 'success', summary: 'Success', detail: message});
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
