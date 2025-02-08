import CryptoJS from "crypto-js";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, shareReplay, tap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User, UserData } from "../@Models/user.model";
import { LoginRequest } from "../@Models/auth.model";
import { Router } from "@angular/router";
import { DataService } from "../data.service";
import { jwtDecode } from "jwt-decode"; // Use named import
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AuthState } from "./store/reducer";
import { AuthActions } from "./store/actions";
import { selectLoading, selectLoggedIn, selectMessage, selectLoginData } from "./store/selectors";
import { authFeature } from "./store/reducer";
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage";

const ngxLocalstorageConfiguration = NGX_LOCAL_STORAGE_CONFIG as unknown as { prefix: string, delimiter: string };

@Injectable({
  providedIn: "root",
})
export class AuthService {
  _logindata: any;
  // user!: User;
  _user!: User | null;
  public _userLoginCount!: number;
  public _userContineTrial!: boolean;
  userData = new BehaviorSubject<User | null>(null);
  canDisableSignIn = new BehaviorSubject<boolean>(true);
  public _checkExistsSubscription!: number;
  private tokenKey = "123";

  constructor(
    private http: HttpClient, 
    private store: Store<AuthState>, 
    private router: Router, 
    private dataService: DataService
  ) {}

  getToken(): string | null {
    const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
    return localStorage.getItem(tokenKey) || localStorage.getItem(environment.tokenKey);
  }

  set user(u: User | null) {
    this._user = u;
    this.userData.next(u);
  }

  get user() {
    return this._user;
  }

  contineStatus(event: any) {
    this._userContineTrial = event;
  }

  updateSubscriptionName(name: string) {
    if (this.user) {
      this.user.subscription_name = name;
    }
  }

