import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, of, shareReplay, tap, throwError, switchMap, map, catchError, retry, timeout, delay } from "rxjs";
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
  // Add cache for getMe
  private getMeCache$: Observable<any> | null = null;
  private readonly CACHE_DURATION = 300000; // 5 minutes cache duration

  constructor(
    private http: HttpClient, 
    private store: Store<AuthState>, 
    private router: Router, 
    private dataService: DataService
  ) {}

  getToken(): string | null {
    try {
      // Use a single consistent token key
      const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        console.debug('GetToken - No token found');
        return null;
      }

      // Clean the token - remove quotes and whitespace
      const cleanToken = token.replace(/['"]+/g, '').trim();
      
      if (!this.isTokenValid(cleanToken)) {
        console.debug('GetToken - Token invalid or expired');
        this.clearToken();
        return null;
      }

      return cleanToken;
    } catch (error) {
      console.error('GetToken - Error retrieving token:', error);
      return null;
    }
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
      console.debug('GetAuthHeaders - Final headers:', {
        auth: finalAuthHeader,
        contentType: headers.get('Content-Type'),
        accept: headers.get('Accept')
      });

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
    console.log('Login attempt started:', data.email);
    this.store.dispatch(AuthActions.login({ request: data }));
    
    // Reset any existing cache before starting new login
    this.resetGetMeCache();
    this.clearToken(); // Clear any existing token
    
    return this.isAuthenticated(data).pipe(
      map(response => {
        console.log('Authentication response received:', response);
        if (!response?.token) {
          throw new Error('No token received');
        }
        return response;
      }),
      tap(response => {
        // Clean and validate token before saving
        const cleanToken = response.token.replace(/['"]+/g, '').trim();
        
        try {
          // Validate token structure and expiration
          const decoded: any = jwtDecode(cleanToken);
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (!decoded.exp || decoded.exp <= currentTime) {
            throw new Error('Invalid or expired token received from server');
          }
          
          // Save token only if it's valid
          const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
          localStorage.setItem(tokenKey, cleanToken);
          console.log('Token validated and saved successfully:', cleanToken.substring(0, 10) + '...');
          
          this.store.dispatch(AuthActions.loginSuccess({ token: cleanToken }));
        } catch (error) {
          console.error('Token validation failed:', error);
          this.clearToken();
          throw new Error('Invalid token received from server');
        }
      }),
      // Add longer delay to ensure token is saved and available
      delay(500),
      switchMap(() => {
        const token = this.getToken();
        if (!token) {
          console.error('Token not available after saving');
          throw new Error('Token not available after saving');
        }
        console.log('Token retrieved for user details request:', token.substring(0, 10) + '...');
        
        // Verify headers before making the request
        const headers = this.getAuthHeaders();
        const authHeader = headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          console.error('Invalid Authorization header:', authHeader);
          throw new Error('Invalid Authorization header');
        }
        
        return this.getMe().pipe(
          tap(userData => {
            if (!userData?.userdetails?.[0]) {
              throw new Error('Invalid user details response');
            }
            console.log('User details retrieved successfully');
            setTimeout(() => {
              this.router.navigate(['/pages/dashboard'], { replaceUrl: true })
                .then(success => console.log('Navigation result:', success))
                .catch(error => console.error('Navigation error:', error));
            }, 0);
          }),
          catchError(error => {
            console.error('Error getting user details:', error);
            this.clearToken();
            throw error;
          })
        );
      }),
      catchError(error => {
        console.error('Login flow error:', error);
        this.clearToken();
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
    this.resetGetMeCache(); // Reset cache on logout
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/logout", { headers });
  }

  getMe(): Observable<any> {
    console.debug('GetMe - Starting request');
    const token = this.getToken();
    
    if (!token) {
      console.error('GetMe - No token available');
      return throwError(() => new Error('No authentication token available'));
    }

    // Return cached response if available and not expired
    if (this.getMeCache$) {
      console.debug('GetMe - Returning cached response');
      return this.getMeCache$;
    }

    // Create new request if no cache exists
    console.debug('GetMe - Creating new request');
    const headers = this.getAuthHeaders();
    const authHeader = headers.get('Authorization');
    
    // Detailed logging of request setup
    console.debug('GetMe - Request configuration:', {
      url: `${environment.ApiUrl}/getuserdetails`,
      token: token.substring(0, 20) + '...',
      authHeader: authHeader,
      allHeaders: headers.keys().map((key: string) => `${key}: ${headers.get(key)}`)
    });
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('GetMe - Invalid Authorization header');
      return throwError(() => new Error('Invalid Authorization header'));
    }
    
    this.getMeCache$ = this.http.get<any>(`${environment.ApiUrl}/getuserdetails`, { 
      headers: headers,
      observe: 'response'
    }).pipe(
      retry(1),
      timeout(30000),
      tap(response => {
        console.debug('GetMe - Response received:', {
          status: response.status,
          headers: response.headers.keys().map((key: string) => `${key}: ${response.headers.get(key)}`),
          hasBody: !!response.body
        });

        if (!response.body?.userdetails?.[0]) {
          console.error('GetMe - Invalid response format:', response.body);
          this.resetGetMeCache();
          throw new Error('Invalid user details response');
        }

        const userDetails = response.body.userdetails[0];
        if (userDetails) {
          this.user = {
            ...userDetails,
            name: userDetails.name || ''
          };
          this._userLoginCount = userDetails.login_status || 0;
          this._checkExistsSubscription = userDetails.subscription_exists || 0;
          this.storeUserData(userDetails);
        }
      }),
      map(response => response.body),
      catchError(error => {
        console.error('GetMe - Request failed:', {
          status: error.status,
          message: error.message,
          headers: error.headers?.keys().map((key: string) => `${key}: ${error.headers.get(key)}`),
          requestHeaders: headers.keys().map((key: string) => `${key}: ${headers.get(key)}`)
        });
        
        this.resetGetMeCache();
        
        if (error.status === 401) {
          console.debug('GetMe - Unauthorized error, clearing token and cache');
          this.clearToken();
          this.router.navigate(['/login']);
          return throwError(() => new Error('Session expired. Please login again.'));
        }
        
        return throwError(() => error);
      }),
      shareReplay({ 
        bufferSize: 1, 
        refCount: false,
        windowTime: this.CACHE_DURATION 
      })
    );

    return this.getMeCache$;
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
      localStorage.setItem(tokenKey, cleanToken);
      
      // Verify token was saved correctly
      const savedToken = localStorage.getItem(tokenKey);
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
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(environment.tokenKey); // Clear both possible locations
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
    if (!encryptedData) {
      console.warn('Empty encrypted data provided');
      return null;
    }

    try {
      // First try to decode base64 to check for malformed data
      let decodedArray;
      try {
        decodedArray = new Uint8Array(
          atob(encryptedData).split('').map(char => char.charCodeAt(0))
        );
      } catch (decodeError) {
        console.error('Error decoding base64 data:', decodeError);
        return null;
      }

      const key = await this.getKey(environment.secretKeySalt);

      // Extract IV and encrypted data
      const iv = decodedArray.slice(0, 12);
      const data = decodedArray.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      // Check for valid UTF-8 data
      let decryptedStr;
      try {
        decryptedStr = new TextDecoder('utf-8', { fatal: true }).decode(decrypted);
      } catch (utf8Error) {
        console.error('Invalid UTF-8 data:', utf8Error);
        return null;
      }

      // Validate JSON structure
      try {
        return JSON.parse(decryptedStr);
      } catch (jsonError) {
        console.error('Invalid JSON data:', jsonError);
        return null;
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  // Add cache reset method with optional force parameter
  resetGetMeCache(force: boolean = false): void {
    if (force || !this.getMeCache$) {
      this.getMeCache$ = null;
      console.debug('GetMe cache reset');
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
}
