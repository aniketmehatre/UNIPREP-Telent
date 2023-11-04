import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {LocalStorageService} from 'ngx-localstorage';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DataService } from '../data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  min!: any;
  userData: any;
  sec: any;
  constructor(
    private storage: LocalStorageService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    let isExpired: boolean;
    try {
      const token = this.storage.get<string>('token') || '123';
      const helper = new JwtHelperService();
      isExpired = helper.isTokenExpired(token);
      this.dataService.showTimerSource.subscribe((data) => {
        if (data == "EXPIRED" || data === null) {
          this.min = 0;
          this.dataService.showTimeOut(true);
          return;
        }
        if (data) {
          data = data.split("-", 4);
          this.min = data[2];
          this.sec = data[3];
          let count = this.authService._userLoginCount;
          if ((this.min === "1" && count === 4) || (this.min === "0" && count == 4)) {
            this.dataService.showTimeOut(true);
          }
        }
      });

    } catch (e) { isExpired = true; }
    if (!isExpired) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }

}
