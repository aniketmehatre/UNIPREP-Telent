import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
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
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from "@abacritt/angularx-social-login";
import {environment} from "@env/environment";
import {LocalStorageService} from "ngx-localstorage";
import {Observable} from "rxjs/internal/Observable";
import {FacebookService} from "ngx-facebook";
import {NgxLinkedinService} from "ngx-linkedin";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('button2') button2!: ElementRef;
  private subs = new SubSink();
  loginForm: any = FormGroup;
  submitted: boolean = false;
  show: boolean = true;
  password: string = 'password';
  constructor(
    private service: AuthService, private formBuilder: FormBuilder, private route: Router,
    private toast: MessageService, private dataService: DataService, private el: ElementRef,
    private dashboardService: DashboardService, private authService: SocialAuthService,
    private storage: LocalStorageService, private fb: FacebookService, private ngxLinkedinService: NgxLinkedinService
  ) { }

  linkedInCredentials = {
    clientId: environment.linkedinId,
    redirectUrl: "http://localhost:4200/pages/dashboard",
    scope: "r_liteprofile%20r_emailaddress%20w_member_social" // To read basic user profile data and email
  };

  button1Clicked() {
    this.button2.nativeElement.click();
  }

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
      let data = {
        email: user.email
      }
      this.service.isExist(data).subscribe(data => {
        if (data == 'Exist'){
          this.service.gmailLogin(user).subscribe(data => {
            if(data.status == 'error'){
              this.toast.add({ severity: 'error', summary: 'Error', detail: data.message });
              return;
            }
            this.storage.set(environment.tokenKey, data.token);
            this.service.getMe().subscribe((data) => {
              this.loadCountryList(data);
                  this.toast.add({ severity: 'success', summary: 'Success', detail: 'Login' });
                  this.route.navigate(['/pages/dashboard']);

            });
          });
        }else{
          this.toast.add({ severity: 'info', summary: 'Info', detail: 'Email not exist , Try Register' });
        }
      });
      //var socialUser = user;
      //this.loggedIn = (user != null);
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
        let cont = Number(data.userdetails[0].interested_country_id)
        if (element.id == cont) {
          localStorage.setItem('countryId', cont.toString());
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

  loginWithFacebook(){
    this.fb.login().then(response => {
      console.log('Facebook login response:', response);
    }).catch(error => {
      console.error('Facebook login error:', error);
    });
  }

  loginWithLinkedIn(){
      // this.ngxLinkedinService.signIn().subscribe(user => {
      //   console.info('signIn', user);
      // });
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
        this.linkedInCredentials.clientId
    }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope={this.linkedInCredentials.scope}`;
  }

}
