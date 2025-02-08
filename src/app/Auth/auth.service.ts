import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, shareReplay, tap, throwError, switchMap, map, catchError, retry, timeout } from "rxjs";
import { catchError as rxjsCatchError } from "rxjs/operators";
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
    // Try both possible token locations
    const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
    const token = localStorage.getItem(tokenKey) || localStorage.getItem(environment.tokenKey);
    
    console.log('GetToken - Token key used:', tokenKey);
    console.log('GetToken - Token exists:', !!token);
    if (token) {
      console.log('GetToken - Token value:', token.substring(0, 10) + '...');
    }
    return token;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      console.warn('No token available for request');
      return new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
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
    console.log('Login attempt started:', data.email);
    this.store.dispatch(AuthActions.login({ request: data }));
    
    return this.isAuthenticated(data).pipe(
      tap(response => {
        console.log('Authentication response received:', response);
        if (!response?.token) {
          console.warn('No token received in login response');
          throw new Error('No token received');
        }

        // Save token in both storage locations for compatibility
        const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
        localStorage.setItem(tokenKey, response.token);
        localStorage.setItem(environment.tokenKey, response.token);
        console.log('Token saved in both locations');
        
        // Dispatch login success after token is saved
        this.store.dispatch(AuthActions.loginSuccess({ token: response.token }));
      }),
      switchMap(response => {
        // After token is saved, get user details
        return this.getMe().pipe(
          tap(userData => {
            console.log('User details retrieved successfully:', userData);
            
            // Ensure we're on the main thread for navigation
            setTimeout(() => {
              console.log('Attempting navigation to dashboard...');
              this.router.navigate(['/pages/dashboard'], {
                replaceUrl: true
              }).then(
                success => console.log('Navigation result:', success),
                error => console.error('Navigation error:', error)
              );
            }, 0);
          }),
          // Return the original response
          map(() => response)
        );
      }),
      catchError(error => {
        console.error('Login flow error:', error);
        if (error.status === 401) {
          console.log('Unauthorized error during login, clearing token');
          this.clearToken();
        }
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
    console.log('GetMe - Using token:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.error('GetMe - No token available');
      return throwError(() => new Error('No authentication token available'));
    }

    return this.http.get<any>(`${environment.ApiUrl}/getuserdetails`, { 
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      timeout(30000), // 30 second timeout
      tap(response => {
        console.log('GetMe - Response received:', response);
        if (!response?.userdetails?.[0]) {
          throw new Error('Invalid user details response');
        }

        const userDetails = response.userdetails[0];
        this.user = userDetails;
        this._userLoginCount = userDetails.login_status;
        this._checkExistsSubscription = userDetails.subscription_exists;

        // Store user data securely
        this.storeUserData(userDetails);
      }),
      catchError(error => {
        console.error('GetMe - Error:', error);
        if (error.status === 401 || error.status === 0) {
          console.log('GetMe - Unauthorized or CORS error, checking token validity');
          if (!this.isTokenValid()) {
            console.log('GetMe - Token invalid, clearing token');
            this.clearToken();
          }
          return throwError(() => new Error('Unauthorized access or CORS error'));
        }
        return throwError(() => error);
      })
    );
  }

  private storeUserData(userDetails: any): void {
    if (userDetails.id) this.encryptAndStore("UserID", userDetails.id.toString());
    if (userDetails.name) this.encryptAndStore("Name", userDetails.name);
    if (userDetails.phone) this.encryptAndStore("phone", userDetails.phone);
    if (userDetails.email) this.encryptAndStore("email", userDetails.email);
    if (userDetails.home_country_name) this.encryptAndStore("home_country_name", userDetails.home_country_name);
    if (userDetails.selected_country) this.encryptAndStore("countryId", userDetails.selected_country);
  }

  private async encryptAndStore(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await this.encryptData(value);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
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
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
      
    return this.http.post<UserData>(environment.ApiUrl + "/login", val, {
      headers: headers
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
    if (!token) {
      console.warn('Attempted to save empty token');
      return;
    }
    
    try {
      const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
      console.log('SaveToken - Using token key:', tokenKey);
      localStorage.setItem(tokenKey, token);
      console.log('SaveToken - Token saved successfully');
      
      // Verify token was saved
      const savedToken = this.getToken();
      if (savedToken !== token) {
        console.error('SaveToken - Token verification failed after save');
        console.log('SaveToken - Expected:', token.substring(0, 10) + '...');
        console.log('SaveToken - Got:', savedToken?.substring(0, 10) + '...');
      } else {
        console.log('SaveToken - Token verification successful');
      }
    } catch (error) {
      console.error('SaveToken - Error saving token:', error);
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    console.log('Checking token validity');

    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp > currentTime;
      console.log('Token validity:', isValid ? 'Valid' : 'Expired');
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  private clearToken(): void {
    try {
      const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
      localStorage.removeItem(tokenKey);
      console.log('Token cleared successfully');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  // Helper method to convert string to Uint8Array
  private str2ab(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  // Helper method to convert ArrayBuffer to string
  private ab2str(buf: ArrayBuffer): string {
    return new TextDecoder().decode(buf);
  }

  // Helper method to get encryption key
  private async getKey(salt: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.str2ab(salt),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.str2ab('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Helper method to encrypt data
  private async encryptData(data: any): Promise<string> {
    try {
      const key = await this.getKey(environment.secretKeySalt);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const jsonStr = JSON.stringify(data);
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        this.str2ab(jsonStr)
      );

      // Combine IV and encrypted data
      const encryptedArray = new Uint8Array(iv.length + encrypted.byteLength);
      encryptedArray.set(iv);
      encryptedArray.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...encryptedArray));
    } catch (error) {
      console.error('Error encrypting data:', error);
      return '';
    }
  }

  // Helper method to decrypt data
  private async decryptData(encryptedData: string): Promise<any> {
    try {
      const key = await this.getKey(environment.secretKeySalt);
      const encryptedArray = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = encryptedArray.slice(0, 12);
      const data = encryptedArray.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      const decryptedStr = this.ab2str(decrypted);
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
}
