import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, shareReplay, tap, throwError, switchMap, map, catchError, retry, timeout, delay, timer, race } from "rxjs";
import { User, UserData } from "../@Models/user.model";
import { LoginRequest } from "../@Models/auth.model";
import { Router } from "@angular/router";
import { DataService } from "../data.service";
import { jwtDecode } from "jwt-decode";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AuthState } from "./store/reducer";
import { AuthActions } from "./store/actions";
import { authFeature } from "./store/reducer";
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage";
import { AuthTokenService } from "../core/services/auth-token.service";
import { StorageService } from "../storage.service";
import { SubscriptionResponse } from "../@Models/subscription";
const ngxLocalstorageConfiguration = NGX_LOCAL_STORAGE_CONFIG as unknown as { prefix: string, delimiter: string };

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly LOGIN_TIMEOUT = 8000; // 8 seconds timeout for login
  private readonly API_TIMEOUT = 5000;  // 5 seconds for other API calls

  _logindata: any;
  // user!: User;
  _user!: User | null;
  public _userLoginCount!: number;
  public _userContineTrial!: boolean;
  userData = new BehaviorSubject<User | null>(null);
  public canDisableSignIn = new BehaviorSubject<boolean>(true);
  public _checkExistsSubscription!: number;
  private tokenKey = "123";
  // Add cache for getMe
  private getMeCache$: Observable<any> | null = null;
  private readonly CACHE_DURATION = 300000; // 5 minutes cache duration
  _userSubscrition!: SubscriptionResponse;
  public hasUserSubscription$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private store: Store<AuthState>,
    private router: Router,
    private dataService: DataService,
    private authTokenService: AuthTokenService,
    private storage: StorageService,
  ) { }

  getToken(): string | null {
    return this.authTokenService.getToken();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    console.debug('GetAuthHeaders - Token check:', {
      exists: !!token,
      length: token?.length,
      preview: token ? `${token.substring(0, 20)}...` : 'none'
    });

    // Base headers that should be present in all requests
    let headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    if (!token) {
      console.warn('GetAuthHeaders - No token available for request');
      return headers;
    }

    try {
      // Clean the token and ensure proper format
      const cleanToken = token.replace(/['"]+/g, '').trim();
      const bearerToken = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;

      // Add authorization header
      headers = headers.set('Authorization', bearerToken);

      // Verify headers were set correctly
      const finalAuthHeader = headers.get('Authorization');

      if (!finalAuthHeader || !finalAuthHeader.startsWith('Bearer ')) {
        console.error('GetAuthHeaders - Authorization header not set correctly:', finalAuthHeader);
        throw new Error('Failed to set Authorization header correctly');
      }

      return headers;
    } catch (error) {
      console.error('GetAuthHeaders - Error setting headers:', error);
      // Return headers without authorization if there was an error
      return headers;
    }
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

    // Reset cache and tokens
    this.resetGetMeCache();
    this.authTokenService.clearToken();

    const loginRequest$ = this.http.post<UserData>(environment.ApiUrl + "/login", data, {
      headers: new HttpHeaders().set('Accept', 'application/json')
    }).pipe(
      tap(response => {
        if (!response?.token) {
          throw new Error('No token received');
        }
        this.authTokenService.setToken(response.token);
      })
    );

    const timeout$ = timer(this.LOGIN_TIMEOUT).pipe(
      map(() => { throw new Error('Login timeout'); })
    );

    return race(loginRequest$, timeout$).pipe(
      switchMap(() => this.validateAndGetUserData()),
      catchError(error => {
        console.error('Login error:', error);
        this.authTokenService.clearToken();
        this.store.dispatch(AuthActions.loginFailure({ error: error.message }));
        return throwError(() => error);
      })
    );
  }

  private validateAndGetUserData(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp <= currentTime) {
        return throwError(() => new Error('Token expired'));
      }
    } catch (error) {
      return throwError(() => new Error('Invalid token'));
    }

    return this.getMe().pipe(
      tap(userData => {
        if (!userData?.userdetails?.[0]) {
          throw new Error('Invalid user details');
        }
        this.router.navigate(['/pages/dashboard'], { replaceUrl: true });
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
    this.resetGetMeCache(); // Reset cache on logout
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/logout", { headers });
  }

  getMe(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.logout().subscribe();
      return throwError(() => new Error('No authentication token'));
    }

    if (this.getMeCache$) {
      return this.getMeCache$;
    }

    const request$ = this.http.get<any>(`${environment.ApiUrl}/getuserdetails`, {
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(
      map(response => {
        if (!response?.userdetails?.[0]) {
          throw new Error('Invalid response format');
        }
        const userDetails = response.userdetails[0];
        this.user = {
          ...userDetails,
          name: userDetails.name || ''
        };
        this._userLoginCount = userDetails.login_status || 0;
        this._checkExistsSubscription = userDetails.subscription_exists || 0;
        this.storeUserData(userDetails);
        return response;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
      timeout(30000),
      catchError(error => {
        this.resetGetMeCache();
        if (error.status === 401) {
          this.authTokenService.clearToken();
          return throwError(() => new Error('Session expired'));
        }
        return throwError(() => error);
      })
    );

    this.getMeCache$ = request$;
    return this.getMeCache$;
  }

  private async storeUserData(userDetails: any): Promise<void> {
    try {
      if (userDetails.id) this.storage.set("UserID", userDetails.id.toString());
      if (userDetails.name) this.storage.set("Name", userDetails.name);
      if (userDetails.phone) this.storage.set("phone", userDetails.phone);
      if (userDetails.email) this.storage.set("email", userDetails.email);
      if (userDetails.home_country_name) this.storage.set("home_country_name", userDetails.home_country_name);
      if (userDetails.selected_country) this.storage.set("countryId", userDetails.selected_country);
      this.storage.set("countryId", userDetails.interested_country_id);
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  // private async encryptAndStore(key: string, value: string): Promise<void> {
  //   try {
  //     const encryptedValue = await this.encryptData(value);
  //     this.storage.set(key, encryptedValue);
  //   } catch (error) {
  //     console.error(`Error encrypting and storing ${key}:`, error);
  //     throw error;
  //   }
  // }

  private str2ab(str: string): Uint8Array {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }

  private ab2str(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
  }

  private async getKey(salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(environment.secretKeySalt),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // async encryptData(data: any): Promise<string> {
  //   try {
  //     const salt = crypto.getRandomValues(new Uint8Array(16));
  //     const iv = crypto.getRandomValues(new Uint8Array(12));
  //     const key = await this.getKey(this.ab2str(salt));
  //
  //     const encoder = new TextEncoder();
  //     const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
  //     const encrypted = await crypto.subtle.encrypt(
  //       {
  //         name: 'AES-GCM',
  //         iv: iv
  //       },
  //       key,
  //       encoder.encode(dataStr)
  //     );
  //
  //     // Combine salt + iv + encrypted data
  //     const encryptedArray = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  //     encryptedArray.set(salt, 0);
  //     encryptedArray.set(iv, salt.length);
  //     encryptedArray.set(new Uint8Array(encrypted), salt.length + iv.length);
  //
  //     return btoa(String.fromCharCode(...encryptedArray));
  //   } catch (error) {
  //     console.error('Error encrypting data:', error);
  //     throw error;
  //   }
  // }

  // async decryptData(encryptedData: string): Promise<string> {
  //   try {
  //     if (!encryptedData) {
  //       throw new Error("Encrypted data is empty!");
  //     }
  //
  //     const encryptedArray = new Uint8Array(
  //       atob(encryptedData).split('').map(char => char.charCodeAt(0))
  //     );
  //
  //     // Extract salt, iv and encrypted data
  //     const salt = encryptedArray.slice(0, 16);
  //     const iv = encryptedArray.slice(16, 28);
  //     const data = encryptedArray.slice(28);
  //
  //     const key = await this.getKey(this.ab2str(salt));
  //
  //     const decrypted = await crypto.subtle.decrypt(
  //       {
  //         name: 'AES-GCM',
  //         iv: iv
  //       },
  //       key,
  //       data
  //     );
  //
  //     const decoder = new TextDecoder();
  //     const decryptedText = decoder.decode(decrypted);
  //
  //     return decryptedText;
  //   } catch (error) {
  //     console.error('Error decrypting data:', error);
  //     throw error;
  //   }
  // }

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
    return this.http.post<UserData>(environment.ApiUrl + "/login", val);
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
      this.dataCache$ = this.http.post<SubscriptionResponse>(environment.ApiUrl + "/getsubscriptiontimeleft", { headers: headers }).pipe(
        tap((data) => {
          this._userSubscrition = data;
        }),
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
    if (!token) {
      console.warn('SaveToken - Attempted to save empty token');
      return;
    }

    try {
      // Clean and validate the token
      const cleanToken = token.replace(/['"]+/g, '').trim();
      if (!cleanToken) {
        throw new Error('Token is empty after cleaning');
      }

      // Verify token format
      if (!this.isTokenValid(cleanToken)) {
        throw new Error('Token validation failed');
      }

      const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
      this.storage.set(tokenKey, cleanToken);

      // Verify token was saved correctly
      const savedToken = this.storage.get(tokenKey);
      if (savedToken !== cleanToken) {
        throw new Error('Token verification failed after save');
      }

      console.debug('SaveToken - Token saved and verified successfully');
    } catch (error) {
      console.error('SaveToken - Error:', error);
      this.clearToken();
    }
  }

  private clearToken(): void {
    try {
      const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
      this.storage.remove(tokenKey);
      this.storage.remove(environment.tokenKey); // Clear both possible locations
      this.resetGetMeCache(true); // Force cache reset
      console.debug('Token cleared successfully');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  public isTokenValid(token?: string): boolean {
    try {
      const tokenToCheck = token || this.getToken();
      console.debug('isTokenValid - Token to check:', tokenToCheck ? 'Token exists' : 'No token');

      if (!tokenToCheck) return false;

      const decoded: any = jwtDecode(tokenToCheck);
      const currentTime = Math.floor(Date.now() / 1000);

      console.debug('isTokenValid - Token expiration:', decoded.exp);
      console.debug('isTokenValid - Current time:', currentTime);
      console.debug('isTokenValid - Time until expiration:', decoded.exp - currentTime);

      if (!decoded.exp) {
        console.warn('Token missing expiration');
        return false;
      }

      const isValid = decoded.exp > currentTime;
      console.debug('Token validity check:', isValid ? 'Valid' : 'Expired');
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Add cache reset method with optional force parameter
  resetGetMeCache(force: boolean = false): void {
    if (force || this.getMeCache$) {
      this.getMeCache$ = null;
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/register`, data);
  }

  sendOtp(data: any): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/sendotp`, data);
  }

  validateOtp(data: any): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/validateotp`, data);
  }

  validateSignIn(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/login", req, { headers: headers });
  }

  isInvalidSubscription(module: string): boolean {
    let planExpired: boolean = false;
    if (module === 'ai_global_advisor' || module === 'education_tools' || module === 'travel_tools' || module === 'events') {
      if (this._userSubscrition?.time_left?.plan === "expired" ||
        this._userSubscrition?.time_left?.plan === "subscription_expired") {
        planExpired = true;
      }
    }
    else if (
      module === 'career_tools' ||
      // module === 'employer_connect' ||
      module === 'learning_hub'
    ) {
      if (this._userSubscrition?.time_left?.plan === "expired" ||
        this._userSubscrition?.time_left?.plan === "subscription_expired" ||
        this._userSubscrition?.subscription_details?.subscription_plan === "Student") {
        planExpired = true;
      }
    }
    else if (module === 'founders_tools' || module === 'pitch_desk') {
      if (this._userSubscrition?.time_left?.plan === "expired" ||
        this._userSubscrition?.time_left?.plan === "subscription_expired" ||
        this._userSubscrition?.subscription_details?.subscription_plan === "Student" ||
        this._userSubscrition?.subscription_details?.subscription_plan === "Career") {
        planExpired = true;
      }
    }
    return planExpired;
  }
}
