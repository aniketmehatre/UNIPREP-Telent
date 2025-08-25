import {Injectable} from "@angular/core";
import {Observable, catchError, tap, throwError} from "rxjs";
import { HttpClient } from "@angular/common/http";
import {environment} from "@env/environment";
import {LoginRequest, LoginResponse} from "../../@Models/auth.model";
import {LocalStorageService} from "ngx-localstorage";
import { AuthService } from "../auth.service";

@Injectable({providedIn: 'root'})
export class AuthStoreService {
    constructor(
        private http: HttpClient, 
        private storage: LocalStorageService,
        private authService:AuthService
        ) {}

    login(request: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse>(environment.ApiUrl + "/login", request).pipe(
            tap((response) =>
             this.storage.set(environment.tokenKey, response.token)),
             catchError((error) => {
                this.authService.canDisableSignIn.next(false);
                return throwError(error);
            })
        );
    }
}
