import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User, UserData} from '../@Models/user.model';
import {LoginRequest} from "../@Models/auth.model";
import {Store} from "@ngrx/store";
import {AuthState} from "./store/reducer";
import {login} from "./store/actions";
import {loginData$, selectLoading$, selectloggedIn$, selectMessage$} from "./store/selectors";
import {Router} from "@angular/router";
import {DataService} from '../data.service';
import {LocalStorageService} from "ngx-localstorage";

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
    public _checkExistsSubscription!: number;
    constructor(
        private http: HttpClient,
        private store: Store<AuthState>,
        private router: Router,
        private dataService: DataService,
    ) {
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

    getMe(): Observable<any> {
        // return of(Object.create({}));
        return this.http.get<any>(`${environment.ApiUrl}/getuserdetails`).pipe(
            tap((response) => {
                //localStorage.setItem('countryId', response.userdetails[0].interested_country_id)
                this.user = response.userdetails[0];
                this._userLoginCount = response.userdetails[0].login_status;
                this._checkExistsSubscription = response.userdetails[0].subscription_exists;
                localStorage.setItem("UserID",response.userdetails[0].id)
                localStorage.setItem("Name",response.userdetails[0].name)
                localStorage.setItem("phone",response.userdetails[0].phone)
                localStorage.setItem("credit_plans",response.userdetails[0].credit_plans)
                localStorage.setItem("questions_left",response.userdetails[0].questions_left)
                localStorage.setItem("guidlineAccepted", response.userdetails[0].guidelineaccept)
                // this.getCountry().subscribe(data => {
                //     data.filter((value: any) => {
                //         if (2 == value.id) {
                //             this.dataService.changeCountryName(value.country);
                //         }
                //     })
                // })
            }),
            catchError(() => {
                // this.storage.clear();
                this.router.navigateByUrl('/login');
                return throwError(new Error(''));
            })
        );
    }


    getCountry() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/country", {
            headers: headers,
        });
    }

    login(data: LoginRequest) {
        this.store.dispatch(login(data)); // action dispatch
    }

    selectLoading$() {
        return this.store.select(selectLoading$);
    }

    selectMessage$() {
        return this.store.select(selectMessage$);
    }

    selectloggedIn$() {
        return this.store.select(selectloggedIn$);
    }

    selectLogInData$() {
        return this.store.select(loginData$);
    }

    logout() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/logout", {
            headers: headers,
        });
    }

    getToken() {
        return of('123');
    }

    isAuthenticated(val: any): Observable<UserData> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<UserData>(environment.ApiUrl + "/login", val, {
            headers: headers,
        });
    }


    Registraion(val: any): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Accept', "application/json")
        return this.http.post<{ message: string }>(environment.ApiUrl + '/register', val, {'headers': headers});

    }

    sendEmailOTP(data: any): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Accept', "application/json")
        return this.http.post<{ message: string }>(environment.ApiUrl + '/sendotp', data, {'headers': headers});
    }

    validateEmailOTP(data: any): Observable<{ message: string }> {
        const headers = new HttpHeaders()
            .set('Accept', "application/json")
        return this.http.post<{
            message: string
        }>(environment.ApiUrl + '/validateemailotp', data, {'headers': headers});
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
        const headers = new HttpHeaders()
            .set('Accept', "application/json")
        return this.http.post<any>(environment.ApiUrl + '/resetpassword', val, {'headers': headers});
    }

    getProgramLevel() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/programlevel", {
            headers: headers,
        });
    }

    getCountryList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/country", {
            headers: headers,
        });
    }

    getNewUserTimeLeft() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getsubscriptiontimeleft", {
            headers: headers,
        });
    }
    gmailLogin(data: any){
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/GoogleLogin", data,{
            headers: headers,
        });
    }
    isExist(data: any){
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/EmailExistOrNot", data,{
            headers: headers,
        });
    }
}
