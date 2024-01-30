import {Component, ElementRef, Input, OnDestroy, OnInit} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { MessageService } from "primeng/api";
import { SubSink } from "subsink";
import { DataService } from "src/app/data.service";
import {DashboardService} from "../../pages/dashboard/dashboard.service";
import {GoogleLoginProvider, SocialAuthService} from "@abacritt/angularx-social-login";
import {take} from "rxjs";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  loginForm: any = FormGroup;
  submitted: boolean = false;
  show: boolean = true;
  password: string = 'password';
  constructor(
    private service: AuthService, private formBuilder: FormBuilder, private route: Router,
    private toast: MessageService, private dataService: DataService, private el: ElementRef,
    private dashboardService: DashboardService, private authService: SocialAuthService
  ) { }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  showPassword(): void{
    if (this.password === 'password') {
      this.password = 'text';
      this.show = false;
    } else {
      this.password = 'password';
      this.show = true;
    }
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      var socialUser = user;
      var isLoggedIn = (user != null);
    });
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
    this.subs.sink = this.service.selectloggedIn$().subscribe(loggedIn => {
      if (!loggedIn) {
        return
      }
      this.dataService.showTimerInHeader(loggedIn);
      this.service.getMe().subscribe((data) => {
        this.loadCountryList(data);
        this.subs.sink = this.service.selectMessage$().subscribe(message => {
          if (message == 'Login Success') {
            this.toast.add({ severity: 'success', summary: 'Success', detail: message });
          }
        });
        this.route.navigate(['/pages/dashboard']);
      });
    });
  }

  countryLists: any;
  loadCountryList(data: any){
    this.dashboardService.countryList().subscribe(countryList => {
      this.countryLists = countryList;
      this.countryLists.forEach((element: any) => {
        if (element.id == Number(data.userdetails[0].interested_country_id)) {
          localStorage.setItem('countryId', data.userdetails[0].interested_country_id);
          this.dataService.changeCountryName(element.country);
          this.dataService.changeCountryFlag(element.flag);
          this.dataService.changeCountryId(element.id);
        }
      });
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.service.login(this.loginForm.value);
  }


  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
        .then(user => {console.log('usss', user)})
        .catch(error => console.error(error));
  }
}