  getTimeInfoForCard() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getfreetrailtime", {
      headers: headers,
    });
  }

  login(data: LoginRequest): Observable<UserData> {
    this.store.dispatch(AuthActions.login({ request: data }));
    return this.isAuthenticated(data).pipe(
      tap(response => {
        if (response.token) {
          console.log('Received token:', response.token);
          // Save token in both locations
          const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
          localStorage.setItem(tokenKey, response.token);
          localStorage.setItem(environment.tokenKey, response.token);
          console.log('Stored token in localStorage:', this.getToken()); // Verify stored token
          this.store.dispatch(AuthActions.loginSuccess({ token: response.token }));
        } else {
          console.warn('No token received in login response');
        }
      }),
      catchError(error => {
        this.store.dispatch(AuthActions.loginFailure({ error: error.message }));
        return throwError(() => error);
      })
    );
  }

  selectLoading$() {
    return this.store.select(authFeature.selectLoading);
  }

  selectMessage$() {
    return this.store.select(authFeature.selectMessage);
  }

  selectloggedIn$() {
    return this.store.select(authFeature.selectLoggedIn);
  }

  selectLogInData$() {
    return this.store.select(authFeature.selectLoginData);
  }

  logout() {
    this.store.dispatch(AuthActions.loginFailure({ error: undefined }));
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/logout", { headers });
  }

  getMe(): Observable<any> {
    const token = this.getToken();
    console.log('Token being used for getMe:', token); // Log token

    if (!token) {
      console.error('No token available for getMe request');
      return throwError(() => new Error('No authentication token available'));
    }

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    console.log('Request headers:', headers.get('Authorization')); // Log headers

    return this.http.get<any>(`${environment.ApiUrl}/getuserdetails`, { headers }).pipe(
      tap((response) => {
        console.log('GetMe response:', response); // Log successful response
        localStorage.setItem("countryId", response.userdetails[0].selected_country);
        this.user = response.userdetails[0];
        this._userLoginCount = response.userdetails[0].login_status;
        this._checkExistsSubscription = response.userdetails[0].subscription_exists;
        const encUserID = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].id), environment.secretKeySalt).toString();
        const encName = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].name), environment.secretKeySalt).toString();
        const encPhone = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].phone), environment.secretKeySalt).toString();
        const encCreditPlan = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].credit_plans), environment.secretKeySalt).toString();
        const encQuestionLeft = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].questions_left), environment.secretKeySalt).toString();
        const encGuideLine = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].guidelineaccept), environment.secretKeySalt).toString();
        const encEmail = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].email), environment.secretKeySalt).toString();
        const encHomeCountry = CryptoJS.AES.encrypt(JSON.stringify(response.userdetails[0].home_country_name), environment.secretKeySalt).toString();

        localStorage.setItem("UserID", encUserID);
        localStorage.setItem("Name", encName);
        localStorage.setItem("phone", encPhone);
        localStorage.setItem("questions_left", encQuestionLeft);
        localStorage.setItem("email", encEmail);
        localStorage.setItem("home_country_name", encHomeCountry);
        setTimeout(() => {
          this.canDisableSignIn.next(false);
        }, 5000);
      }),
      catchError((error: any) => {
        console.error('GetMe error:', error); // Log error details
        if (error.status === 401) {
          // Check if token is expired
          const isValid = this.isTokenValid();
          console.log('Token validity check:', isValid);
          if (!isValid) {
            console.log('Token is invalid or expired');
            localStorage.removeItem(environment.tokenKey);
            const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
            localStorage.removeItem(tokenKey);
          }
        }
        this.router.navigateByUrl("/login");
        return throwError(() => error);
      })
    );
  }

  getCountry() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
      headers: headers,
    });
  }

  // getToken() {
  //     return of('123');
  // }

  isAuthenticated(val: any): Observable<UserData> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<UserData>(environment.ApiUrl + "/login", val, {
      headers: headers,
    });
  }

  Registraion(val: any): Observable<{ message: string }> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<{ message: string }>(environment.ApiUrl + "/register", val, { headers: headers });
  }

  sendEmailOTP(data: any): Observable<{ message: string }> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<{ message: string }>(environment.ApiUrl + "/sendotp", data, { headers: headers });
  }

  validateEmailOTP(data: any): Observable<{ message: string }> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<{
      message: string;
    }>(environment.ApiUrl + "/validateemailotp", data, { headers: headers });
  }

  getOTP(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/sendrecoveryemail", val, {
      headers: headers,
    });
  }

  getSmsOTP(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/requestsmsotp", val, {
      headers: headers,
    });
  }

  verifySmsOTP(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/validatesmsotp", val, {
      headers: headers,
    });
  }

  setPassword(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/resetpassword", val, { headers: headers });
  }

  getProgramLevel() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/programlevel", {
      headers: headers,
    });
  }

  // getCountryList() {
  //     const headers = new HttpHeaders().set("Accept", "application/json");
  //     return this.http.get<any>(environment.ApiUrl + "/country", {
  //         headers: headers,
  //     });
  // }

  // getNewUserTimeLeft() {
  //     const headers = new HttpHeaders().set("Accept", "application/json");
  //     return this.http.post<any>(environment.ApiUrl + "/getsubscriptiontimeleft", {
  //         headers: headers,
  //     });
  // }

  private dataCache$: Observable<any> | null = null;
  getNewUserTimeLeft(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    if (!this.dataCache$) {
      this.dataCache$ = this.http.post<any>(environment.ApiUrl + "/getsubscriptiontimeleft", { headers: headers }).pipe(
        tap((data) => {}),
        shareReplay(1)
      );
    }
    return this.dataCache$;
  }

  gmailLogin(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GoogleLogin", data, {
      headers: headers,
    });
  }
  googlesignUp(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/googlesignUp", data, {
      headers: headers,
    });
  }

  isExist(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/EmailExistOrNot", data, {
      headers: headers,
    });
  }

  updateEducationLevel(data: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/UpdateEduLvl",
      { current_educaiton: data },
      {
        headers: headers,
      }
    );
  }

  clearCache(): void {
    this.dataCache$ = null; // Clear the cached observable
  }

  sendWhatsappOtp(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/sendWhatsappOtp", val, { headers: headers });
  }

  validateWhatsappOtp(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/validateWhatsappOtp", val, { headers: headers });
  }

  saveToken(token: string): void {
    if (!token) return;
    // Save token in both locations
    const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(environment.tokenKey, token);
  }

  // Validate token
  isTokenValid(): boolean {
    const token = this.getToken();
    console.log("sss", token);

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime; // Token is valid if current time is before expiration
      } catch (error) {
        return false; // Invalid token
      }
    }
    return false; // No token
  }
}
